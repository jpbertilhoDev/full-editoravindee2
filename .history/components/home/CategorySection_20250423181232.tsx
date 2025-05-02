"use client";

import Link from 'next/link';
import { Category } from '@/lib/types';
import { ChevronRight, BookOpen, Coffee, BookMarked, BookText, Users, Sparkles, Bookmark, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategorySectionProps {
  categories: Category[];
}

// Mapeamento de categorias para ícones
const getCategoryIcon = (slug: string) => {
  const icons: Record<string, React.ReactNode> = {
    'bibles': <BookOpen className="h-7 w-7" />,
    'devotionals': <Coffee className="h-7 w-7" />,
    'fiction': <BookMarked className="h-7 w-7" />,
    'children': <Sparkles className="h-7 w-7" />,
    'theology': <BookText className="h-7 w-7" />,
    'biography': <Users className="h-7 w-7" />,
    'self-help': <PenTool className="h-7 w-7" />,
    'commentary': <Bookmark className="h-7 w-7" />,
    // Adicione mais mapeamentos de acordo com suas categorias
  };
  
  return icons[slug] || <BookOpen className="h-7 w-7" />; // ícone padrão
};

const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <section className="py-12 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Browse Categories</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Explore our curated collection of books organized by category, designed to inspire and strengthen your faith journey.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link 
                href={`/products/category/${category.slug}`}
                className="group flex flex-col items-center text-center p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full"
              >
                <div className="w-14 h-14 mb-3 rounded-full bg-[#08a4a7]/10 flex items-center justify-center text-[#08a4a7] group-hover:bg-[#08a4a7] group-hover:text-white transition-colors duration-300">
                  {getCategoryIcon(category.slug)}
                </div>
                
                <h3 className="text-sm font-medium mb-1 group-hover:text-[#08a4a7] transition-colors">
                  {category.name}
                </h3>
                
                <div className="mt-auto pt-2">
                  <span className="inline-flex items-center text-xs text-[#08a4a7] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse
                    <ChevronRight className="h-3 w-3 ml-0.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Ver todas as categorias em telas pequenas */}
        <div className="mt-6 text-center md:hidden">
          <Link 
            href="/products/categories"
            className="inline-flex items-center text-sm font-medium text-[#08a4a7]"
          >
            View All Categories
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;