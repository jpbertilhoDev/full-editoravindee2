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
  Timestamp,
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
  const searchTerm = searchParams.get("search");

  // Create a cache key based on request parameters
  const cacheKey = `blog-${slug || "all"}-${page}-${postsPerPage}-${
    category || "none"
  }-${featured || "none"}-${searchTerm || "none"}`;
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
      result = await getAllPosts(
        page,
        postsPerPage,
        category,
        featured,
        searchTerm
      );
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: now });

    return NextResponse.json(result, { headers, status: 200 });
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return NextResponse.json(
      { error: "Falha ao buscar dados do blog", posts: [] },
      { status: 200, headers } // Return 200 with empty posts to prevent cascade failures
    );
  }
}

// Helper function to get a post by slug
async function getPostBySlug(slug: string) {
  try {
    const postRef = doc(db, "blogPosts", slug);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      return {
        id: postDoc.id,
        ...postDoc.data(),
      };
    }
  } catch (error) {
    console.warn("Error getting post by direct ID, trying slug query", error);
  }

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

    throw new Error("Post not found");
  } catch (indexError) {
    console.error("Error in slug query:", indexError);
    throw new Error("Post not found");
  }
}

// Helper function to get all posts with filtering
async function getAllPosts(
  page: number,
  postsPerPage: number,
  category: string | null,
  featured: string | null,
  searchTerm: string | null
) {
  let allPosts: any[] = [];
  let totalCount = 0;

  try {
    // Build query based on filters
    let baseQuery = collection(db, "blogPosts");
    let constraints: any[] = [where("status", "==", "published")];

    // Add category filter if needed
    if (category) {
      constraints.push(where("category", "==", category));
    }

    // Add featured filter if needed
    if (featured) {
      constraints.push(where("featured", "==", featured === "true"));
    }

    // Create the query
    let postsQuery;

    try {
      // Only add orderBy for unfiltered or simple queries
      if (!category && !featured) {
        postsQuery = query(
          baseQuery,
          where("status", "==", "published"),
          orderBy("date", "desc")
        );
      } else {
        // For filtered queries, use basic constraints without ordering
        // We'll sort manually to avoid index requirements
        postsQuery = query(baseQuery, ...constraints);
      }

      // Execute the query
      const snapshot = await getDocs(postsQuery);
      totalCount = snapshot.docs.length;

      // Process all posts
      allPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort manually if we couldn't use orderBy in the query
      if (category || featured) {
        allPosts.sort((a, b) => {
          // Parse dates or fall back to timestamps
          const dateA = a.date
            ? new Date(a.date).getTime()
            : a.createdAt instanceof Timestamp
            ? a.createdAt.toMillis()
            : Date.now();
          const dateB = b.date
            ? new Date(b.date).getTime()
            : b.createdAt instanceof Timestamp
            ? b.createdAt.toMillis()
            : Date.now();
          return dateB - dateA;
        });
      }

      // Apply search filter if provided (client-side filtering)
      if (searchTerm) {
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        allPosts = allPosts.filter(
          (post) =>
            post.title?.toLowerCase().includes(lowercaseSearchTerm) ||
            post.excerpt?.toLowerCase().includes(lowercaseSearchTerm) ||
            post.content?.toLowerCase().includes(lowercaseSearchTerm)
        );
        totalCount = allPosts.length;
      }

      // Apply pagination
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
      throw error;
    }
  } catch (error) {
    console.error("Error in getAllPosts:", error);

    // Return empty result on error
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
}
