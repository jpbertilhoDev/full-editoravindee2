"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Play, Pause } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t, i18n } = useTranslation();

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

      const handleError = (e: Event) => {
        console.error('Video failed to load', e);
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

  // Função para processar o título corretamente com base no idioma
  const renderTitle = () => {
    const title = t('title', 'Descubra Livros para a Sua Jornada de Fé');
    const currentLang = i18n.language?.substring(0, 2) || 'pt';
    
    // Para português, o formato pode ser diferente
    if (currentLang === 'pt') {
      return (
        <>
          <span className="block md:inline-block">Descubra Livros </span>
          <span className="text-[#4dfed1] text-6xl md:text-7xl lg:text-8xl block md:inline-block">
            para a Sua Jornada de Fé
          </span>
        </>
      );
    }
    
    // Para inglês e outros idiomas
    const parts = title.split(' for ');
    if (parts.length > 1) {
      return (
        <>
          <span className="block md:inline-block">{parts[0]} </span>
          <span className="text-[#4dfed1] text-6xl md:text-7xl lg:text-8xl block md:inline-block">
            for {parts[1]}
          </span>
        </>
      );
    }
    
    // Fallback para qualquer outro formato
    return <span>{title}</span>;
  };

  return (
    <div className="relative overflow-hidden h-screen w-full flex items-center justify-center -mt-[80px]">
      {/* Video Background Container */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Video - Usando fonte de vídeo alternativa e adicionando fallback image */}
        {!videoError ? (
          <video 
            ref={videoRef}
            id="hero-video"
            autoPlay 
            muted 
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
            poster="/bible-background.jpg"
            onError={() => setVideoError(true)}
          >
            <source 
              src="https://res.cloudinary.com/djzpkouvy/video/upload/v1698756329/bible-pages-video_ddxdzt.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/bible-background.jpg)' }}
          />
        )}
        
        {/* Gradiente melhorado para dar mais profundidade e contexto visual */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-[#031B30]/80 via-black/40 to-[#08a4a7]/30 transition-opacity duration-500 z-10 ${
            isScrolled 
              ? 'opacity-80' 
              : videoLoaded && !videoError 
                ? 'opacity-70' 
                : 'opacity-75'
          }`}
        ></div>
      </div>

      {/* Video controls - only show if video loaded */}
      {videoLoaded && !videoError && (
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
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pt-28 md:pt-32 flex justify-center items-center">
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          className="max-w-3xl text-center space-y-10"
          >
          <div className="inline-flex items-center px-4 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mx-auto">
            <BookOpen className="h-4 w-4 mr-2 text-[#4dfed1]" />
            <span>{t('tagline', 'Inspirando Fé Através da Literatura')}</span>
          </div>
          
          <div className="space-y-5">
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              {renderTitle()}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mx-auto max-w-2xl font-light">
              {t('description', 'Explore a nossa cuidadosa seleção de Bíblias, devocionais e literatura cristã para fortalecer a sua caminhada espiritual.')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-5 justify-center pt-5">
            <Button asChild size="lg" className="bg-[#08a4a7] hover:bg-[#0bdbb6] text-white rounded-md px-8 py-6 text-lg backdrop-blur-sm shadow-lg">
              <Link href="/products" className="flex items-center">
                {t('shop_now', 'Comprar Agora')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-md px-8 py-6 text-lg border-[#4dfed1]/50 bg-[#4dfed1]/10 backdrop-blur-sm hover:bg-[#4dfed1]/20 text-white hover:border-[#4dfed1] shadow-lg">
              <Link href="/products/category/bestsellers">{t('bestsellers', 'Mais Vendidos')}</Link>
            </Button>
          </div>
          
          <div className="pt-5 flex items-center justify-center text-sm md:text-base text-white/80 bg-white/10 backdrop-blur-sm p-4 rounded-md border border-white/20 max-w-max mx-auto">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4dfed1]">
                <path d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.25495L8.90702 8.25495L11.993 2.00195L15.079 8.25495L21.979 9.25495L16.979 14.122L18.158 20.995L12 17.75Z" fill="currentColor" />
              </svg>
            <span>{t('trusted_by', 'Confiado por mais de 10.000 clientes satisfeitos em todo o mundo')}</span>
            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default Hero;