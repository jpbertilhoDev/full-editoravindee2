"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types';
import ProductCard from '../products/ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  viewAllLink?: string;
}

const FeaturedProducts = ({ 
  products, 
  title = "Featured Books", 
  viewAllLink = "/products" 
}: FeaturedProductsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  };

  const getVisibleProducts = () => {
    // This function would be replaced with proper responsive logic
    return products.slice(currentIndex, currentIndex + productsPerPage.desktop);
  };

  const nextPage = () => {
    const newIndex = currentIndex + productsPerPage.desktop;
    if (newIndex < products.length) {
      setCurrentIndex(newIndex);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const prevPage = () => {
    const newIndex = currentIndex - productsPerPage.desktop;
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
    } else {
      setCurrentIndex(Math.max(0, products.length - productsPerPage.desktop)); // Go to last page
    }
  };

  const visibleProducts = getVisibleProducts();
  const hasMoreProducts = products.length > productsPerPage.desktop;

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-playfair font-bold">{title}</h2>
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </Link>
          )}
        </div>

        <div className="relative">
          {hasMoreProducts && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-sm rounded-full hidden md:flex"
                onClick={prevPage}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-sm rounded-full hidden md:flex"
                onClick={nextPage}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {hasMoreProducts && (
          <div className="flex justify-center mt-8 md:hidden">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(products.length / productsPerPage.mobile) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * productsPerPage.mobile)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i * productsPerPage.mobile === currentIndex
                      ? "bg-primary"
                      : "bg-gray-300 dark:bg-gray-700"
                  )}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;