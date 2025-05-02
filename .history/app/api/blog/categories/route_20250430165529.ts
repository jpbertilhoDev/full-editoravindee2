import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Cache control for better performance
export const revalidate = 3600; // Revalidate categories every hour

export async function GET() {
  try {
    // Consulta simples para todos os posts
    const postsRef = collection(db, "blogPosts");
    const snapshot = await getDocs(postsRef);
    
    const categories = new Set<string>();
    
    // Filtramos manualmente
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.status === "published" && data.category) {
        categories.add(data.category);
      }
    });
    
    const categoriesArray = Array.from(categories).sort();
    
    // Defina headers para caching
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=1800, s-maxage=3600");
    
    return NextResponse.json(
      { categories: categoriesArray },
      {
        headers,
        status: 200
      }
    );
  } catch (error) {
    console.error("Erro ao buscar categorias do blog:", error);
    
    // Retorna um array vazio em vez de um erro para evitar quebrar a UI
    return NextResponse.json(
      { categories: [] },
      { status: 200 }
    );
  }
}
