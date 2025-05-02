"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, ShoppingCart, Trash2, ChevronRight, 
  ArrowRight, BookOpen, ShoppingBag, X
} from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Product } from '@/lib/types';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    // Small delay to show animation
    setTimeout(() => {
      removeFromWishlist(productId);
      setRemovingId(null);
    }, 300);
  };

  const handleAddToCart = (productId: string) => {
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      // Optional: You can show a toast notification here
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Minha Lista de Desejos</h1>
        <p className="text-muted-foreground mt-1">
          Itens que você salvou para comprar mais tarde
        </p>
      </div>
      
      {/* Card principal */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Desejos</CardTitle>
            <CardDescription>
              Você tem {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'itens'} na sua lista de desejos
            </CardDescription>
          </div>
          
          {wishlistItems.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Lista
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar lista de desejos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso removerá permanentemente todos os itens da sua lista de desejos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={clearWishlist}
                    className="bg-rose-500 hover:bg-rose-600"
                  >
                    Sim, limpar lista
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>
        
        <CardContent>
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((product) => (
                <div 
                  key={product.id}
                  className={cn(
                    "bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 group hover:-translate-y-1",
                    removingId === product.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  )}
                >
                  <div className="flex h-full">
                    {/* Book cover */}
                    <div className="relative w-1/3 min-w-[100px] bg-gradient-to-br from-[#08a4a7]/5 to-[#0bdbb6]/5">
                      <Link href={`/products/${product.slug}`}>
                        {product.coverImage ? (
                          <Image
                            src={product.coverImage}
                            alt={product.title}
                            width={120}
                            height={180}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                      </Link>
                      
                      {/* Remove button overlay */}
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label="Remover da lista de desejos"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    
                    {/* Book details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <Link href={`/products/${product.slug}`} className="hover:text-[#08a4a7] transition-colors">
                          <h3 className="font-semibold line-clamp-2">
                            {product.title}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.author}
                        </p>
                        
                        {product.inStock ? (
                          <Badge className="mt-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
                            Em estoque
                          </Badge>
                        ) : (
                          <Badge className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
                            Indisponível
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-baseline">
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through mr-2">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                            <span className="text-lg font-bold text-[#08a4a7]">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 rounded-full border-rose-200 hover:border-rose-300 hover:bg-rose-50"
                            onClick={() => handleRemove(product.id)}
                          >
                            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                          </Button>
                        </div>
                        
                        <Button 
                          className="w-full bg-[#08a4a7] hover:bg-[#0bdbb6]"
                          onClick={() => handleAddToCart(product.id)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Adicionar ao Carrinho
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sua lista de desejos está vazia</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Explore nossa loja e adicione os livros que você deseja adquirir no futuro. 
                Eles aparecerão aqui para fácil acesso.
              </p>
              <Link href="/products">
                <Button className="bg-[#08a4a7] hover:bg-[#0bdbb6]">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Explorar Loja
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recomendações, caso tenha itens na lista */}
      {wishlistItems.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Você também pode gostar</CardTitle>
              <Link href="/products">
                <Button variant="ghost" size="sm" className="text-[#08a4a7] hover:text-[#0bdbb6] hover:bg-[#08a4a7]/5">
                  Ver mais
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Baseado nos itens da sua lista de desejos
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Área reservada para recomendações - seriam carregadas dinamicamente */}
              <div className="text-center p-4 border border-dashed border-gray-200 rounded-md">
                <p className="text-muted-foreground">Recomendações seriam carregadas aqui</p>
              </div>
              <div className="text-center p-4 border border-dashed border-gray-200 rounded-md">
                <p className="text-muted-foreground">Recomendações seriam carregadas aqui</p>
              </div>
              <div className="text-center p-4 border border-dashed border-gray-200 rounded-md">
                <p className="text-muted-foreground">Recomendações seriam carregadas aqui</p>
              </div>
              <div className="text-center p-4 border border-dashed border-gray-200 rounded-md">
                <p className="text-muted-foreground">Recomendações seriam carregadas aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 