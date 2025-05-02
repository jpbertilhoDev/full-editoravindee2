"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Play, Pause } from 'lucide-react';

const Hero = () => {
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleVideo = () => {
    const video = document.getElementById('hero-video') as HTMLVideoElement;
    if (videoPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setVideoPlaying(!videoPlaying);
  };

  return (
    <div className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full bg-black/30 z-10">
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        
        {/* Video */}
        <video 
          id="hero-video"
          autoPlay 
          muted 
          loop
          playsInline
          className="absolute w-full h-full object-cover object-center z-[-1]"
        >
          <source 
            src="https://player.vimeo.com/external/370331493.sd.mp4?s=e90dcaba73c19e0e36f03406b47b5e33cd8b592e&profile_id=139&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Video controls */}
        <button 
          onClick={toggleVideo}
          className="absolute bottom-6 right-6 z-30 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
          aria-label={videoPlaying ? "Pause background video" : "Play background video"}
        >
          {videoPlaying ? (
            <Pause className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mx-auto">
            <BookOpen className="h-4 w-4 mr-2 text-[#4dfed1]" />
            Specially curated for spiritual growth
          </div>
          
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Discover Books <br />
            <span className="text-[#4dfed1]">
              for Your Faith Journey
            </span>
          </h1>
          
          <p className="text-lg text-white/90 mx-auto">
            Explore our curated collection of Bibles, devotionals, and 
            Christian literature to strengthen your walk with God.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#08a4a7] hover:bg-[#0bdbb6] text-white rounded-md px-6 backdrop-blur-sm">
              <Link href="/products" className="flex items-center">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-md px-6 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white">
              <Link href="/products/category/bestsellers">Bestsellers</Link>
            </Button>
          </div>
          
          <div className="pt-4 flex items-center text-sm text-white/80 bg-white/10 backdrop-blur-sm p-3 rounded-md border border-white/20 max-w-max mx-auto">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#4dfed1]">
              <path d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.25495L8.90702 8.25495L11.993 2.00195L15.079 8.25495L21.979 9.25495L16.979 14.122L18.158 20.995L12 17.75Z" fill="currentColor" />
            </svg>
            <span>Trusted by over 10,000 satisfied customers</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;