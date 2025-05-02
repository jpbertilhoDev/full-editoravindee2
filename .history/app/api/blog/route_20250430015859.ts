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
} from "firebase/firestore";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  try {
    if (slug) {
      // Get a specific blog post by slug
      const docRef = doc(db, "blogPosts", slug);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json({
        id: docSnap.id,
        ...docSnap.data(),
      });
    } else {
      // Get all blog posts (with optional filtering)
      const category = searchParams.get("category");
      const featured = searchParams.get("featured");

      let postsQuery: any = collection(db, "blogPosts");

      // Apply filters if they exist
      const filters = [];

      if (category) {
        filters.push(where("category", "==", category));
      }

      if (featured) {
        filters.push(where("featured", "==", featured));
      }

      // Always filter for published posts
      filters.push(where("status", "==", "published"));

      if (filters.length > 0) {
        postsQuery = query(postsQuery, ...filters, orderBy("date", "desc"));
      } else {
        postsQuery = query(
          postsQuery,
          where("status", "==", "published"),
          orderBy("date", "desc")
        );
      }

      const querySnapshot = await getDocs(postsQuery);
      const posts: { id: string; [key: string]: any }[] = [];

      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...(doc.data() as Record<string, any>),
        });
      });

      return NextResponse.json({ posts });
    }
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog data" },
      { status: 500 }
    );
  }
}
