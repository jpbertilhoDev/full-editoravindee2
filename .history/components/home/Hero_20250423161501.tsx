"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#e9ffff] to-white dark:from-[#08a4a7] dark:to-[#0bdbb6]/70">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0bdbb6] via-[#4dfed1] to-[#91ffff] z-10"></div>
      
      {/* Abstract Shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#91ffff]/30 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-[#4dfed1]/20 blur-3xl"></div>
      
      {/* Glass morphism card - mobile only */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hidden sm:block"></div>

      <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#91ffff]/20 border border-[#08a4a7]/10 text-[#08a4a7] dark:text-white text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2 text-[#0bdbb6]" />
              <span>Specially curated for spiritual growth</span>
            </div>
            
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#08a4a7] dark:text-white leading-tight">
              Discover Books <br />
              <span className="bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] text-transparent bg-clip-text dark:from-[#4dfed1] dark:to-[#91ffff]">
                for Your Faith Journey
              </span>
            </h1>
            
            <p className="text-lg text-[#08a4a7]/80 dark:text-[#e9ffff]/90 max-w-lg leading-relaxed">
              Explore our curated collection of Bibles, devotionals, and 
              Christian literature to strengthen your walk with God.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] hover:from-[#0bdbb6] hover:to-[#08a4a7] text-white rounded-full px-8 shadow-lg shadow-[#4dfed1]/20 border-0">
                <Link href="/products" className="flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-[#08a4a7]/30 hover:bg-[#91ffff]/10 text-[#08a4a7] dark:text-white dark:border-[#e9ffff]/30">
                <Link href="/products/category/bestsellers">Bestsellers</Link>
              </Button>
            </div>
            
            <div className="pt-4 flex items-center text-sm text-[#08a4a7]/80 dark:text-[#e9ffff]/80 bg-[#91ffff]/10 p-3 rounded-lg backdrop-blur-sm border border-[#91ffff]/20 max-w-max">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#0bdbb6]">
                <path d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.25495L8.90702 8.25495L11.993 2.00195L15.079 8.25495L21.979 9.25495L16.979 14.122L18.158 20.995L12 17.75Z" fill="currentColor" />
              </svg>
              <span>Trusted by over 10,000 satisfied customers</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main image with glass effect border */}
            <div className="relative overflow-hidden rounded-2xl border-8 border-white/50 dark:border-[#91ffff]/20 shadow-2xl shadow-[#4dfed1]/20 backdrop-blur-sm">
              <img
                src="https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Christian books collection"
                className="w-full h-auto object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#08a4a7]/30 to-transparent mix-blend-overlay"></div>
            </div>
            
            {/* Floating promotion card with glass morphism */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 backdrop-blur-md bg-white/80 dark:bg-[#08a4a7]/80 p-6 rounded-xl shadow-lg border border-[#91ffff]/30 z-10 transform rotate-0"
            >
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="text-[#0bdbb6]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.25495L8.90702 8.25495L11.993 2.00195L15.079 8.25495L21.979 9.25495L16.979 14.122L18.158 20.995L12 17.75Z" />
                    </svg>
                  </div>
                ))}
              </div>
              <p className="mt-2 font-medium text-[#08a4a7] dark:text-white text-lg">Summer Reading Sale</p>
              <p className="text-sm text-[#08a4a7]/70 dark:text-[#e9ffff]/80">Save up to 30% on selected titles</p>
            </motion.div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-4 -right-4 bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] p-3 rounded-full shadow-lg z-10"
            >
              <span className="text-white font-bold text-sm">NEW</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;