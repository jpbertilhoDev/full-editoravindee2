"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-[#e9ffff]">
      {/* Simple accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#08a4a7] z-10"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-md bg-white border border-[#08a4a7]/10 text-[#08a4a7] text-sm font-medium">
              Specially curated for spiritual growth
            </div>
            
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#08a4a7] leading-tight">
              Discover Books <br />
              <span className="text-[#0bdbb6]">
                for Your Faith Journey
              </span>
            </h1>
            
            <p className="text-lg text-[#08a4a7]/80 max-w-lg">
              Explore our curated collection of Bibles, devotionals, and 
              Christian literature to strengthen your walk with God.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#08a4a7] hover:bg-[#0bdbb6] text-white rounded-md px-6">
                <Link href="/products" className="flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-md px-6 border-[#08a4a7]/30 hover:bg-[#08a4a7]/5 text-[#08a4a7]">
                <Link href="/products/category/bestsellers">Bestsellers</Link>
              </Button>
            </div>
            
            <div className="pt-4 flex items-center text-sm text-[#08a4a7]/80 bg-white p-3 rounded-md border border-[#08a4a7]/10 max-w-max">
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
            {/* Main image with clean border */}
            <div className="relative overflow-hidden rounded-md border-4 border-white shadow-lg">
              <img
                src="https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Christian books collection"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Simplified promotion card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white p-5 rounded-md shadow-md border border-[#08a4a7]/10 z-10"
            >
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="text-[#0bdbb6]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.25495L8.90702 8.25495L11.993 2.00195L15.079 8.25495L21.979 9.25495L16.979 14.122L18.158 20.995L12 17.75Z" />
                    </svg>
                  </div>
                ))}
              </div>
              <p className="mt-2 font-medium text-[#08a4a7]">Summer Reading Sale</p>
              <p className="text-sm text-[#08a4a7]/70">Save up to 30% on selected titles</p>
            </motion.div>
            
            {/* Simple badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-3 -right-3 bg-[#08a4a7] p-2 rounded-md shadow-md z-10"
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