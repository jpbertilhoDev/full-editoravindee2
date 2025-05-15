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
    // Usando as categorias simuladas como resposta principal
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=1800, s-maxage=3600");

    return NextResponse.json(
      { categories: mockCategories },
      {
        headers,
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
}
