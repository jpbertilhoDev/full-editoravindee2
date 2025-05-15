import { Suspense } from 'react';
import { products, featuredCategories } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

// Componentes carregados dinamicamente
import dynamic from 'next/dynamic';

// Carregar componentes críticos dinamicamente apenas no cliente
const Hero = dynamic(() => import('@/components/home/Hero'), {
  loading: () => (
    <div className="h-[400px] md:h-[600px] bg-gray-100 animate-pulse rounded-lg"></div>
  ),
  ssr: false
});

// Componente de teste de tradução
const TestTranslation = dynamic(() => import('@/components/ui/TestTranslation'), {
  ssr: false
});

// Componentes carregados dinamicamente com estratégia otimizada
const FeaturedBooks = dynamic(() => import('@/components/home/FeaturedBooks'), {
  loading: () => <FeaturedBooksSkeleton />,
  ssr: false // Carregar apenas no cliente
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
  loading: () => <div className="h-40 w-full bg-gray-100 animate-pulse rounded-lg my-8"></div>,
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
      {/* Hero section */}
      <Suspense fallback={<div className="h-[400px] md:h-[600px] bg-gray-100 animate-pulse rounded-lg"></div>}>
        <Hero />
      </Suspense>
      
      {/* DEBUG: Componente de teste de tradução */}
      <div className="container mx-auto my-8 px-4">
        <TestTranslation />
      </div>
      
      {/* Componentes com carregamento progressivo e limites de prioridade */}
      <Suspense fallback={<FeaturedBooksSkeleton />}>
        <FeaturedBooks 
          products={featuredProducts} 
        />
      </Suspense>
      
      {/* Usando fragment para agrupar componentes de menor prioridade */}
      <>
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}>
          <CategorySection 
            categories={featuredCategories}
          />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg my-8"></div>}>
          <BestSellers products={bestSellerProducts} />
        </Suspense>
        
        <Suspense fallback={<div className="h-40 w-full bg-gray-100 animate-pulse rounded-lg my-8"></div>}>
          <Newsletter />
        </Suspense>
      </>
    </div>
  );
}