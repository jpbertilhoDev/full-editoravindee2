"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images: propImages, title }: ImageGalleryProps) {
  // Usar imagens de demonstração de alta qualidade (livros reais)
  const demoImages = [
    "https://images-na.ssl-images-amazon.com/images/I/51UoqRAxwEL._SX331_BO1,204,203,200_.jpg", // Capa frontal
    "https://images-na.ssl-images-amazon.com/images/I/71hUeUZxakL.jpg", // Contracapa
    "https://images-na.ssl-images-amazon.com/images/I/71F7o7VYbaL.jpg", // Página de exemplo
    "https://images-na.ssl-images-amazon.com/images/I/61Tl-KRvncL.jpg", // Páginas abertas
    "https://images-na.ssl-images-amazon.com/images/I/810DuHJGiDL.jpg", // Detalhes
  ];

  const images = propImages.length > 1 ? propImages : demoImages;
  
  const [mainImage, setMainImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Abrir o modal com a imagem clicada
  const openModal = (index: number) => {
    setModalImage(index);
    setShowModal(true);
  };

  // Função para navegar pelas imagens no modal
  const navigateModal = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setModalImage((prev) => (prev + 1) % images.length);
    } else {
      setModalImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Trocar imagem com um pequeno delay ao passar o mouse (estilo Amazon)
  const handleMouseEnter = (index: number) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    const timeout = setTimeout(() => {
      setMainImage(index);
    }, 100); // Delay pequeno para evitar mudanças muito rápidas
    
    setHoverTimeout(timeout);
  };

  // Limpar o timeout ao sair com o mouse
  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-2">
      {/* Miniaturas - estilo Amazon (à esquerda em desktop) */}
      <div className="order-2 md:order-1 md:w-12 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto pb-1 md:pb-0 md:pr-0 pr-1">
        {images.map((img, index) => (
          <div
            key={index}
            className={cn(
              "relative min-w-[40px] w-[40px] h-[40px] rounded-sm cursor-pointer transition-all duration-150",
              mainImage === index 
                ? "ring-1 ring-[#e77600]" 
                : "hover:ring-1 hover:ring-[#e77600] border border-gray-200"
            )}
            onClick={() => setMainImage(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={img}
              alt={`${title} - Thumbnail ${index + 1}`}
              fill
              className="object-cover rounded-sm"
              sizes="40px"
            />
          </div>
        ))}
      </div>

      {/* Imagem principal */}
      <div className="order-1 md:order-2 flex-1">
        <div 
          className="relative aspect-[0.75/1] bg-white rounded overflow-hidden group cursor-pointer" 
          onClick={() => openModal(mainImage)}
        >
          <Image 
            src={images[mainImage]} 
            alt={`${title} - Image ${mainImage + 1}`}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 450px"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 p-2 rounded-full shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-150">
              <ZoomIn className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Indicação abaixo da imagem principal */}
        <p className="text-[10px] text-center text-gray-500 mt-1">Passe o mouse sobre as imagens para ampliar</p>
      </div>

      {/* Modal de visualização ampliada */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl mx-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative h-[80vh] w-full">
              <Image
                src={images[modalImage]}
                alt={`${title} - Large view`}
                fill
                className="object-contain"
                sizes="100vw"
                quality={90}
              />
            </div>

            {/* Navegação no modal */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <button 
                onClick={() => navigateModal('prev')}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <button 
                onClick={() => navigateModal('next')}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </div>

            {/* Indicadores de imagem atual */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className="flex items-center justify-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all focus:outline-none",
                      modalImage === index ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                    )}
                    onClick={() => setModalImage(index)}
                    aria-label={`View image ${index + 1}`}
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