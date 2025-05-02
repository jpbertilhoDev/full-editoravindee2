import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    // URL base do site
    const baseUrl = "https://www.editoravinde.com.br";

    // Sitemap XML cabeçalho
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Adicionar páginas estáticas principais
    const staticPages = [
      "",
      "/produtos",
      "/blog",
      "/sobre",
      "/contato",
      "/termos",
      "/privacidade",
    ];

    for (const path of staticPages) {
      sitemap += `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    }

    // Buscar posts do blog publicados
    const blogPostsQuery = query(
      collection(db, "blogPosts"),
      where("status", "==", "published")
    );

    const blogPostsSnapshot = await getDocs(blogPostsQuery);

    // Adicionar posts do blog ao sitemap
    blogPostsSnapshot.forEach((doc) => {
      const post = doc.data();
      if (post.slug) {
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${
      post.updatedAt || post.date || new Date().toISOString().split("T")[0]
    }</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    });

    // Buscar produtos publicados
    const productsQuery = query(
      collection(db, "products"),
      where("status", "==", "active")
    );

    const productsSnapshot = await getDocs(productsQuery);

    // Adicionar produtos ao sitemap
    productsSnapshot.forEach((doc) => {
      const product = doc.data();
      if (product.slug) {
        sitemap += `
  <url>
    <loc>${baseUrl}/produtos/${product.slug}</loc>
    <lastmod>${
      product.updatedAt || new Date().toISOString().split("T")[0]
    }</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    });

    // Fechar o sitemap
    sitemap += `
</urlset>`;

    // Configurar headers e retornar o XML
    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
