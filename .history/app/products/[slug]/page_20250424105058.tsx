import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { Heart, Share2, ShoppingCart, BookOpen, Clock, Award, Star, ChevronRight, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

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

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6 flex items-center overflow-x-auto whitespace-nowrap py-2">
          <Link href="/" className="text-gray-500 hover:text-[#08a4a7] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          
          <Link href="/products" className="text-gray-500 hover:text-[#08a4a7] transition-colors">
            Books
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          
          <Link href={`/products/category/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-[#08a4a7] transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Image and Badges */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative group rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <div className="aspect-[4/5] relative">
                  <Image 
                    src={product.coverImage} 
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {hasDiscount && (
                      <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </span>
                    )}
                    {product.bestSeller && (
                      <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
                        Bestseller
                      </span>
                    )}
                    {product.newRelease && (
                      <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                        New Release
                      </span>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Add to wishlist</span>
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80 hover:bg-white">
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="flex flex-col items-center text-center bg-gray-50 p-3 rounded-lg">
                  <Truck className="h-5 w-5 text-[#08a4a7] mb-1" />
                  <span className="text-xs text-gray-600">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center bg-gray-50 p-3 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-[#08a4a7] mb-1" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center bg-gray-50 p-3 rounded-lg">
                  <Clock className="h-5 w-5 text-[#08a4a7] mb-1" />
                  <span className="text-xs text-gray-600">Fast Delivery</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Product Info */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="mb-1">
                <span className="text-[#08a4a7] text-sm font-medium">{product.category}</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-700">by</span>
                <Link href={`/author/${product.author.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#08a4a7] hover:underline font-medium">
                  {product.author}
                </Link>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" /> {product.format}
                </span>
              </div>
              
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-gray-500 line-through text-lg">{formatPrice(product.originalPrice || 0)}</span>
                    <span className="text-red-500 text-sm font-medium">Save {discountPercentage}%</span>
                  </>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">{product.shortDescription}</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="flex flex-col text-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500">Pages</span>
                  <span className="font-medium">{product.pages}</span>
                </div>
                <div className="flex flex-col text-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500">Publisher</span>
                  <span className="font-medium truncate">{product.publisher}</span>
                </div>
                <div className="flex flex-col text-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500">Language</span>
                  <span className="font-medium">{product.language}</span>
                </div>
                <div className="flex flex-col text-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500">ISBN</span>
                  <span className="font-medium">{product.isbn}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Availability:</span>
                <span className={cn(
                  "flex items-center",
                  product.inStock ? "text-green-600" : "text-red-500"
                )}>
                  <span className={cn(
                    "inline-block h-2 w-2 rounded-full mr-2",
                    product.inStock ? "bg-green-600" : "bg-red-500"
                  )}></span>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="mt-auto space-y-3">
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-[#08a4a7] hover:bg-[#0bdbb6] text-white"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> 
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 border-[#08a4a7] text-[#08a4a7] hover:bg-[#08a4a7]/10"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#08a4a7] px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#08a4a7]"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#08a4a7] px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#08a4a7]"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#08a4a7] px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#08a4a7]"
                >
                  Reviews ({product.reviewCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Book Details</h3>
                    <ul className="space-y-2 rounded-lg overflow-hidden">
                      {[
                        { label: "Title", value: product.title },
                        { label: "Author", value: product.author },
                        { label: "ISBN", value: product.isbn },
                        { label: "Format", value: product.format },
                        { label: "Pages", value: product.pages },
                      ].map((item, index) => (
                        <li 
                          key={index} 
                          className={cn(
                            "flex justify-between py-2 px-3",
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          )}
                        >
                          <span className="text-gray-500">{item.label}:</span>
                          <span className="font-medium text-right">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Publication</h3>
                    <ul className="space-y-2 rounded-lg overflow-hidden">
                      {[
                        { label: "Publisher", value: product.publisher },
                        { 
                          label: "Publication Date", 
                          value: new Date(product.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) 
                        },
                        { label: "Language", value: product.language },
                        ...(product.dimensions ? [{ label: "Dimensions", value: product.dimensions }] : []),
                      ].map((item, index) => (
                        <li 
                          key={index} 
                          className={cn(
                            "flex justify-between py-2 px-3",
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          )}
                        >
                          <span className="text-gray-500">{item.label}:</span>
                          <span className="font-medium text-right">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                    <Button className="bg-[#08a4a7] hover:bg-[#0bdbb6]">
                      Write a Review
                    </Button>
                  </div>
                  
                  <div className="py-8 text-center border-y border-gray-200">
                    <p className="text-gray-500 mb-4">
                      Share your thoughts with other customers
                    </p>
                    <Button variant="outline" className="border-[#08a4a7] text-[#08a4a7] hover:bg-[#08a4a7]/10">
                      Write a customer review
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
              <Link
                href="/products"
                className="text-[#08a4a7] hover:text-[#0bdbb6] font-medium flex items-center text-sm"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={relatedProduct.coverImage}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1 group-hover:text-[#08a4a7] transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1.5">{relatedProduct.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{formatPrice(relatedProduct.price)}</span>
                      <div className="flex text-yellow-400">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{relatedProduct.rating}</span>
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