import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, featuredCategories } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = featuredCategories.find(cat => cat.slug === params.category);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  return {
    title: `${category.name} | Grace Bookstore`,
    description: category.description || `Browse our collection of ${category.name.toLowerCase()} and more.`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = params;
  
  // Find the category from our data
  const category = featuredCategories.find(cat => cat.slug === categorySlug);
  
  // If category doesn't exist, show 404
  if (!category) {
    notFound();
  }
  
  // Special cases for bestsellers and new releases
  let filteredProducts;
  if (categorySlug === 'bestsellers') {
    filteredProducts = products.filter(product => product.bestSeller);
  } else if (categorySlug === 'new-releases') {
    filteredProducts = products.filter(product => product.newRelease);
  } else {
    // Filter products by category (case-insensitive)
    filteredProducts = products.filter(
      product => product.category.toLowerCase() === category.name.toLowerCase() || 
                product.subcategory?.toLowerCase() === category.name.toLowerCase()
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6">
          <ol className="flex flex-wrap items-center space-x-2">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <Link href="/products" className="text-muted-foreground hover:text-primary">
                All Books
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="font-medium text-foreground">{category.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>

        {/* Hero Image (if available) */}
        {category.image && (
          <div className="mb-10 rounded-lg overflow-hidden">
            <div className="aspect-[16/6] relative">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="text-white ml-10 max-w-lg">
                  <h2 className="text-3xl font-bold mb-2">Explore Our {category.name}</h2>
                  <p className="text-white/80">Find the perfect book to enrich your faith journey</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter options (simple implementation) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} results
          </div>
          <div className="flex gap-4">
            <select 
              className="text-sm border rounded-md px-3 py-2 bg-background"
              defaultValue="featured"
            >
              <option value="featured">Sort by Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="bestselling">Bestselling</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No products found in this category.</p>
            <Link 
              href="/products"
              className="text-primary hover:underline"
            >
              Browse all products
            </Link>
          </div>
        )}

        {/* Pagination (static for now) */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex space-x-2" aria-label="Pagination">
              <span className="px-3 py-2 border rounded-md bg-primary text-white">
                1
              </span>
              {filteredProducts.length > 8 && (
                <Link
                  href="#"
                  className="px-3 py-2 border rounded-md text-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  2
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}