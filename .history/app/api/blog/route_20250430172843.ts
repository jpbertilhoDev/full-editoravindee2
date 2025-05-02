import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  getCountFromServer,
} from "firebase/firestore";

// Increase cache time for better performance
export const revalidate = 86400; // Revalidate once per day

// Memory cache for blog posts
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const postsPerPage = parseInt(searchParams.get("limit") || "6", 10);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  // Create a cache key based on request parameters
  const cacheKey = `blog-${slug || "all"}-${page}-${postsPerPage}-${
    category || "none"
  }-${featured || "none"}`;
  const now = Date.now();
  const cachedData = cache.get(cacheKey);

  // Set up headers with proper caching directives
  const headers = new Headers();
  headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  headers.set("CDN-Cache-Control", "public, max-age=86400");
  headers.set("Vercel-CDN-Cache-Control", "public, max-age=86400");

  // Return cached data if available and fresh
  if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
    headers.set("X-Cache", "HIT");
    return NextResponse.json(cachedData.data, { headers });
  }

  headers.set("X-Cache", "MISS");

  try {
    let result;

    if (slug) {
      // Get a specific blog post by slug
      result = await getPostBySlug(slug);
    } else {
      // Get all blog posts with filtering
      result = await getAllPosts(page, postsPerPage, category, featured);
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: now });

    return NextResponse.json(result, { headers, status: 200 });
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog data", posts: [] },
      { status: 200, headers } // Return 200 with empty posts to prevent cascade failures
    );
  }
}

// Helper function to get a post by slug
async function getPostBySlug(slug: string) {
  // First try to find it using an optimized query if possible
  try {
    const slugQuery = query(
      collection(db, "blogPosts"),
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1)
    );
    const slugSnapshot = await getDocs(slugQuery);

    if (!slugSnapshot.empty) {
      const doc = slugSnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    }
  } catch (indexError) {
    console.warn("Index error in slug query, falling back to manual filtering");
  }

  // Fallback: Get all posts and filter
  const allPostsQuery = query(
    collection(db, "blogPosts"), 
    where("status", "==", "published")
  );
  const allSnapshot = await getDocs(allPostsQuery);

  if (allSnapshot.empty) {
    throw new Error("No posts found");
  }

  // Filter manually by slug
  const postDoc = allSnapshot.docs.find(
    (doc) => doc.data().slug === slug
  );

  if (!postDoc) {
    throw new Error("Post not found");
  }

  return {
    id: postDoc.id,
    ...postDoc.data(),
  };
}

// Helper function to get all posts with filtering
async function getAllPosts(
  page: number,
  postsPerPage: number,
  category: string | null,
  featured: string | null
) {
  // Try optimized query with indexes first
  try {
    let postsQuery = query(
      collection(db, "blogPosts"),
      where("status", "==", "published"),
      orderBy("date", "desc")
    );

    // If category filtering is needed, we need a compound index
    if (category) {
      postsQuery = query(
        collection(db, "blogPosts"),
        where("status", "==", "published"),
        where("category", "==", category),
        orderBy("date", "desc")
      );
    }

    // If featured filtering is needed, we need another compound index
    if (featured) {
      postsQuery = query(
        collection(db, "blogPosts"),
        where("status", "==", "published"),
        where("featured", "==", featured),
        orderBy("date", "desc")
      );
    }

    const snapshot = await getDocs(postsQuery);

    if (snapshot.empty) {
      return {
        posts: [],
        pagination: {
          totalCount: 0,
          currentPage: page,
          totalPages: 0,
          hasMore: false,
        },
      };
    }

    // Process the results
    let allPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, any>),
    }));

    // Apply additional filtering if needed for complex combinations
    if (category && featured) {
      allPosts = allPosts.filter(
        (post) => post.category === category && post.featured === featured
      );
    }

    // Apply pagination
    const totalCount = allPosts.length;
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / postsPerPage),
        hasMore: endIndex < totalCount,
      },
    };
  } catch (error) {
    console.error("Error in optimized query:", error);

    // Fallback to simpler query - just get published posts
    const allPostsQuery = query(
      collection(db, "blogPosts"),
      where("status", "==", "published")
    );
    
    const allSnapshot = await getDocs(allPostsQuery);

    const posts = allSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Record<string, any>),
      }))
      .filter((post) => !category || post.category === category)
      .filter((post) => !featured || post.featured === featured)
      .sort((a, b) => {
        try {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } catch {
          return 0;
        }
      });

    // Apply pagination
    const totalCount = posts.length;
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / postsPerPage),
        hasMore: endIndex < totalCount,
      },
    };
  }
}
