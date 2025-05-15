import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  getDoc,
} from "firebase/firestore";

// Add cache control headers for better performance
export const revalidate = 600; // Revalidate every 10 minutes

// Lista de categorias disponíveis
const categories = [
  "Vida Cristã",
  "Estudo Bíblico",
  "História da Igreja",
  "Família",
  "Teologia",
  "Missões",
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const postsPerPage = parseInt(searchParams.get("limit") || "6", 10);
  const category = searchParams.get("category");

  try {
    if (slug) {
      // Buscar post específico pelo slug
      const postDoc = await getDoc(doc(db, "blogPosts", slug));
      
      if (!postDoc.exists()) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json({
        id: postDoc.id,
        ...postDoc.data(),
      });
    } else {
      // Construir a query para os posts
      let postsQuery = collection(db, "blogPosts");
      const filters = [];

      // Filtrar por categoria se necessário
      if (category && category !== "todas") {
        filters.push(where("category", "==", category));
      }

      // Filtrar apenas posts publicados
      filters.push(where("status", "==", "published"));

      // Aplicar filtros e ordenação
      if (filters.length > 0) {
        postsQuery = query(postsQuery, ...filters, orderBy("date", "desc"));
      } else {
        postsQuery = query(
          postsQuery,
          where("status", "==", "published"),
          orderBy("date", "desc")
        );
      }

      // Aplicar paginação
      const pageSize = postsPerPage;
      let pageQuery = query(postsQuery, limit(pageSize));

      // Buscar posts da página atual
      const querySnapshot = await getDocs(pageQuery);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Configurar cabeçalhos de cache
      const headers = new Headers();
      headers.set("Cache-Control", "public, max-age=60, s-maxage=300");

      return NextResponse.json(
        {
          posts,
          pagination: {
            totalCount: posts.length, // Estimativa (em produção você usaria countFromServer)
            currentPage: page,
            totalPages: Math.ceil(posts.length / postsPerPage),
            hasMore: posts.length === postsPerPage,
          },
        },
        {
          headers,
          status: 200,
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
