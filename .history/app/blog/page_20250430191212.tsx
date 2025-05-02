"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, FileText, Loader2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, DocumentData } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

// Lazy load the blog post card component
const BlogPostCard = dynamic(() => import('@/components/blog/BlogPostCard'), {
  loading: () => <PostSkeleton />,
  ssr: false,
});

// Static configuration
export const dynamicConfig = 'force-dynamic';
export const revalidate = 86400; // Revalidate once per day

// Pagination configuration
const POSTS_PER_PAGE = 6;

// Simple skeleton loader for posts
const PostSkeleton = React.memo(() => (
  <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm h-full">
    <div className="aspect-video w-full bg-gray-200 animate-pulse"></div>
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
    </div>
  </div>
));

PostSkeleton.displayName = 'PostSkeleton';

// Featured post component
const FeaturedPost = React.memo(({ post }: { post: DocumentData }) => {
  if (!post) return null;
  
  return (
    <section className="mb-12 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl overflow-hidden">
      <div className="container py-8">
        <Badge variant="secondary" className="mb-4">Em destaque</Badge>
        <Link href={`/blog/${post.slug}`} prefetch={false} className="block">
          <div className="group grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md transform transition-transform duration-300 group-hover:scale-[1.02]">
              {post.imageUrl ? (
                <Image 
                  src={post.imageUrl} 
                  alt={post.title}
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-image.jpg';
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </Badge>
                {post.category && (
                  <Badge className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </Badge>
                )}
              </div>
              <h2 className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="mb-4 text-muted-foreground line-clamp-3">{post.excerpt}</p>
              <Button className="w-fit" variant="outline">
                Ler artigo completo
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
});

FeaturedPost.displayName = 'FeaturedPost';

// Main page component
export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL params with fallbacks
  const currentCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSearchTerm = searchParams.get('search') || '';
  
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [featuredPost, setFeaturedPost] = useState<DocumentData | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // Fetch posts based on current params
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch from API with all params
      const apiUrl = new URL('/api/blog', window.location.origin);
      apiUrl.searchParams.append('page', currentPage.toString());
      apiUrl.searchParams.append('limit', POSTS_PER_PAGE.toString());
      
      if (currentCategory) {
        apiUrl.searchParams.append('category', currentCategory);
      }
      
      if (currentSearchTerm) {
        apiUrl.searchParams.append('search', currentSearchTerm);
      }
      
      const response = await fetch(apiUrl.toString(), {
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!response.ok) {
        throw new Error('Falha ao carregar posts');
      }
      
      const data = await response.json();
      
      // Update state with fetched data
      setPosts(data.posts || []);
      setTotalPages(data.pagination?.totalPages || 1);
      
      // Find featured post if we're on page 1 with no filters
      if (currentPage === 1 && !currentCategory && !currentSearchTerm && data.posts?.length > 0) {
        const featured = data.posts.find((post: any) => post.featured === 'true' || post.featured === true);
        setFeaturedPost(featured || data.posts[0]);
      } else {
        setFeaturedPost(null);
      }
      
    } catch (err) {
      console.error('Erro ao buscar posts do blog:', err);
      setError('Não foi possível carregar os posts. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentPage, currentSearchTerm]);

  // Fetch categories once
  const fetchCategories = useCallback(async () => {
    try {
      // Try to get from session storage first
      const cachedCategories = sessionStorage.getItem('blog_categories');
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
        return;
      }
      
      // Otherwise fetch from Firestore
      const categoriesSet = new Set<string>();
      
      const postsQuery = query(collection(db, 'blogPosts'), where('status', '==', 'published'));
      const snapshot = await getDocs(postsQuery);
      
      snapshot.docs.forEach(doc => {
        const category = doc.data().category;
        if (category) categoriesSet.add(category);
      });
      
      const categoriesArray = Array.from(categoriesSet);
      setCategories(categoriesArray);
      
      // Cache in session storage
      sessionStorage.setItem('blog_categories', JSON.stringify(categoriesArray));
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [fetchCategories, fetchPosts]);

  // Handle category change
  const handleCategoryChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    params.set('page', '1'); // Reset to page 1
    router.push(`/blog?${params.toString()}`);
  }, [router, searchParams]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/blog?${params.toString()}`);
  }, [router, searchParams]);

  // Handle search with debounce
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
          params.set('search', term);
        } else {
          params.delete('search');
        }
        params.set('page', '1'); // Reset to page 1
        router.push(`/blog?${params.toString()}`);
      }, 500),
    [router, searchParams]
  );

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 relative">
            <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">Blog</span>
          </h1>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="ml-3 text-lg">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 relative">
          <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">Blog</span>
        </h1>
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg max-w-2xl mx-auto text-center">
          <p>{error}</p>
          <Button className="mt-4" onClick={fetchPosts}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-16">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">Blog</span>
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-full shadow-lg p-1.5 flex items-center">
              <Input
                type="text"
                placeholder="Buscar posts..."
                defaultValue={currentSearchTerm}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="flex-1 border-none focus-visible:ring-0 rounded-full"
              />
              <Button size="sm" className="rounded-full">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
            
            <div className="flex justify-center mt-4">
              <Select value={currentCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[200px] bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        {/* Featured post section */}
        {!error && featuredPost && !currentCategory && !currentSearchTerm && (
          <FeaturedPost post={featuredPost} />
        )}
        
        {/* Section title */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-0.5 flex-1 bg-gray-200 rounded-full"></div>
          <h2 className="text-2xl font-bold">
            {currentCategory ? `Posts na categoria ${currentCategory}` : 
             currentSearchTerm ? `Resultados para "${currentSearchTerm}"` : 
             'Posts Recentes'}
          </h2>
          <div className="h-0.5 flex-1 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="transform transition-all duration-300 hover:-translate-y-2">
                <BlogPostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum post encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {currentCategory || currentSearchTerm ? 
                'Tente mudar os filtros de busca ou categoria' : 
                'Ainda não há posts publicados'}
            </p>
            {(currentCategory || currentSearchTerm) && (
              <Button 
                variant="outline" 
                onClick={() => router.push('/blog')}
              >
                Ver todos os posts
              </Button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button 
                variant={currentPage <= 1 ? "outline" : "secondary"}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4"
              >
                ← Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="mx-1">...</span>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button 
                variant={currentPage >= totalPages ? "outline" : "secondary"}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4"
              >
                Próxima →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 