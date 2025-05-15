import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";

// Cache control for better performance
export const revalidate = 3600; // Revalidate categories every hour

// Categorias simuladas para backup
const mockCategories = [
  "Vida Cristã",
  "Estudo Bíblico",
  "História da Igreja",
  "Família",
  "Teologia",
  "Missões",
];

export async function GET() {
  try {
    // Tentar buscar categorias do Firebase
    try {
      // Query para buscar todas as categorias de posts publicados
      const postsQuery = query(
        collection(db, "blogPosts"),
        where("status", "==", "published")
      );

      const querySnapshot = await getDocs(postsQuery);
      const categories = new Set<string>();

      // Extrair categorias únicas
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category && typeof data.category === "string") {
          categories.add(data.category);
        }
      });

      // Se não encontrou categorias, usar as simuladas
      if (categories.size === 0) {
        throw new Error("Nenhuma categoria encontrada");
      }

      // Converter Set para array e ordenar
      const categoriesArray = Array.from(categories).sort();

      // Set cache control headers
      const headers = new Headers();
      headers.set("Cache-Control", "public, max-age=1800, s-maxage=3600");

      return NextResponse.json(
        { categories: categoriesArray },
        {
          headers,
          status: 200,
        }
      );
    } catch (error) {
      console.error("Erro ao buscar categorias do Firebase:", error);
      
      // Usar categorias simuladas como fallback
      const headers = new Headers();
      headers.set("Cache-Control", "public, max-age=1800, s-maxage=3600");

      return NextResponse.json(
        { categories: mockCategories },
        {
          headers,
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
}
