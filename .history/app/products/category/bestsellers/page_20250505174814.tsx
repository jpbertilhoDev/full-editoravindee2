import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import { products } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';

export const metadata: Metadata = {
  title: 'Mais Vendidos | Editora Vinde Europa',
  description: 'Descubra os livros mais populares da Editora Vinde Europa. Uma seleção dos títulos mais vendidos para enriquecer sua vida espiritual.',
};

export default function BestsellersPage() {
  // Filtra apenas produtos marcados como bestsellers
  const bestsellers = products.filter(product => product.bestSeller);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6">
          <ol className="flex flex-wrap items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-[#08a4a7]">
                Home
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <Link href="/products" className="text-gray-600 hover:text-[#08a4a7]">
                Produtos
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li className="font-medium text-gray-900">Mais Vendidos</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-1 bg-[#08a4a7] rounded-full"></div>
            <h1 className="text-3xl font-bold">
              Mais Vendidos
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Nossa seleção de títulos mais populares, escolhidos por milhares de leitores. Descubra livros que têm impactado vidas e aprofundado a fé de muitos.
          </p>
        </div>

        {/* Banner promocional */}
        <div className="bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] text-white p-6 rounded-lg mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Promoção Especial</h2>
              <p className="max-w-lg">
                Compre qualquer livro da seção de mais vendidos e ganhe 10% de desconto na próxima compra.
              </p>
            </div>
            <Link 
              href="/products"
              className="mt-4 md:mt-0 flex items-center bg-white text-[#08a4a7] px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              Ver todos os produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty state */}
        {bestsellers.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">Não encontramos produtos nesta categoria</h2>
            <p className="text-gray-600 mb-6">
              Por favor, volte mais tarde ou explore outras categorias.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center text-[#08a4a7] font-medium hover:text-[#0bdbb6] transition-colors"
            >
              Ver todos os produtos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 