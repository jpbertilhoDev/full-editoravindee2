import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import { Skeleton } from '@/components/ui/skeleton';
import { products, featuredCategories, testimonials } from '@/lib/data';

// Componentes carregados dinamicamente para melhorar o First Contentful Paint
const FeaturedBooks = dynamic(() => import('@/components/home/FeaturedBooks'), {
  loading: () => <FeaturedBooksSkeleton />,
  ssr: true
});

const CategoryShowcase = dynamic(() => import('@/components/home/CategoryShowcase'), {
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

const BlogPreview = dynamic(() => import('@/components/blog/BlogPreview'), {
  loading: () => <div className="h-80 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mt-8"></div>,
  ssr: false
});

const Newsletter = dynamic(() => import('@/components/home/Newsletter'), {
  ssr: false
});

const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg my-8"></div>,
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
  // Filter products for different sections
  const featuredProducts = products.filter(product => product.featured);
  const bestsellers = products.filter(product => product.bestSeller);
  const newReleases = products.filter(product => product.newRelease);

  return (
    <div>
      {/* Hero section carregado imediatamente - critical */}
      <HeroSection />
      
      {/* Componentes com carregamento progressivo */}
      <Suspense fallback={<FeaturedBooksSkeleton />}>
        <FeaturedBooks 
          products={featuredProducts} 
          title="Featured Books" 
          viewAllLink="/products" 
        />
      <FeaturedBooks 
        products={featuredProducts} 
        title="Featured Books" 
        viewAllLink="/products" 
      />
      
      <CategorySection categories={featuredCategories} />
      
      <FeaturedBooks 
        products={bestsellers} 
        title="Bestsellers" 
        viewAllLink="/products/category/bestsellers" 
      />
      
      <div className="py-12 bg-[#e9ffff]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-playfair font-bold mb-6 text-[#08a4a7]">
              "Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors, and the most patient of teachers."
            </h2>
            <p className="text-gray-600">― Charles W. Eliot</p>
          </div>
        </div>
      </div>
      
      <FeaturedBooks 
        products={newReleases || featuredProducts.slice(0, 4)} 
        title="New Releases" 
        viewAllLink="/products/category/new-releases" 
      />
      
      <Testimonials testimonials={testimonials} />
      
      <Newsletter />
    </div>
  );
}