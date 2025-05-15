"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Sparkles, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import WishlistButton from '@/components/products/WishlistButton';

interface BestSellersProps {
  products: Product[];
}

const BestSellers = ({ products }: BestSellersProps) => {
  const { addToCart } = useCart();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-white to-[#F7FCFC]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-[#08a4a7]" />
              <h2 className="text-2xl font-bold tracking-tight">Mais Vendidos</h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Descubra os livros que estão fazendo sucesso entre os nossos leitores
            </p>
          </div>
          
          <Link 
            href="/products/category/bestsellers" 
            className="group inline-flex items-center text-[#08a4a7] font-medium text-sm mt-4 md:mt-0 hover:text-[#0bdbb6] transition-colors"
          >
            Ver Todos
            <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product, idx) => {
            const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
            const discountPercentage = hasDiscount
              ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; 
                          target.src = '/images/book-placeholder.jpg';
                        }}
                      />
                      
                      {/* Book badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {hasDiscount && (
                          <div className="bg-red-500 text-white px-1.5 py-0.5 text-[10px] font-medium rounded shadow-sm">
                            {discountPercentage}% OFF
                          </div>
                        )}
                        <div className="bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-medium rounded shadow-sm">
                          Bestseller
                        </div>
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
                          
                          <WishlistButton product={product} size="sm" />
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
        </div>
      </div>
    </section>
  );
};

export default BestSellers; 