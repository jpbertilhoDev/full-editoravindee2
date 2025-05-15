import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";

// Add cache control headers for better performance
export const revalidate = 600; // Revalidate every 10 minutes

// Dados simulados para o blog (backup)
const mockPosts = [
  {
    id: "1",
    title: "A importância da oração na vida cristã",
    excerpt:
      "Descubra como a prática da oração pode transformar sua vida espiritual e fortalecer seu relacionamento com Deus.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-05-01",
    author: "João Silva",
    category: "Vida Cristã",
    imageUrl:
      "https://images.unsplash.com/photo-1517174637803-6884735717fc?q=80&w=1000&auto=format&fit=crop",
    slug: "importancia-da-oracao",
    status: "published",
    featured: "yes",
  },
  {
    id: "2",
    title: "Estudo bíblico: O livro de Tiago",
    excerpt:
      "Um guia prático para entender as lições do livro de Tiago e aplicá-las no dia a dia.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-04-15",
    author: "Maria Oliveira",
    category: "Estudo Bíblico",
    imageUrl:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000&auto=format&fit=crop",
    slug: "estudo-biblico-tiago",
    status: "published",
    featured: "no",
  },
  {
    id: "3",
    title: "Como cultivar o fruto do Espírito na sua vida",
    excerpt:
      "Estratégias práticas para desenvolver amor, alegria, paz e outros frutos espirituais mencionados em Gálatas 5.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-03-28",
    author: "Pedro Santos",
    category: "Vida Cristã",
    imageUrl:
      "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=1000&auto=format&fit=crop",
    slug: "fruto-do-espirito",
    status: "published",
    featured: "no",
  },
  {
    id: "testando",
    title: "testando",
    excerpt: "estou testando",
    content: "Conteúdo de teste criado pelo administrador",
    date: "2023-05-01",
    author: "faith",
    category: "Vida Cristã",
    imageUrl: "",
    slug: "testando",
    status: "published",
    featured: "no",
  }
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const postsPerPage = parseInt(searchParams.get("limit") || "6", 10);
  const category = searchParams.get("category");

  try {
    // Tentar obter posts do Firebase
    let firebasePosts = [];
    let useFirebase = false;
    
    try {
      if (slug) {
        // Buscar post específico pelo slug
        const postDoc = await getDoc(doc(db, "blogPosts", slug));
        
        if (postDoc.exists()) {
          return NextResponse.json({
            id: postDoc.id,
            ...postDoc.data(),
          });
        }
        
        // Se não encontrou no Firebase, tenta nos dados simulados
        const mockPost = mockPosts.find(post => post.slug === slug);
        if (mockPost) {
          return NextResponse.json(mockPost);
        }
        
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      
      // Buscar posts do Firebase
      let postsQuery = collection(db, "blogPosts");
      
      // Aplicar filtros
      if (category && category !== "todas") {
        postsQuery = query(
          postsQuery,
          where("category", "==", category),
          where("status", "==", "published"),
          orderBy("date", "desc")
        );
      } else {
        postsQuery = query(
          postsQuery,
          where("status", "==", "published"),
          orderBy("date", "desc")
        );
      }
      
      // Aplicar paginação
      postsQuery = query(postsQuery, limit(postsPerPage));
      
      const querySnapshot = await getDocs(postsQuery);
      
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          firebasePosts.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        
        useFirebase = true;
      }
    } catch (error) {
      console.error("Erro ao buscar posts do Firebase:", error);
      // Não fazer nada, vamos continuar com os dados simulados
    }
    
    // Se conseguimos obter posts do Firebase, usamos eles
    if (useFirebase) {
      const headers = new Headers();
      headers.set("Cache-Control", "public, max-age=60, s-maxage=300");
      
      return NextResponse.json(
        {
          posts: firebasePosts,
          pagination: {
            totalCount: firebasePosts.length,
            currentPage: page,
            totalPages: Math.ceil(firebasePosts.length / postsPerPage),
            hasMore: firebasePosts.length === postsPerPage,
          },
        },
        {
          headers,
          status: 200,
        }
      );
    }
    
    // Caso contrário, usamos os dados simulados
    let filteredPosts = mockPosts;
    
    if (category && category !== "todas") {
      filteredPosts = mockPosts.filter(post => post.category === category);
    }
    
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=60, s-maxage=300");
    
    return NextResponse.json(
      {
        posts: paginatedPosts,
        pagination: {
          totalCount: filteredPosts.length,
          currentPage: page,
          totalPages: Math.ceil(filteredPosts.length / postsPerPage),
          hasMore: endIndex < filteredPosts.length,
        },
      },
      {
        headers,
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog data" },
      { status: 500 }
    );
  }
}
