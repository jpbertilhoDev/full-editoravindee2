import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Star, ChevronRight, Truck, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import ImageGallery from '@/components/products/ImageGallery';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Esta função é necessária para gerar rotas estáticas para cada produto
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);
  
  if (!product) {
    notFound();
  }
  
  // Get related products
  const relatedProducts = product.relatedProducts
    ? products.filter((p) => product.relatedProducts?.includes(p.id))
    : products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Simular múltiplas imagens para o produto
  // Em um caso real, isso viria da sua base de dados
  const productImages = [
    product.coverImage,
    "/images/book-preview-1.jpg",
    "/images/book-preview-2.jpg",
    "/images/book-preview-3.jpg",
  ];

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      hasDiscount={hasDiscount}
      discountPercentage={discountPercentage}
      productImages={productImages}
    />
  );
}