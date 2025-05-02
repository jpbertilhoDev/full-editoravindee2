import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { products, featuredCategories, testimonials } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

// Componentes carregados imediatamente (críticos)
import Hero from '@/components/home/Hero';

// Componentes carregados dinamicamente para melhorar o First Contentful Paint
const FeaturedBooks = dynamic(() => import('@/components/home/FeaturedBooks'), {
  loading: () => <FeaturedBooksSkeleton />,
  ssr: true
});

const CategorySection = dynamic(() => import('@/components/home/CategorySection'), {
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg my-8"></div>,
  ssr: false
});

const Newsletter = dynamic(() => import('@/components/home/Newsletter'), {
  ssr: false
});

// Esqueletos para carregamento progressivo
function FeaturedBooksSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <Skeleton className="aspect-[3/4] w-full rounded-md mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-6 w-full mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  // Dados para os componentes carregados
  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.filter(product => product.bestSeller).slice(0, 8);
  
  return (
    <div>
      {/* Hero section carregado imediatamente - critical */}
      <Hero />
      
      {/* Componentes com carregamento progressivo */}
      <Suspense fallback={<FeaturedBooksSkeleton />}>
        <FeaturedBooks 
          products={featuredProducts} 
          title="Featured Books" 
          viewAllLink="/products" 
        />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}>
        <CategorySection 
          categories={featuredCategories}
          title="Shop by Category"
        />
      </Suspense>
      
      <Suspense fallback={<div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg my-8"></div>}>
        <Testimonials testimonials={testimonials} />
      </Suspense>
      
      <Newsletter />
    </div>
  );
}