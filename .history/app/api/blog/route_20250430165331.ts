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
      // Get a specific blog post by slug - simplificado para evitar problemas de índice
      const allPostsQuery = query(collection(db, "blogPosts"));

      const allSnapshot = await getDocs(allPostsQuery);

      if (allSnapshot.empty) {
        return NextResponse.json({ error: "No posts found" }, { status: 404 });
      }

      // Filtra manualmente pelo slug
      const postDoc = allSnapshot.docs.find(
        (doc) => doc.data().slug === slug && doc.data().status === "published"
      );

      if (!postDoc) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json({
        id: postDoc.id,
        ...postDoc.data(),
      });
    } else {
      // Get all blog posts without complex queries to avoid index issues
      try {
        // Abordagem simplificada para evitar erros de índice
        const allPostsQuery = query(collection(db, "blogPosts"));
        const allSnapshot = await getDocs(allPostsQuery);

        if (allSnapshot.empty) {
          return NextResponse.json({ posts: [] }, { status: 200 });
        }

        // Filtrar e ordenar manualmente no cliente
        let allPosts = allSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Record<string, any>),
          }))
          .filter((post) => post.status === "published");

        // Aplicar filtro de categoria se necessário
        const category = searchParams.get("category");
        if (category) {
          allPosts = allPosts.filter((post) => post.category === category);
        }

        // Aplicar filtro de featured se necessário
        const featured = searchParams.get("featured");
        if (featured) {
          allPosts = allPosts.filter((post) => post.featured === featured);
        }

        // Ordenar manualmente por data (decrescente)
        allPosts.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        // Aplicar paginação manual
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const paginatedPosts = allPosts.slice(startIndex, endIndex);

        // Set cache control headers
        const headers = new Headers();
        headers.set("Cache-Control", "public, max-age=60, s-maxage=300");

        return NextResponse.json(
          {
            posts: paginatedPosts,
            pagination: {
              totalCount: allPosts.length,
              currentPage: page,
              totalPages: Math.ceil(allPosts.length / postsPerPage),
              hasMore: endIndex < allPosts.length,
            },
          },
          {
            headers,
            status: 200,
          }
        );
      } catch (indexError) {
        console.error("Index error fetching blog data:", indexError);

        // Fallback para busca sem índices caso o erro seja de índice
        const allPostsQuery = query(collection(db, "blogPosts"));
        const allSnapshot = await getDocs(allPostsQuery);

        const posts = allSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Record<string, any>),
          }))
          .filter((post) => post.status === "published")
          .sort((a, b) => {
            try {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            } catch {
              return 0;
            }
          });

        return NextResponse.json({ posts }, { status: 200 });
      }
    }
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog data", posts: [] },
      { status: 200 } // Return 200 with empty posts instead of 500 to prevent cascade failures
    );
  }
}
