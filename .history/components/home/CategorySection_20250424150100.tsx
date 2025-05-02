"use client";

import Link from 'next/link';
import { Category } from '@/lib/types';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Coffee, 
  Books, 
  Sparkle, 
  BookBookmark, 
  Users, 
  PenNib, 
  BookmarkSimple,
  CaretRight
} from '@phosphor-icons/react';

interface CategorySectionProps {
  categories: Category[];
}

// Mapeamento de categorias para ícones Phosphor
const getCategoryIcon = (slug: string) => {
  const icons: Record<string, React.ReactNode> = {
    'bibles': <BookOpen size={32} weight="light" />,
    'devotionals': <Coffee size={32} weight="light" />,
    'fiction': <Books size={32} weight="light" />,
    'children': <Sparkle size={32} weight="light" />,
    'theology': <BookBookmark size={32} weight="light" />,
    'biography': <Users size={32} weight="light" />,
    'self-help': <PenNib size={32} weight="light" />,
    'commentary': <BookmarkSimple size={32} weight="light" />,
  };
  
  return icons[slug] || <BookOpen size={32} weight="light" />; // ícone padrão
};

const CategorySection = ({ categories }: CategorySectionProps) => {
  // Variante para animação dos cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-gray-900"
          >
            Browse Categories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 text-base max-w-xl mx-auto"
          >
            Explore our curated collection of books organized by category, designed to inspire and strengthen your faith journey.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {categories.map((category) => (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              className="relative"
            >
              <Link 
                href={`/products/category/${category.slug}`}
                className="group flex flex-col items-center justify-center text-center p-8 rounded-xl bg-gray-50 hover:bg-white transition-all duration-300 h-48 border border-gray-100 hover:border-gray-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-center text-gray-700 group-hover:text-[#08a4a7] transition-colors duration-300 mb-5">
                  {getCategoryIcon(category.slug)}
                </div>
                
                <h3 className="font-medium text-lg mb-1.5 text-gray-900 group-hover:text-[#08a4a7] transition-colors">
                  {category.name}
                </h3>
                
                <span className="inline-flex items-center text-sm font-medium text-gray-500 group-hover:text-[#08a4a7] mt-2 transition-colors">
                  Explore
                  <CaretRight size={16} weight="bold" className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link 
            href="/products/categories"
            className="inline-flex items-center bg-white text-gray-900 hover:text-[#08a4a7] transition-colors font-medium px-6 py-3 rounded-full border border-gray-200 hover:shadow-md"
          >
            View All Categories
            <CaretRight size={18} weight="bold" className="ml-2 group-hover:ml-3 transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;