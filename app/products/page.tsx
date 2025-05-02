import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { products, featuredCategories } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';

export const metadata: Metadata = {
  title: 'Shop Christian Books | Grace Bookstore',
  description: 'Browse our collection of Bibles, devotionals, Christian fiction, and more.',
};

export default function ProductsPage() {
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
            <li className="font-medium text-foreground">All Books</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold mb-2">
            All Books
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of Christian books and Bibles.
          </p>
        </div>

        {/* Category Quick Links */}
        <div className="flex flex-wrap gap-3 mb-8">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products/category/${category.slug}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-sm transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination (static for now) */}
        <div className="mt-12 flex justify-center">
          <nav className="flex space-x-2" aria-label="Pagination">
            <span className="px-3 py-2 border rounded-md bg-primary text-white">
              1
            </span>
            <Link
              href="#"
              className="px-3 py-2 border rounded-md text-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              2
            </Link>
            <Link
              href="#"
              className="px-3 py-2 border rounded-md text-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              3
            </Link>
            <span className="px-3 py-2 text-muted-foreground">...</span>
            <Link
              href="#"
              className="px-3 py-2 border rounded-md text-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              8
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}