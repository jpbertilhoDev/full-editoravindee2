import Hero from '@/components/home/Hero';
import FeaturedBooks from '@/components/home/FeaturedBooks';
import CategorySection from '@/components/home/CategorySection';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import { products, featuredCategories, testimonials } from '@/lib/data';

export default function Home() {
  // Filter products for different sections
  const featuredProducts = products.filter(product => product.featured);
  const bestsellers = products.filter(product => product.bestSeller);
  const newReleases = products.filter(product => product.newRelease);

  return (
    <div>
      <Hero />
      
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