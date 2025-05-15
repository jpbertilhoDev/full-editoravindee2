import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { products, featuredCategories } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

// Componentes carregados imediatamente (críticos)
import Hero from '@/components/home/Hero';

// Componentes carregados dinamicamente com estratégia otimizada
const FeaturedBooks = dynamic(() => import('@/components/home/FeaturedBooks'), {
  loading: () => <FeaturedBooksSkeleton />,
  ssr: true // Manter SSR para componentes visíveis acima da dobra
});

const CategorySection = dynamic(() => import('@/components/home/CategorySection'), {
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false // Desativar SSR para componentes abaixo da dobra
});

const BestSellers = dynamic(() => import('@/components/home/BestSellers'), {
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg my-8"></div>,
  ssr: false
});

const Newsletter = dynamic(() => import('@/components/home/Newsletter'), {
  ssr: false
});

// Componente de esqueleto otimizado com menor quantidade de elementos DOM
function FeaturedBooksSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg shadow-md p-4 bg-gray-100 dark:bg-gray-800 animate-pulse h-[360px]" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  // Preparando dados de forma otimizada
  const featuredProducts = products.slice(0, 4);
  
  // Filtrando produtos que são bestsellers
  const bestSellerProducts = products.filter(product => product.bestSeller).slice(0, 6);
  
  return (
    <div>
      {/* Hero section carregado imediatamente - critical */}
      <Hero />
      
      {/* Componentes com carregamento progressivo e limites de prioridade */}
      <Suspense fallback={<FeaturedBooksSkeleton />}>
        <FeaturedBooks 
          products={featuredProducts} 
          title="Featured Books" 
          viewAllLink="/products" 
        />
      </Suspense>
      
      {/* Usando fragment para agrupar componentes de menor prioridade */}
      <>
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}>
          <CategorySection 
            categories={featuredCategories}
            title="Shop by Category"
          />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg my-8"></div>}>
          <BestSellers products={bestSellerProducts} />
        </Suspense>
        
        <Newsletter />
      </>
    </div>
  );
}