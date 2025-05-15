import { NextResponse } from "next/server";

// Cache control for better performance
export const revalidate = 3600; // Revalidate categories every hour

// Lista de categorias disponíveis
const categories = [
  "Vida Cristã",
  "Estudo Bíblico",
  "História da Igreja",
  "Família",
  "Teologia",
  "Missões"
];

export async function GET() {
  try {
    // Set cache control headers
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=1800, s-maxage=3600");

    return NextResponse.json(
      { categories },
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
