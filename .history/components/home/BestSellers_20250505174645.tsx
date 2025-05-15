"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BestSellersProps {
  products: Product[];
}

const BestSellers = ({ products }: BestSellersProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-[#08a4a7]" />
            <h2 className="text-3xl font-bold">Mais Vendidos</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra os livros que estão fazendo sucesso entre os nossos leitores. Escolhas populares que inspiram e fortalecem a fé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    <Image
                      src={product.coverImage}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-0 left-0 bg-amber-500 text-white m-3 px-2 py-1 text-xs font-medium rounded shadow-sm">
                      Bestseller
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-[#08a4a7] transition-colors">
                      {product.title}
                    </h3>
                    
                    <p className="text-sm text-gray-700 mb-1">{product.author}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex">
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
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-gray-400 line-through text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        className="bg-[#08a4a7] hover:bg-[#0bdbb6] text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/products/category/bestsellers" 
            className="inline-flex items-center gap-2 font-medium text-[#08a4a7] hover:text-[#0bdbb6] transition-colors"
          >
            Ver todos os mais vendidos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers; 