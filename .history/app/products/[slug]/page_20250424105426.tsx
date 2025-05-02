import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Share2, ShoppingCart, BookOpen, Clock, Star, ChevronRight, Truck, ShieldCheck, ArrowRight, ChevronsRight } from 'lucide-react';
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
    <div className="py-6 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="text-xs mb-4 flex items-center overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="text-gray-500 hover:text-[#08a4a7] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
          
          <Link href="/products" className="text-gray-500 hover:text-[#08a4a7] transition-colors">
            Books
          </Link>
          <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
          
          <Link href={`/products/category/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-[#08a4a7] transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
          
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>
        
        {/* Main content card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column - Image */}
            <div className="lg:col-span-5 lg:border-r border-gray-100">
              <div className="relative group">
                <div className="aspect-[4/5] relative">
                  <Image 
                    src={product.coverImage} 
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {hasDiscount && (
                      <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-sm">
                        {discountPercentage}% OFF
                      </span>
                    )}
                    {product.bestSeller && (
                      <span className="bg-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded-sm">
                        Bestseller
                      </span>
                    )}
                    {product.newRelease && (
                      <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-sm">
                        New
                      </span>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    <Button size="icon" variant="secondary" className="rounded-full h-7 w-7 bg-white/80 hover:bg-white">
                      <Heart className="h-3.5 w-3.5" />
                      <span className="sr-only">Add to wishlist</span>
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full h-7 w-7 bg-white/80 hover:bg-white">
                      <Share2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Product Info */}
            <div className="lg:col-span-7 p-5 lg:p-6 flex flex-col">
              <div className="mb-1">
                <span className="text-[#08a4a7] text-xs font-medium">{product.category} / {product.format}</span>
              </div>
              
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{product.title}</h1>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-700">by</span>
                <Link href={`/author/${product.author.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#08a4a7] hover:underline text-sm font-medium">
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
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1.5">
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500 flex items-center">
                  <BookOpen className="h-3.5 w-3.5 mr-1" /> {product.publisher}
                </span>
              </div>
              
              <div className="flex items-end gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice || 0)}</span>
                    <span className="text-red-500 text-xs font-medium ml-1">Save {discountPercentage}%</span>
                  </>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-md p-3 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">{product.shortDescription}</p>
              </div>
              
              {/* Book specs */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-center">
                <div className="flex items-center text-left p-2.5 border border-gray-100 rounded-md">
                  <ShieldCheck className="h-4 w-4 text-[#08a4a7] mr-2 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-medium">Availability</span>
                    <span className={cn(
                      "text-xs",
                      product.inStock ? "text-green-600" : "text-red-500"
                    )}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-left p-2.5 border border-gray-100 rounded-md">
                  <Clock className="h-4 w-4 text-[#08a4a7] mr-2 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-medium">Publication Date</span>
                    <span className="text-xs text-gray-700">
                      {new Date(product.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-auto">
                <Button 
                  className="flex-1 bg-[#08a4a7] hover:bg-[#0bdbb6] text-white h-10"
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-2" /> 
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#08a4a7] text-[#08a4a7] hover:bg-[#08a4a7]/10 h-10"
                >
                  Buy Now
                </Button>
              </div>
              
              {/* Free shipping note */}
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-500 flex items-center justify-center">
                  <Truck className="h-3 w-3 mr-1" />
                  Free shipping on orders over $35
                </span>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="border-t border-gray-100 px-5 lg:px-6 py-6">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-4">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#08a4a7] px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#08a4a7] text-sm"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#08a4a7] px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#08a4a7] text-sm"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#08a4a7] px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#08a4a7] text-sm"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <div className="prose max-w-none">
                  <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First column */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Book Details</h3>
                    <dl className="grid grid-cols-3 gap-1 text-sm">
                      {[
                        { dt: "Format", dd: product.format },
                        { dt: "Pages", dd: product.pages },
                        { dt: "ISBN", dd: product.isbn },
                        { dt: "Language", dd: product.language },
                        ...(product.dimensions ? [{ dt: "Dimensions", dd: product.dimensions }] : []),
                      ].map((item, i) => (
                        <React.Fragment key={i}>
                          <dt className="col-span-1 text-gray-500 py-1.5">{item.dt}:</dt>
                          <dd className="col-span-2 font-medium text-gray-900 py-1.5">{item.dd}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </div>
                  
                  {/* Second column */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">More Information</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      This book is published by {product.publisher} and was released on {new Date(product.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}.
                    </p>
                    {product.inStock ? (
                      <p className="text-sm text-green-600">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5"></span>
                        In stock and ready to ship
                      </p>
                    ) : (
                      <p className="text-sm text-red-500">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></span>
                        Currently out of stock
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-4">
                    Share your thoughts with other customers
                  </p>
                  <Button className="bg-[#08a4a7] hover:bg-[#0bdbb6] text-white">
                    Write a Review
                  </Button>
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
                className="text-[#08a4a7] hover:text-[#0bdbb6] font-medium flex items-center text-xs"
              >
                View all
                <ChevronsRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white overflow-hidden rounded-md shadow-sm hover:shadow transition-all duration-300"
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
                    <h3 className="font-medium text-xs line-clamp-1 group-hover:text-[#08a4a7] transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 mb-1">{relatedProduct.author}</p>
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