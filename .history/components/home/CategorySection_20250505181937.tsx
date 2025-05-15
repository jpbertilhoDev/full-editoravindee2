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

// Cores para associar a cada categoria
const categoryColors: Record<string, string> = {
  'bibles': 'from-blue-500/20 to-blue-100/30',
  'devotionals': 'from-amber-500/20 to-amber-100/30',
  'fiction': 'from-indigo-500/20 to-indigo-100/30',
  'children': 'from-purple-500/20 to-purple-100/30',
  'theology': 'from-green-500/20 to-green-100/30',
  'biography': 'from-orange-500/20 to-orange-100/30',
  'self-help': 'from-pink-500/20 to-pink-100/30',
  'commentary': 'from-teal-500/20 to-teal-100/30',
};

// Cores do ícone para cada categoria
const iconColors: Record<string, string> = {
  'bibles': 'text-blue-600',
  'devotionals': 'text-amber-600',
  'fiction': 'text-indigo-600',
  'children': 'text-purple-600',
  'theology': 'text-green-600',
  'biography': 'text-orange-600',
  'self-help': 'text-pink-600',
  'commentary': 'text-teal-600',
};

// Ícones mais cristianizados e personalizados
const getCategoryIcon = (slug: string) => {
  // Para renderizar ícones com mais estilo visual
  const renderStyledIcon = (icon: React.ReactNode, color: string) => (
    <div className={`relative flex items-center justify-center ${color}`}>
      <div className="absolute inset-0 bg-white/40 rounded-full blur-md"></div>
      {icon}
    </div>
  );

  // Mapeamento de ícones personalizados para cada categoria
  const icons: Record<string, React.ReactNode> = {
    'bibles': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
      </svg>
    ),
    'devotionals': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" />
      </svg>
    ),
    'fiction': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
      </svg>
    ),
    'children': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    ),
    'theology': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
      </svg>
    ),
    'biography': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
      </svg>
    ),
    'self-help': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
      </svg>
    ),
    'commentary': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.554.535-5.152.535-.243 0-.484-.014-.724-.028-.226-.013-.45-.025-.68-.025-2.02 0-3.064 1.891-4.928 1.891-1.02 0-1.379-.627-1.505-1.227-.257-1.223-.39-1.973-.39-2.876 0-1.024.33-2.528.898-3.028.278-.245.563-.463.863-.66l.03-.02c1.277-.836 2.956-1.933 2.638-3.303-.327-1.434-2.236-1.35-3.163-1.422-.802-.065-1.428-.525-1.6-1.179-.172-.652.144-1.275.386-1.642zm10.636 8.46c0-1.232-.336-2.608-1.136-3.174-.8-.566-2-.187-3.028.566C9.1 10.296 8.298 12.4 8.298 14.245c0 .686.128 1.216.265 1.625.057.17.142.333.268.455.434.431.922.452 1.43.028 1.383-1.155 5.223-3.59 5.223-5.122zm-7.5 1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-6-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm15 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
      </svg>
    ),
  };
  
  const colorClass = iconColors[slug] || 'text-gray-700';
  return icons[slug] || <BookOpen size={32} weight="duotone" className="w-8 h-8" />;
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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-1 bg-[#08a4a7] mb-4 rounded-full"></div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Browse Categories
            </h2>
          </motion.div>
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
          {categories.map((category) => {
            const gradientClass = categoryColors[category.slug] || 'from-gray-200 to-white';
            const iconColor = iconColors[category.slug] || 'text-gray-700';
            
            return (
              <motion.div 
                key={category.id}
                variants={itemVariants}
                className="relative"
              >
                <Link 
                  href={`/products/category/${category.slug}`}
                  className="group flex flex-col items-center justify-center text-center p-6 rounded-xl bg-gradient-to-br border border-white shadow-md hover:shadow-lg transition-all duration-300 h-48"
                  style={{
                    background: `radial-gradient(circle at center, rgb(255, 255, 255) 0%, rgb(249, 250, 251) 100%)`,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className={`flex items-center justify-center ${iconColor} mb-5 transform group-hover:scale-110 transition-transform duration-300`}>
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientClass} opacity-60`}></div>
                      <div className="relative z-10">
                        {getCategoryIcon(category.slug)}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-lg text-gray-900 group-hover:text-[#08a4a7] transition-colors">
                    {category.name}
                  </h3>
                  
                  <span className="inline-flex items-center text-sm font-medium mt-2 text-[#08a4a7] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore
                    <CaretRight size={16} weight="bold" className="ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
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