"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Play, Pause } from 'lucide-react';

const Hero = () => {
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Handle scroll events
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    // Ensure video plays
    if (videoRef.current) {
      const handleCanPlay = () => {
        setVideoLoaded(true);
        videoRef.current?.play().catch(error => {
          console.log('Video autoplay prevented:', error);
          setVideoPlaying(false);
        });
      };

      const handleError = () => {
        console.error('Video failed to load');
        setVideoError(true);
      };

      videoRef.current.addEventListener('canplay', handleCanPlay);
      videoRef.current.addEventListener('error', handleError);

      // Clean up
      return () => {
        window.removeEventListener('scroll', handleScroll);
        videoRef.current?.removeEventListener('canplay', handleCanPlay);
        videoRef.current?.removeEventListener('error', handleError);
      };
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    
    if (videoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.log('Video play prevented:', error);
      });
    }
    setVideoPlaying(!videoPlaying);
  };

  return (
    <div className="relative overflow-hidden h-screen w-full flex items-center justify-center -mt-[80px]">
      {/* Video Background Container */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Video */}
        <video 
          ref={videoRef}
          id="hero-video"
          autoPlay 
          muted 
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          poster="/bible-background.jpg"
        >
          <source 
            src="https://videos.pexels.com/video-files/5199853/5199853-uhd_2560_1440_25fps.mp4" 
            type="video/mp4" 
          />
          <source 
            src="https://videos.pexels.com/video-files/5199853/5199853-uhd_2560_1440_25fps.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay - transparent initially, then shows on scroll */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-500 z-10 ${
            isScrolled 
              ? 'opacity-40' 
              : videoLoaded && !videoError 
                ? 'opacity-15' 
                : 'opacity-25'
          }`}
        ></div>
      </div>

      {/* Video controls - only show if video loaded */}
      {videoLoaded && !videoError && (
        <button 
          onClick={toggleVideo}
          className="absolute bottom-8 right-8 z-30 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
          aria-label={videoPlaying ? "Pause background video" : "Play background video"}
        >
          {videoPlaying ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 text-white" />
          )}
        </button>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 pt-28 md:pt-32 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl text-center space-y-10"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-md bg-white/15 backdrop-blur-md border border-white/25 text-white text-base font-medium mx-auto">
            <BookOpen className="h-5 w-5 mr-3 text-[#4dfed1]" />
            Specially curated for spiritual growth
          </div>
          
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
            Discover Books <br />
            <span className="text-[#4dfed1] text-glow-cyan">
              for Your Faith Journey
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 mx-auto max-w-3xl leading-relaxed drop-shadow-sm">
            Explore our curated collection of Bibles, devotionals, and 
            Christian literature to strengthen your walk with God.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center mt-8">
            <Button asChild size="lg" className="bg-[#08a4a7] hover:bg-[#0bdbb6] text-white rounded-md px-8 py-6 text-lg shadow-lg shadow-[#08a4a7]/20 border-0">
              <Link href="/products" className="flex items-center">
                Shop Now
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-md px-8 py-6 text-lg border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white shadow-lg">
              <Link href="/products/category/bestsellers">Bestsellers</Link>
            </Button>
          </div>
          
          <div className="pt-6 flex items-center text-base text-white/90 bg-white/10 backdrop-blur-sm p-4 rounded-md border border-white/25 max-w-max mx-auto mt-10">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#4dfed1]">
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