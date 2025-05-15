import { NextResponse } from "next/server";

// Esta API retorna uma resposta simples para verificar se o servidor está funcionando corretamente
export async function GET() {
  try {
    // Dados de teste
    const testPosts = [
      {
        id: "test1",
        title: "Post de teste 1",
        excerpt: "Este é um post de teste para verificar se a API está funcionando",
        content: "Conteúdo do post de teste 1",
        date: new Date().toISOString(),
        author: "Teste",
        category: "Teste",
        imageUrl: "",
        slug: "test-post-1",
        status: "published",
        featured: "no"
      },
      {
        id: "test2",
        title: "Post de teste 2",
        excerpt: "Este é outro post de teste para verificar se a API está funcionando",
        content: "Conteúdo do post de teste 2",
        date: new Date().toISOString(),
        author: "Teste",
        category: "Teste",
        imageUrl: "",
        slug: "test-post-2",
        status: "published",
        featured: "no"
      },
      {
        id: "testando",
        title: "Post administrativo",
        excerpt: "Este é um post que simula o que foi criado pelo administrador",
        content: "Conteúdo do post administrativo",
        date: new Date().toISOString(),
        author: "Admin",
        category: "Teste",
        imageUrl: "",
        slug: "testando",
        status: "published",
        featured: "no"
      }
    ];
    
    // Configurar headers
    const headers = new Headers();
    headers.set("Cache-Control", "no-store");
    
    return NextResponse.json(
      {
        posts: testPosts,
        pagination: {
          totalCount: testPosts.length,
          currentPage: 1,
          totalPages: 1,
          hasMore: false
        },
        system_info: {
          timestamp: new Date().toISOString(),
          node_env: process.env.NODE_ENV || "unknown",
          api_status: "working"
        }
      },
      {
        headers,
        status: 200
      }
    );
  } catch (error) {
    console.error("Erro na API de teste:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro na API de teste", details: String(error) },
      { status: 500 }
    );
  }
} 