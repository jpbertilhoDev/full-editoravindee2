import React from 'react';
import { Loader2 } from 'lucide-react';

// Simple skeleton UI for a blog post card
const PostSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm h-full">
    <div className="aspect-video w-full bg-gray-200 animate-pulse"></div>
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
    </div>
  </div>
);

export default function BlogLoading() {
  return (
    <div className="min-h-screen pb-16">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg mx-auto mb-8"></div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 rounded-full h-12 shadow-lg p-1.5 flex items-center">
              <div className="flex-1 bg-gray-200 animate-pulse h-8 rounded-full"></div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        {/* Featured post skeleton */}
        <div className="mb-12 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl overflow-hidden">
          <div className="container py-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-[16/9] bg-gray-200 animate-pulse rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-10 w-1/3 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section title skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-0.5 flex-1 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-0.5 flex-1 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Posts grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm h-full">
              <div className="aspect-video w-full bg-gray-200 animate-pulse"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Loading indicator */}
        <div className="flex justify-center items-center mt-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Carregando conteúdo...</span>
        </div>
      </div>
    </div>
  );
} 