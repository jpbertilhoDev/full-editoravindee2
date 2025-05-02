import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeaturedProducts from '@/components/home/FeaturedProducts';

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
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6">
          <ol className="flex flex-wrap items-center space-x-2">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <Link href="/products" className="text-muted-foreground hover:text-primary">
                Books
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <Link 
                href={`/products/category/${product.category.toLowerCase()}`} 
                className="text-muted-foreground hover:text-primary"
              >
                {product.category}
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="font-medium text-foreground line-clamp-1">{product.title}</li>
          </ol>
        </nav>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-24 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img 
                src={product.coverImage} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.newRelease && (
                <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                  New Release
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                  Bestseller
                </span>
              )}
              {hasDiscount && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                  Save {discountPercentage}%
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-playfair font-bold mb-2">{product.title}</h1>
            
            <p className="text-lg text-muted-foreground mb-4">by {product.author}</p>
            
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < product.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.reviewCount} reviews)
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-muted-foreground line-through text-lg">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-foreground mb-8">{product.shortDescription}</p>
            
            <div className="border-t border-b py-6 space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">{product.format}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Publisher:</span>
                <span>{product.publisher}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Publication Date:</span>
                <span>{new Date(product.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISBN:</span>
                <span>{product.isbn}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pages:</span>
                <span>{product.pages}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability:</span>
                <span className={product.inStock ? 'text-green-600' : 'text-red-500'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <Button className="flex-1 py-6">Add to Cart</Button>
                <Button variant="outline" className="py-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </Button>
              </div>
              
              <Button variant="secondary" className="w-full py-6">Buy Now</Button>
            </div>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-8 pb-3 data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-8 pb-3 data-[state=active]:bg-transparent"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-8 pb-3 data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Book Details</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Title:</span>
                      <span>{product.title}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Author:</span>
                      <span>{product.author}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">ISBN:</span>
                      <span>{product.isbn}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Format:</span>
                      <span>{product.format}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Pages:</span>
                      <span>{product.pages}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Publication</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Publisher:</span>
                      <span>{product.publisher}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Publication Date:</span>
                      <span>{new Date(product.publishDate).toLocaleDateString()}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Language:</span>
                      <span>{product.language}</span>
                    </li>
                    {product.dimensions && (
                      <li className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span>{product.dimensions}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button>Write a Review</Button>
                </div>
                
                <div className="py-8 text-center border-y">
                  <p className="text-muted-foreground mb-4">
                    Share your thoughts with other customers
                  </p>
                  <Button variant="outline">Write a customer review</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <FeaturedProducts 
              products={relatedProducts} 
              title="You May Also Like" 
            />
          </div>
        )}
      </div>
    </div>
  );
}