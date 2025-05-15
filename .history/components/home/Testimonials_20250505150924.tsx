"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TestimonialType } from '@/lib/types';
import { ShoppingBag, Star, Shield, TrendingUp, ChevronRight, ChevronLeft, Fire } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '@/lib/data';

interface TestimonialsProps {
  testimonials: TestimonialType[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  // Filtrar produtos mais vendidos (com a flag bestSeller)
  const bestSellers = products.filter(product => product.bestSeller).slice(0, 6);
  
  // Estado para controle do carrossel
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState<typeof bestSellers>([]);

  // Atualizar produtos exibidos quando o índice mudar
  useEffect(() => {
    const productsPerPage = window?.innerWidth < 768 ? 1 : window?.innerWidth < 1024 ? 2 : 3;
    const startIndex = activeIndex % bestSellers.length;
    const newDisplayedProducts = [];
    
    for (let i = 0; i < productsPerPage; i++) {
      const index = (startIndex + i) % bestSellers.length;
      newDisplayedProducts.push(bestSellers[index]);
    }
    
    setDisplayedProducts(newDisplayedProducts);
  }, [activeIndex, bestSellers]);

  // Navegar para o próximo conjunto de produtos
  const nextProducts = () => {
    setActiveIndex((prevIndex) => prevIndex + 1);
  };

  // Navegar para o conjunto anterior de produtos
  const previousProducts = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : bestSellers.length - 1));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Nossos Clientes Amam Comprar Aqui</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra por que milhares de pessoas escolhem nossa loja para suas compras online.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">12.500+</p>
            <p className="text-sm text-gray-600">Pedidos entregues</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <Star className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">4.8/5</p>
            <p className="text-sm text-gray-600">Média de satisfação</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">100%</p>
            <p className="text-sm text-gray-600">Compras seguras</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">8.400+</p>
            <p className="text-sm text-gray-600">Clientes recorrentes</p>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center">
              <Fire className="h-6 w-6 text-red-500 mr-2" />
              Mais Vendidos
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={previousProducts} 
                className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
                aria-label="Produtos anteriores"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextProducts} 
                className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
                aria-label="Próximos produtos"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={product.coverImage} 
                        alt={product.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {product.bestSeller && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        Mais Vendido
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-medium text-gray-800 text-lg mb-1 line-clamp-1">{product.title}</h4>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.author}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800">R$ {product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-primary px-2 py-1 bg-primary/5 rounded font-medium">
                        Comprar
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link 
              href="/products" 
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Ver todos os produtos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Depoimentos */}
        <h3 className="text-xl font-semibold text-center mb-8">O que nossos clientes estão dizendo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm flex flex-col h-full relative"
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex-grow mb-6">
                <p className="text-gray-700 text-sm">
                  "{testimonial.content}"
                </p>
              </div>
              
              <div className="flex items-center">
                {testimonial.image && (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                )}
                <div>
                  <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                  {testimonial.role && (
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <a 
            href="/products" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Comece a comprar agora
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;