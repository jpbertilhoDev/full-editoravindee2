"use client";

import Link from 'next/link';
import { Category } from '@/lib/types';
import { BookOpen, Coffee, BookMarked, Sparkles, BookText, Users, PenTool, Bookmark, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategorySectionProps {
  categories: Category[];
}

// Mapeamento de categorias para ícones e cores
const categoryConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  'bibles': { 
    icon: <BookOpen className="h-5 w-5" />, 
    color: "bg-emerald-50 text-emerald-600" 
  },
  'devotionals': { 
    icon: <Coffee className="h-5 w-5" />, 
    color: "bg-blue-50 text-blue-600" 
  },
  'fiction': { 
    icon: <BookMarked className="h-5 w-5" />, 
    color: "bg-purple-50 text-purple-600" 
  },
  'children': { 
    icon: <Sparkles className="h-5 w-5" />, 
    color: "bg-amber-50 text-amber-600" 
  },
  'theology': { 
    icon: <BookText className="h-5 w-5" />, 
    color: "bg-indigo-50 text-indigo-600" 
  },
  'biography': { 
    icon: <Users className="h-5 w-5" />, 
    color: "bg-rose-50 text-rose-600" 
  },
  'self-help': { 
    icon: <PenTool className="h-5 w-5" />, 
    color: "bg-cyan-50 text-cyan-600" 
  },
  'commentary': { 
    icon: <Bookmark className="h-5 w-5" />, 
    color: "bg-orange-50 text-orange-600" 
  },
};

const getCategoryStyle = (slug: string) => {
  return categoryConfig[slug] || { 
    icon: <BookOpen className="h-5 w-5" />, 
    color: "bg-teal-50 text-teal-600" 
  };
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold mb-3 text-gray-900 tracking-tight"
          >
            Browse Categories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 text-sm max-w-xl mx-auto"
          >
            Explore our curated collection of books organized by category, designed to inspire and strengthen your faith journey.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((category) => {
            const { icon, color } = getCategoryStyle(category.slug);
            const [bgColor, textColor] = color.split(' ');
            
            return (
              <motion.div 
                key={category.id}
                variants={itemVariants}
                className="relative"
              >
                <Link 
                  href={`/products/category/${category.slug}`}
                  className={`group block w-full h-full rounded-xl p-5 transition-all duration-300 ${bgColor} hover:shadow-md hover:scale-105`}
                >
                  <div className="flex flex-col items-center text-center h-full">
                    <div className={`flex items-center justify-center rounded-full ${textColor} mb-3 transition-all duration-300 p-3`}>
                      {icon}
                    </div>
                    
                    <h3 className={`font-medium text-sm mb-1 ${textColor} group-hover:text-gray-900 transition-colors`}>
                      {category.name}
                    </h3>
                    
                    <span className="mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 inline-flex items-center text-xs font-medium text-gray-600">
                      Explore
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                  
                  <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-current group-hover:border-opacity-10 transition-all duration-300" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link 
            href="/products/categories"
            className="inline-flex items-center bg-white text-gray-800 hover:text-[#08a4a7] transition-colors font-medium px-5 py-2 rounded-full border border-gray-200 hover:shadow-sm"
          >
            View All Categories
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;