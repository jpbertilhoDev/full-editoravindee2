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
  const [visibleCount, setVisibleCount] = useState(5);
  
  // Effect to handle resize and update visible count
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(2);
      } else if (width < 1024) {
        setVisibleCount(3);
      } else if (width < 1280) {
        setVisibleCount(4);
      } else {
        setVisibleCount(5);
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
    <section className="py-12 relative overflow-hidden bg-gradient-to-br from-white to-[#F7FCFC]">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#08a4a7]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#08a4a7]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-[#08a4a7]" />
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Discover our handpicked selection of the most inspiring reads
            </p>
          </div>
          
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="group inline-flex items-center text-[#08a4a7] font-medium text-sm mt-4 md:mt-0 hover:text-[#0bdbb6] transition-colors"
            >
              View All
              <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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
                className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white h-8 w-8 rounded-full shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#08a4a7] focus:ring-offset-2 hidden md:flex"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4 text-[#08a4a7]" />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white h-8 w-8 rounded-full shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#08a4a7] focus:ring-offset-2 hidden md:flex"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4 text-[#08a4a7]" />
              </motion.button>
            </>
          )}

          {/* Products display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                      delay: idx * 0.05,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="group"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 group-hover:shadow-md h-full flex flex-col">
                        {/* Book cover */}
                        <div className="aspect-[2/3] relative overflow-hidden">
                          <Image
                            src={product.coverImage}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          {/* Book badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {hasDiscount && (
                              <div className="bg-red-500 text-white px-1.5 py-0.5 text-[10px] font-medium rounded shadow-sm">
                                {discountPercentage}% OFF
                              </div>
                            )}
                            {product.bestSeller && (
                              <div className="bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-medium rounded shadow-sm">
                                Bestseller
                              </div>
                            )}
                            {product.newRelease && (
                              <div className="bg-blue-500 text-white px-1.5 py-0.5 text-[10px] font-medium rounded shadow-sm">
                                New
                              </div>
                            )}
                          </div>
                          
                          {/* Quick action buttons */}
                          <div className={cn(
                            "absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 transform translate-y-8 transition-all duration-300",
                            hoveredIndex === idx ? "opacity-100 translate-y-0" : ""
                          )}>
                            <div className="flex justify-between items-center">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white hover:bg-[#08a4a7] hover:text-white text-[#08a4a7] rounded-full shadow-sm h-7 px-2.5 text-xs"
                                onClick={(e) => handleQuickAdd(e, product)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                              
                              <Button
                                variant="secondary"
                                size="icon"
                                className="bg-white text-[#08a4a7] hover:bg-[#08a4a7] hover:text-white h-7 w-7 rounded-full shadow-sm"
                              >
                                <Heart className="h-3 w-3" />
                                <span className="sr-only">Wishlist</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Book info */}
                        <div className="p-3 flex flex-col flex-grow">
                          <div className="text-xs text-muted-foreground truncate">{product.author}</div>
                          <h3 className="font-medium text-sm mt-0.5 line-clamp-2 group-hover:text-[#08a4a7] transition-colors min-h-[2.5rem]">
                            {product.title}
                          </h3>
                          
                          {/* Rating stars */}
                          <div className="flex items-center mt-auto pt-1.5">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={10}
                                  className={cn(
                                    "fill-current",
                                    i < Math.floor(product.rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground ml-1">
                              ({product.reviewCount})
                            </span>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-bold text-sm">${product.price.toFixed(2)}</span>
                            {hasDiscount && (
                              <span className="text-muted-foreground line-through text-xs">
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
            <div className="flex justify-center mt-6 md:hidden">
              <div className="flex space-x-1.5">
                {Array.from({ length: Math.ceil(products.length / visibleCount) }).map((_, i) => {
                  const isActive = activeIndex === i * visibleCount;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i * visibleCount)}
                      className={cn(
                        "transition-all duration-300",
                        isActive
                          ? "w-5 h-1.5 bg-[#08a4a7] rounded-full"
                          : "w-1.5 h-1.5 bg-gray-300 rounded-full"
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