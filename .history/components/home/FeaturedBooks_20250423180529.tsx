"use client"

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

interface FeaturedBooksProps {
  products: Product[];
  title?: string;
  viewAllLink?: string;
}

const FeaturedBooks = ({ 
  products, 
  title = "Featured Books", 
  viewAllLink = "/products" 
}: FeaturedBooksProps) => {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  
  // Effect to handle resize and update visible count
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 1024) {
        setVisibleCount(2);
      } else if (width < 1280) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex + visibleCount >= products.length 
        ? 0 
        : prevIndex + visibleCount
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex - visibleCount < 0 
        ? Math.max(0, products.length - visibleCount) 
        : prevIndex - visibleCount
    );
  };
  
  const visibleProducts = products.slice(activeIndex, activeIndex + visibleCount);
  const hasMorePages = products.length > visibleCount;
  
  // Handle quick add to cart
  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-white to-[#F7FCFC]">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#08a4a7]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#08a4a7]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-[#08a4a7]" />
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Discover our handpicked selection of the most inspiring and transformative reads
            </p>
          </div>
          
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="group inline-flex items-center text-[#08a4a7] font-medium mt-4 md:mt-0 hover:text-[#0bdbb6] transition-colors"
            >
              View All
              <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className="relative" ref={containerRef}>
          {/* Navigation buttons */}
          {hasMorePages && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white h-10 w-10 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#08a4a7] focus:ring-offset-2 hidden md:flex"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 text-[#08a4a7]" />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white h-10 w-10 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#08a4a7] focus:ring-offset-2 hidden md:flex"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-[#08a4a7]" />
              </motion.button>
            </>
          )}

          {/* Products display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            <AnimatePresence mode="wait">
              {visibleProducts.map((product, idx) => {
                const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                const discountPercentage = hasDiscount
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;
                  
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: idx * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="group"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 group-hover:shadow-xl">
                        {/* Book cover */}
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <Image
                            src={product.coverImage}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          {/* Book badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {hasDiscount && (
                              <div className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-md shadow-md">
                                Save {discountPercentage}%
                              </div>
                            )}
                            {product.bestSeller && (
                              <div className="bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded-md shadow-md">
                                Bestseller
                              </div>
                            )}
                            {product.newRelease && (
                              <div className="bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded-md shadow-md">
                                New Release
                              </div>
                            )}
                          </div>
                          
                          {/* Quick action buttons */}
                          <div className={cn(
                            "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 transform translate-y-8 transition-all duration-300",
                            hoveredIndex === idx ? "opacity-100 translate-y-0" : ""
                          )}>
                            <div className="flex justify-between items-center">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white hover:bg-[#08a4a7] hover:text-white text-[#08a4a7] rounded-full shadow-md"
                                onClick={(e) => handleQuickAdd(e, product)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                <span className="text-xs">Quick Add</span>
                              </Button>
                              
                              <Button
                                variant="secondary"
                                size="icon"
                                className="bg-white text-[#08a4a7] hover:bg-[#08a4a7] hover:text-white h-8 w-8 rounded-full shadow-md"
                              >
                                <Heart className="h-4 w-4" />
                                <span className="sr-only">Add to wishlist</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Book info */}
                        <div className="p-4">
                          <div className="text-sm text-muted-foreground">{product.author}</div>
                          <h3 className="font-semibold mt-1 line-clamp-2 group-hover:text-[#08a4a7] transition-colors">
                            {product.title}
                          </h3>
                          
                          {/* Rating stars */}
                          <div className="flex items-center mt-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={cn(
                                    "fill-current",
                                    i < Math.floor(product.rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({product.reviewCount})
                            </span>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                            {hasDiscount && (
                              <span className="text-muted-foreground line-through text-sm">
                                ${product.originalPrice?.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {/* Mobile pagination dots */}
          {hasMorePages && (
            <div className="flex justify-center mt-8 md:hidden">
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(products.length / visibleCount) }).map((_, i) => {
                  const isActive = activeIndex === i * visibleCount;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i * visibleCount)}
                      className={cn(
                        "transition-all duration-300",
                        isActive
                          ? "w-6 h-2 bg-[#08a4a7] rounded-full"
                          : "w-2 h-2 bg-gray-300 rounded-full"
                      )}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks; 