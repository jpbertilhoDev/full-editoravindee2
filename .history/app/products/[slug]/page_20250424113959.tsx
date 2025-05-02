"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Star, ChevronRight, Truck, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import ImageGallery from '@/components/products/ImageGallery';
import { useCart } from '@/contexts/CartContext';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Esta função é necessária para gerar rotas estáticas para cada produto
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);
  const { addToCart } = useCart();
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  
  if (!product) {
    notFound();
  }
  
  // Get related products
  const relatedProducts = product.relatedProducts
    ? products.filter((p) => product.relatedProducts?.includes(p.id))
    : products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Simular múltiplas imagens para o produto
  // Em um caso real, isso viria da sua base de dados
  const productImages = [
    product.coverImage,
    "/images/book-preview-1.jpg",
    "/images/book-preview-2.jpg",
    "/images/book-preview-3.jpg",
  ];

  const handleAddToCart = (buyNow = false) => {
    addToCart(product, 1);
    setShowAddedMessage(true);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setShowAddedMessage(false);
      
      // If "Buy Now", redirect to cart after showing message
      if (buyNow) {
        window.location.href = '/cart';
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen py-6 md:py-10 bg-gray-50 flex items-start justify-center">
      <div className="container max-w-5xl px-3 md:px-4">
        {/* Breadcrumbs */}
        <nav className="text-xs mb-4 md:mb-6 flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="text-gray-500 hover:text-[#26a69a] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
          
          <Link href="/products" className="text-gray-500 hover:text-[#26a69a] transition-colors">
            Books
          </Link>
          <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
          
          <Link href={`/products/category/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-[#26a69a] transition-colors truncate max-w-[150px]">
            {product.category}
          </Link>
        </nav>
        
        {/* Floating Product Card */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg overflow-hidden mb-5 md:mb-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-5 p-3 md:p-4 lg:p-6 relative">
              <ImageGallery 
                images={productImages}
                title={product.title}
              />
              
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-6 right-6 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm z-10">
                  Save {discountPercentage}%
                </div>
              )}
            </div>
            
            {/* Right Column - Product Info */}
            <div className="lg:col-span-7 p-4 md:p-6 flex flex-col lg:border-l border-gray-100">
              <div className="mb-1">
                <div className="flex justify-between items-start">
                  <Link href={`/products/category/${product.category.toLowerCase()}`} className="text-[#26a69a] text-xs font-medium hover:underline">
                    {product.category} / {product.format}
                  </Link>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Heart className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-lg md:text-xl font-bold text-gray-900 mt-1 mb-1">{product.title}</h1>
              
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-500">by</span>
                <Link href={`/author/${product.author.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#26a69a] hover:underline text-sm font-medium">
                  {product.author}
                </Link>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1.5">
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.shortDescription}</p>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {hasDiscount && (
                  <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice || 0)}</span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center border border-gray-100 rounded-md p-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    product.inStock ? "bg-green-500" : "bg-red-500"
                  )}></div>
                  <span className="text-xs text-gray-700">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex items-center border border-gray-100 rounded-md p-2">
                  <span className="text-xs text-gray-700">{product.publisher}</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="flex gap-2 mb-2">
                  <Button 
                    className="flex-1 bg-[#26a69a] hover:bg-[#2bbbad] text-white"
                    onClick={() => handleAddToCart(false)}
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-2" /> 
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#26a69a] text-[#26a69a] hover:bg-[#26a69a]/5 font-medium"
                    onClick={() => handleAddToCart(true)}
                  >
                    Buy Now
                  </Button>
                </div>
                {showAddedMessage && (
                  <div className="bg-green-50 border border-green-100 rounded-md p-2 my-2 flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-2" />
                    <span className="text-xs text-green-700">Added to your cart!</span>
                  </div>
                )}
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500 flex items-center justify-center">
                    <Truck className="h-3 w-3 mr-1 text-gray-400" />
                    Free shipping on orders over $35
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-4">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26a69a] px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#26a69a] text-sm"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26a69a] px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#26a69a] text-sm"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26a69a] px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#26a69a] text-sm"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Book Details</h3>
                    <dl className="grid grid-cols-3 gap-1 text-sm">
                      {[
                        { dt: "Format", dd: product.format },
                        { dt: "Pages", dd: product.pages },
                        { dt: "ISBN", dd: product.isbn },
                        { dt: "Language", dd: product.language },
                        { dt: "Publisher", dd: product.publisher },
                        { dt: "Publication", dd: new Date(product.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short'
                        }) },
                      ].map((item, i) => (
                        <React.Fragment key={i}>
                          <dt className="col-span-1 text-gray-500 py-1.5">{item.dt}:</dt>
                          <dd className="col-span-2 font-medium text-gray-900 py-1.5">{item.dd}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Features</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-[#26a69a] mr-2 shrink-0 mt-0.5" />
                        <span>{product.inStock ? 'Available for immediate delivery' : 'Pre-order available'}</span>
                      </li>
                      {product.format === 'eBook' && (
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-[#26a69a] mr-2 shrink-0 mt-0.5" />
                          <span>Instant digital download</span>
                        </li>
                      )}
                      {product.format === 'Audiobook' && (
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-[#26a69a] mr-2 shrink-0 mt-0.5" />
                          <span>Narrated by professional voice actors</span>
                        </li>
                      )}
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-[#26a69a] mr-2 shrink-0 mt-0.5" />
                        <span>Eligible for free shipping on orders over $35</span>
                      </li>
                      {product.dimensions && (
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-[#26a69a] mr-2 shrink-0 mt-0.5" />
                          <span>Dimensions: {product.dimensions}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{product.rating.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">{product.reviewCount} ratings</div>
                      
                      <Button className="bg-[#26a69a] hover:bg-[#2bbbad] text-white w-full">
                        Write a Review
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-4">
                      Be the first to share your experience with this book.
                    </p>
                    
                    {/* Sample review - would be populated from real data */}
                    <div className="border-b border-gray-100 pb-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                                )}
                              />
                            ))}
                          </div>
                          <h4 className="font-medium text-sm">Amazing read, highly recommended!</h4>
                        </div>
                        <div className="text-xs text-gray-500">June 12, 2023</div>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">By Sarah J.</div>
                      <p className="text-sm text-gray-700">This book changed my perspective in many ways. The author presents complex ideas in an accessible format. Would definitely recommend to anyone interested in this topic.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">You May Also Like</h2>
              <Link
                href="/products"
                className="text-[#26a69a] hover:text-[#2bbbad] font-medium text-xs"
              >
                View all
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white overflow-hidden rounded-md shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={relatedProduct.coverImage}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-medium text-xs line-clamp-1 group-hover:text-[#26a69a] transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-xs text-gray-500 my-0.5">{relatedProduct.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{formatPrice(relatedProduct.price)}</span>
                      <div className="flex text-yellow-400">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs text-gray-600 ml-0.5">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}