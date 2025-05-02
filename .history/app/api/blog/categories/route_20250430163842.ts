import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";

// Cache control for better performance
export const revalidate = 3600; // Revalidate categories every hour

export async function GET() {
  try {
    // Query to get all published posts
    const postsQuery = query(
      collection(db, "blogPosts"),
      where("status", "==", "published")
    );
    
    const querySnapshot = await getDocs(postsQuery);
    const categories = new Set<string>();
    
    // Extract unique categories
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category && typeof data.category === 'string') {
        categories.add(data.category);
      }
    });
    
    // Convert Set to array and sort
    const categoriesArray = Array.from(categories).sort();
    
    // Set cache control headers
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
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
} 