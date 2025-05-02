"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { 
  Heart, ShoppingCart, Trash2, ChevronLeft, ChevronRight, 
  ArrowRight, BookOpen, ShoppingBag, Loader2
} from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Prefetch common navigation destinations
  useEffect(() => {
    router.prefetch('/products');
    router.prefetch('/');
    router.prefetch('/cart');
    // Set loaded state after a small delay to allow initial rendering
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleRemove = useCallback((productId: string) => {
    setRemovingId(productId);
    // Small delay to show animation
    setTimeout(() => {
      removeFromWishlist(productId);
      setRemovingId(null);
    }, 300);
  }, [removeFromWishlist]);

  const handleAddToCart = useCallback((productId: string) => {
    setAddingToCartId(productId);
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      setTimeout(() => {
        setAddingToCartId(null);
      }, 500);
    } else {
      setAddingToCartId(null);
    }
  }, [wishlistItems, addToCart]);

  const handleClearWishlist = useCallback(() => {
    setIsClearing(true);
    // Add a small delay to show loading state
    setTimeout(() => {
      clearWishlist();
      setIsClearing(false);
    }, 300);
  }, [clearWishlist]);

  // Fade-in animation for the page
  const pageClasses = cn(
    "bg-gray-50 min-h-screen pt-8 pb-16 transition-opacity duration-300",
    isLoaded ? "opacity-100" : "opacity-0"
  );

  return (
    <div className={pageClasses}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minha Lista de Desejos</h1>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#08a4a7]">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-[#08a4a7] font-medium">Lista de Desejos</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {wishlistItems.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearWishlist}
                disabled={isClearing}
                className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
              >
                {isClearing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Limpar Lista
              </Button>
            )}
            <Link href="/products">
              <Button 
                size="sm" 
                className="bg-[#08a4a7] hover:bg-[#0bdbb6]"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Wishlist items */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <div 
                key={product.id}
                className={cn(
                  "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group hover:shadow-lg border border-gray-100",
                  removingId === product.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                )}
              >
                <div className="flex h-full">
                  {/* Book cover */}
                  <div className="relative w-1/3 min-w-[120px] bg-gray-100">
                    <Link href={`/products/${product.slug}`}>
                      {product.coverImage ? (
                        <Image
                          src={product.coverImage}
                          alt={product.title}
                          width={180}
                          height={260}
                          className="object-cover h-full w-full"
                          priority={wishlistItems.indexOf(product) < 3} // Prioritize loading first 3 images
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                    </Link>
                  </div>
                  
                  {/* Book details */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-[#08a4a7] transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.author}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-[#08a4a7]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm line-through text-gray-400">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 rounded-full px-3 h-8"
                            onClick={() => handleRemove(product.id)}
                          >
                            <Heart className="h-4 w-4 mr-1 fill-rose-500" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="mt-4 w-full bg-[#08a4a7] hover:bg-[#0bdbb6] text-white"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCartId === product.id}
                    >
                      {addingToCartId === product.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adicionando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Adicionar ao Carrinho
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-10 text-center transition-all duration-300 scale-100 opacity-100">
            <div className="max-w-md mx-auto">
              <div className="h-28 w-28 rounded-full bg-gray-100 flex items-center justify-center mb-6 mx-auto">
                <Heart className="h-12 w-12 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sua lista de desejos está vazia</h2>
              <p className="text-gray-500 mb-8">
                Explore nossa loja e adicione os itens que você deseja adquirir. Eles aparecerão aqui para você encontrá-los facilmente no futuro.
              </p>
              <Link href="/products">
                <Button 
                  className="bg-[#08a4a7] hover:bg-[#0bdbb6] px-6 py-6 h-auto transition-transform hover:scale-105"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Explorar Produtos
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 