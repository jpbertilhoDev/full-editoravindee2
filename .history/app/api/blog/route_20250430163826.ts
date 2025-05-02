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

// Add cache control headers for better performance
export const revalidate = 600; // Revalidate every 10 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const postsPerPage = parseInt(searchParams.get("limit") || "6", 10);

  try {
    if (slug) {
      // Get a specific blog post by slug
      const postsQuery = query(
        collection(db, "blogPosts"),
        where("slug", "==", slug),
        where("status", "==", "published"),
        limit(1)
      );
      
      const querySnapshot = await getDocs(postsQuery);
      
      if (querySnapshot.empty) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      
      const postDoc = querySnapshot.docs[0];
      
      return NextResponse.json({
        id: postDoc.id,
        ...postDoc.data(),
      });
    } else {
      // Get all blog posts (with optional filtering)
      const category = searchParams.get("category");
      const featured = searchParams.get("featured");

      // Start building the query
      let postsQuery: any = collection(db, "blogPosts");
      const filters = [];

      if (category) {
        filters.push(where("category", "==", category));
      }

      if (featured) {
        filters.push(where("featured", "==", featured));
      }

      // Always filter for published posts
      filters.push(where("status", "==", "published"));

      // Apply filters and ordering
      if (filters.length > 0) {
        postsQuery = query(postsQuery, ...filters, orderBy("date", "desc"));
      } else {
        postsQuery = query(
          postsQuery,
          where("status", "==", "published"),
          orderBy("date", "desc")
        );
      }

      // Get the total count for pagination
      const countSnapshot = await getCountFromServer(postsQuery);
      const totalCount = countSnapshot.data().count;

      // Apply pagination
      postsQuery = query(postsQuery, limit(postsPerPage));
      
      // If not on the first page, use startAfter with cursor
      if (page > 1) {
        const cursorId = searchParams.get("cursor");
        if (cursorId) {
          try {
            const cursorDoc = await getDoc(doc(db, "blogPosts", cursorId));
            if (cursorDoc.exists()) {
              postsQuery = query(
                postsQuery, 
                startAfter(cursorDoc),
                limit(postsPerPage)
              );
            }
          } catch (error) {
            console.error("Error fetching cursor document:", error);
          }
        }
      }

      // Execute query with pagination
      const querySnapshot = await getDocs(postsQuery);
      const posts: { id: string; [key: string]: any }[] = [];
      let lastVisible: DocumentSnapshot | null = null;

      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...(doc.data() as Record<string, any>),
        });
        
        // Save last document for pagination
        lastVisible = doc;
      });

      // Set cache control headers
      const headers = new Headers();
      headers.set("Cache-Control", "public, max-age=60, s-maxage=300");
      
      return NextResponse.json(
        { 
          posts,
          pagination: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / postsPerPage),
            hasMore: posts.length === postsPerPage,
            nextCursor: lastVisible ? lastVisible.id : null
          }
        },
        { 
          headers,
          status: 200 
        }
      );
    }
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog data" },
      { status: 500 }
    );
  }
}
