"use client"

import React from 'react';
import { TestimonialType } from '@/lib/types';
import { ShoppingBag, Star, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestimonialsProps {
  testimonials: TestimonialType[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
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