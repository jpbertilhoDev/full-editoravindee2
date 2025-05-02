import React from 'react';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
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

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
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