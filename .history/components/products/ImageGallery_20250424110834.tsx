"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(0);

  // Função para navegar pelas imagens no modal
  const navigateModal = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setModalImage((prev) => (prev + 1) % images.length);
    } else {
      setModalImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Abrir o modal com a imagem clicada
  const openModal = (index: number) => {
    setModalImage(index);
    setShowModal(true);
  };

  return (
    <div className="relative">
      {/* Imagem principal */}
      <div className="relative aspect-[3/4] bg-gray-50 rounded-md overflow-hidden group cursor-pointer" 
        onClick={() => openModal(mainImage)}>
        <Image 
          src={images[mainImage]} 
          alt={`${title} - Image ${mainImage + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/80 p-2 rounded-full">
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Miniaturas */}
      <div className="mt-3 flex gap-2 overflow-x-auto overflow-y-hidden pb-1 lg:flex-col lg:absolute lg:top-0 lg:left-0 lg:transform lg:-translate-x-full lg:mt-0 lg:ml-4 lg:h-full lg:max-h-[360px] lg:overflow-y-auto lg:overflow-x-hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className={cn(
              "relative min-w-[60px] h-[60px] rounded border-2 cursor-pointer transition-all duration-200",
              mainImage === index 
                ? "border-[#26a69a] shadow-sm" 
                : "border-transparent hover:border-gray-300"
            )}
            onClick={() => setMainImage(index)}
          >
            <Image
              src={img}
              alt={`${title} - Thumbnail ${index + 1}`}
              fill
              className="object-cover rounded"
              sizes="60px"
            />
          </div>
        ))}
      </div>

      {/* Setas de navegação para desktop */}
      <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-7">
        <button 
          onClick={() => setMainImage((prev) => (prev - 1 + images.length) % images.length)}
          className="p-1 rounded-full bg-white shadow-md hover:bg-gray-100"
          aria-label="Previous image"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
      <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-7 mt-10">
        <button 
          onClick={() => setMainImage((prev) => (prev + 1) % images.length)}
          className="p-1 rounded-full bg-white shadow-md hover:bg-gray-100"
          aria-label="Next image"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Modal de imagem ampliada */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl mx-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative h-[70vh] w-full">
              <Image
                src={images[modalImage]}
                alt={`${title} - Large view`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <button 
                onClick={() => navigateModal('prev')}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <button 
                onClick={() => navigateModal('next')}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center justify-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
                {images.map((_, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      modalImage === index ? "bg-white" : "bg-white/40"
                    )}
                    onClick={() => setModalImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 