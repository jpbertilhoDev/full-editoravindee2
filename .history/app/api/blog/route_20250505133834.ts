import { NextRequest, NextResponse } from "next/server";

// Add cache control headers for better performance
export const revalidate = 600; // Revalidate every 10 minutes

// Dados simulados para o blog
const mockPosts = [
  {
    id: "1",
    title: "A importância da oração na vida cristã",
    excerpt: "Descubra como a prática da oração pode transformar sua vida espiritual e fortalecer seu relacionamento com Deus.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-05-01",
    author: "João Silva",
    category: "Vida Cristã",
    imageUrl: "https://images.unsplash.com/photo-1517174637803-6884735717fc?q=80&w=1000&auto=format&fit=crop",
    slug: "importancia-da-oracao",
    status: "published",
    featured: "yes"
  },
  {
    id: "2",
    title: "Estudo bíblico: O livro de Tiago",
    excerpt: "Um guia prático para entender as lições do livro de Tiago e aplicá-las no dia a dia.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-04-15",
    author: "Maria Oliveira",
    category: "Estudo Bíblico",
    imageUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000&auto=format&fit=crop",
    slug: "estudo-biblico-tiago",
    status: "published",
    featured: "no"
  },
  {
    id: "3",
    title: "Como cultivar o fruto do Espírito na sua vida",
    excerpt: "Estratégias práticas para desenvolver amor, alegria, paz e outros frutos espirituais mencionados em Gálatas 5.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-03-28",
    author: "Pedro Santos",
    category: "Vida Cristã",
    imageUrl: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=1000&auto=format&fit=crop",
    slug: "fruto-do-espirito",
    status: "published",
    featured: "no"
  },
  {
    id: "4",
    title: "Desafios da fé cristã no mundo contemporâneo",
    excerpt: "Reflexões sobre como manter a fé em um mundo cada vez mais secular e desafiador para os cristãos.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-03-10",
    author: "Ana Costa",
    category: "Vida Cristã",
    imageUrl: "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=1000&auto=format&fit=crop",
    slug: "desafios-da-fe",
    status: "published",
    featured: "no"
  },
  {
    id: "5",
    title: "A história da Igreja Primitiva",
    excerpt: "Um mergulho na história dos primeiros cristãos e como suas experiências podem nos inspirar hoje.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-02-20",
    author: "Ricardo Mendes",
    category: "História da Igreja",
    imageUrl: "https://images.unsplash.com/photo-1548407260-da850faa41e3?q=80&w=1000&auto=format&fit=crop",
    slug: "igreja-primitiva",
    status: "published",
    featured: "no"
  },
  {
    id: "6",
    title: "Família cristã: Princípios bíblicos para um lar saudável",
    excerpt: "Como aplicar os princípios bíblicos para construir relacionamentos familiares sólidos e edificantes.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.",
    date: "2023-02-05",
    author: "Juliana Almeida",
    category: "Família",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
    slug: "familia-crista",
    status: "published",
    featured: "no"
  }
];

// Lista de categorias disponíveis
const categories = [
  "Vida Cristã",
  "Estudo Bíblico",
  "História da Igreja",
  "Família",
  "Teologia",
  "Missões"
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
      const post = mockPosts.find(post => post.slug === slug);
      
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json(post);
    } else {
      // Filtrar posts por categoria se necessário
      let filteredPosts = mockPosts;
      
      if (category && category !== 'todas') {
        filteredPosts = mockPosts.filter(post => post.category === category);
      }

      // Aplicar paginação
      const startIndex = (page - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      // Configurar cabeçalhos de cache
      const headers = new Headers();
      headers.set("Cache-Control", "public, max-age=60, s-maxage=300");

      return NextResponse.json(
        {
          posts: paginatedPosts,
          pagination: {
            totalCount: filteredPosts.length,
            currentPage: page,
            totalPages: Math.ceil(filteredPosts.length / postsPerPage),
            hasMore: endIndex < filteredPosts.length
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
