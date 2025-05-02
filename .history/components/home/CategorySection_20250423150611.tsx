import Link from 'next/link';
import { Category } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold mb-3">Browse Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of books organized by category, designed to inspire and strengthen your faith journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products/category/${category.slug}`}
              className="group overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-white/80 line-clamp-2">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-primary dark:text-blue-400">View Collection</span>
                <ChevronRight className="h-4 w-4 text-primary dark:text-blue-400 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;