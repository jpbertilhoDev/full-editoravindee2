"use client";

import { BookCard } from './BookCard';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export default function ProductCard({ product, priority, className }: ProductCardProps) {
  // Este componente agora é apenas um wrapper para BookCard para manter compatibilidade
  // com o código existente que usa ProductCard
  return (
    <BookCard 
      product={product} 
      priority={priority} 
      className={className}
    />
  );
} 