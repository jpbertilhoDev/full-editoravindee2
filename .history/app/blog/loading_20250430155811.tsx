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
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <div className="h-10 w-48 bg-gray-200 rounded-md animate-pulse mx-auto"></div>
      </div>
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <div className="h-6 bg-gray-200 rounded-md animate-pulse w-3/4 mx-auto mb-2"></div>
        <div className="h-6 bg-gray-200 rounded-md animate-pulse w-2/3 mx-auto"></div>
      </div>

      {/* Featured post skeleton */}
      <div className="mb-12">
        <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 gap-6">
          <div className="group grid md:grid-cols-2 gap-6 rounded-lg border p-4">
            <div className="aspect-video w-full bg-gray-200 rounded-md animate-pulse"></div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="h-8 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-md animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters skeleton */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse w-full"></div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse w-full"></div>
        </div>
      </div>

      {/* Post grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-8 space-x-2">
        <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
} 