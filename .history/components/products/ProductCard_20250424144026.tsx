"use client"

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/types';
import { cn, formatPriceWithoutSymbol } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300",
        featured && "md:col-span-2 lg:col-span-1"
      )}
    >
      <div className="relative">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-[3/4] overflow-hidden relative">
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Overlay on hover */}
            <div className={cn(
              "absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}></div>
          </div>
        </Link>
        
        {/* Quick action buttons */}
        <div className={cn(
          "absolute top-3 right-3 flex flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : ""
        )}>
          <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90 dark:bg-gray-800/90 h-8 w-8">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90 dark:bg-gray-800/90 h-8 w-8">
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Save for later</span>
          </Button>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              Save {discountPercentage}%
            </span>
          )}
          {product.newRelease && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              New Release
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              Bestseller
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-1 text-sm text-muted-foreground">{product.author}</div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-lg mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${
                i < product.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-lg">€ {formatPriceWithoutSymbol(product.price)}</span>
            {hasDiscount && (
              <span className="text-muted-foreground line-through text-sm">
                € {formatPriceWithoutSymbol(product.originalPrice)}
              </span>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full hover:bg-primary hover:text-white transition-colors"
            onClick={() => addToCart(product, 1)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span className="text-xs">Add</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;