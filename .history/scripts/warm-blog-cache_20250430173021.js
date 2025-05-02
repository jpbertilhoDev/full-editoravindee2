/**
 * Script to warm the blog cache by making requests to common paths
 * Run with: node scripts/warm-blog-cache.js
 */

const fetch = require('node-fetch');
const { db } = require('../lib/firebase-admin');

async function warmBlogCache() {
  console.log('Starting blog cache warming...');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    // 1. First, let's get all categories to warm them
    console.log('Fetching categories from Firestore...');
    const categoriesSet = new Set();
    const postsSnapshot = await db.collection('blogPosts')
      .where('status', '==', 'published')
      .get();
    
    postsSnapshot.docs.forEach(doc => {
      const category = doc.data().category;
      if (category) categoriesSet.add(category);
    });
    
    const categories = Array.from(categoriesSet);
    console.log(`Found ${categories.length} categories: ${categories.join(', ')}`);
    
    // 2. Let's warm the main blog page
    console.log(`Warming main blog page: ${baseUrl}/api/blog`);
    await fetch(`${baseUrl}/api/blog`);
    
    // 3. Warm each category page
    for (const category of categories) {
      console.log(`Warming category: ${category}`);
      await fetch(`${baseUrl}/api/blog?category=${encodeURIComponent(category)}`);
    }
    
    // 4. Warm featured posts
    console.log('Warming featured posts');
    await fetch(`${baseUrl}/api/blog?featured=yes`);
    
    // 5. Warm individual posts by slug
    console.log('Warming individual posts');
    const slugs = postsSnapshot.docs.map(doc => doc.data().slug).filter(Boolean);
    
    for (const slug of slugs.slice(0, 10)) { // Process first 10 for demo
      console.log(`Warming post: ${slug}`);
      await fetch(`${baseUrl}/api/blog?slug=${encodeURIComponent(slug)}`);
    }
    
    console.log('Cache warming complete!');
  } catch (error) {
    console.error('Error warming cache:', error);
  }
}

// Execute the function
warmBlogCache(); 