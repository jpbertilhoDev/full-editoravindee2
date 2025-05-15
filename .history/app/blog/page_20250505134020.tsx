"use client"

import React, { useState, useEffect, useCallback, useMemo, Suspense, useTransition } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Search, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Remove Firebase direct imports
import { debounce } from '@/lib/utils';

// Lazy load the heavy component with virtualization
const BlogPostCard = dynamic(() => import('@/components/blog/BlogPostCard'), {
  loading: () => <PostSkeleton />,
  ssr: false,
});

// Static configuration
export const dynamicConfig = 'force-dynamic';

// Pagination configuration
const POSTS_PER_PAGE = 6;

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  slug: string;
  status: 'published' | 'draft' | 'scheduled';
  featured: 'yes' | 'no';
}

// Memoized pagination component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange }: { 
  currentPage: number; 
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex justify-center mt-8 space-x-2">
      <Button 
        variant="outline" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-24"
      >
        Anterior
      </Button>
      <div className="flex items-center px-4">
        Página {currentPage} de {totalPages || 1}
      </div>
      <Button 
        variant="outline" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-24"
      >
        Próxima
      </Button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

// Memoized skeleton loader for posts
const PostSkeleton = React.memo(() => (
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
));

PostSkeleton.displayName = 'PostSkeleton';

// Main page component
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  // Caching mechanism
  const cache = useMemo(() => new Map<string, {posts: BlogPost[], timestamp: number}>(), []);
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Function to fetch blog posts using the API route
  const fetchBlogPosts = useCallback(async (pageNumber = 1, category = 'todas') => {
    if (pageNumber === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    
    const cacheKey = `page_${pageNumber}_cat_${category}`;
    const cachedData = cache.get(cacheKey);
    const now = Date.now();
    
    // Return cached data if available and fresh
    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      if (pageNumber === 1) {
        setPosts(cachedData.posts);
        setFilteredPosts(cachedData.posts);
        
        // Find featured post in cached data
        const featured = cachedData.posts.find(post => post.featured === 'yes');
        setFeaturedPost(featured || null);
        
        // Extract categories from cached data
        const uniqueCategories = [...new Set(cachedData.posts.map(post => post.category))];
        setCategories(uniqueCategories.sort());
        
        setTotalPages(Math.ceil(cachedData.posts.length / POSTS_PER_PAGE));
      } else {
        setPosts(prev => [...prev, ...cachedData.posts]);
        setFilteredPosts(prev => [...prev, ...cachedData.posts]);
      }
      
      setHasMore(cachedData.posts.length === POSTS_PER_PAGE);
      setIsLoading(false);
      setIsLoadingMore(false);
      return;
    }
    
    try {
      // Build URL with parameters
      let url = '/api/blog?';
      const params = new URLSearchParams();
      
      if (category !== 'todas') {
        params.append('category', category);
      }
      
      // Append pagination parameters
      params.append('page', pageNumber.toString());
      params.append('limit', POSTS_PER_PAGE.toString());
      
      url += params.toString();
      
      // Fetch data from API
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.posts || data.posts.length === 0) {
        if (pageNumber === 1) {
          setPosts([]);
          setFilteredPosts([]);
          setFeaturedPost(null);
          setHasMore(false);
          
          if (category !== 'todas') {
            toast({
              title: "Nenhum post encontrado",
              description: `Não há posts na categoria "${category}".`,
            });
          } else {
            toast({
              title: "Nenhum post encontrado",
              description: "Não há posts publicados disponíveis no momento.",
            });
          }
        }
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }
      
      // Process fetched posts
      const fetchedPosts = data.posts as BlogPost[];
      
      // Cache the results
      cache.set(cacheKey, {
        posts: fetchedPosts,
        timestamp: now
      });
      
      // Update state based on page number
      if (pageNumber === 1) {
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
        
        // Find featured post
        const featured = fetchedPosts.find(post => post.featured === 'yes');
        setFeaturedPost(featured || null);
        
        // Extract categories from posts for first page only
        if (pageNumber === 1) {
          // Fetch all categories in a separate request
          const catResponse = await fetch('/api/blog/categories');
          if (catResponse.ok) {
            const catData = await catResponse.json();
            setCategories(catData.categories || []);
          } else {
            // Fallback to extracting from posts if categories endpoint fails
            const uniqueCategories = [...new Set(fetchedPosts.map(post => post.category))];
            setCategories(uniqueCategories.sort());
          }
          
          // Estimate total pages from total count if provided
          if (data.pagination && data.pagination.totalCount) {
            setTotalPages(Math.ceil(data.pagination.totalCount / POSTS_PER_PAGE));
          } else {
            setTotalPages(Math.max(pageNumber, Math.ceil(fetchedPosts.length / POSTS_PER_PAGE)));
          }
        }
      } else {
        setPosts(prev => [...prev, ...fetchedPosts]);
        setFilteredPosts(prev => [...prev, ...fetchedPosts]);
      }
      
      setHasMore(data.pagination && data.pagination.hasMore);
      
    } catch (error) {
      console.error("Erro ao buscar posts do blog:", error);
      setError("Não foi possível carregar os posts do blog. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [cache]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || (page > totalPages && !hasMore)) return;
    
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page > 1) {
      fetchBlogPosts(page, selectedCategory);
    }
  }, [totalPages, hasMore, fetchBlogPosts, selectedCategory]);

  // Handle category change with transition
  const handleCategoryChange = useCallback((category: string) => {
    startTransition(() => {
      setSelectedCategory(category);
      setCurrentPage(1);
      setHasMore(true);
      fetchBlogPosts(1, category);
    });
  }, [fetchBlogPosts]);

  // Filter posts efficiently
  const filterPosts = useCallback(
    debounce(() => {
      startTransition(() => {
        if (!searchQuery.trim()) {
          setFilteredPosts(posts);
          return;
        }
        
        const searchLower = searchQuery.toLowerCase().trim();
        const filtered = posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) || 
          post.excerpt.toLowerCase().includes(searchLower)
        );
        
        setFilteredPosts(filtered);
      });
    }, 300),
    [posts, searchQuery]
  );

  // Memoized filtered posts to avoid unnecessary re-renders
  const memoizedFilteredPosts = useMemo(() => filteredPosts, [filteredPosts]);

  // Effect to fetch posts on component mount
  useEffect(() => {
    fetchBlogPosts(1, 'todas');
    
    // Prefetch post cards for optimization
    import('@/components/blog/BlogPostCard');
  }, []);
  
  // Effect to filter posts when search query changes
  useEffect(() => {
    filterPosts();
  }, [searchQuery, filterPosts]);
  
  // Handle image error
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = '/images/placeholder-image.jpg';
    event.currentTarget.onerror = null; // Prevent infinite loop
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-center mb-6">Nosso Blog</h1>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-3 text-lg">Carregando posts...</span>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-6">Nosso Blog</h1>
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg max-w-2xl mx-auto text-center">
          <p>{error}</p>
          <Button className="mt-4" onClick={() => fetchBlogPosts(1, selectedCategory)}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-6">Nosso Blog</h1>
      <p className="text-center text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
        Reflexões, devocional, insights e recursos para sua caminhada espiritual.
        Explore tópicos bíblicos, práticas de oração e histórias inspiradoras.
      </p>

      {/* Featured post */}
      {featuredPost && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Em destaque</h2>
          <div className="grid grid-cols-1 gap-6">
            <Link href={`/blog/${featuredPost.slug}`} prefetch={true} className="block">
              <div className="group grid md:grid-cols-2 gap-6 rounded-lg border p-4 transition-colors hover:border-primary">
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  {featuredPost.imageUrl ? (
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="eager"
                      fetchPriority="high"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <FileText className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">{featuredPost.title}</h3>
                  <p className="mt-2 line-clamp-3 text-muted-foreground">{featuredPost.excerpt}</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-primary">
                      Ler artigo completo
                    </span>
                  </div>
                </div>
                </div>
              </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
            type="search"
              placeholder="Buscar posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
      
      {/* Loading indicator during transitions */}
      {isPending && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white/80 p-4 rounded-full shadow">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Post list with lazy loading */}
      {memoizedFilteredPosts.length > 0 ? (
        <>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <Suspense fallback={
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </>
            }>
              {memoizedFilteredPosts.map((post) => (
                <div key={post.id} className="transition-opacity duration-500 opacity-100">
                  <BlogPostCard post={post} />
                </div>
              ))}
            </Suspense>
      </div>

          {/* Pagination */}
          {!searchQuery && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
          
          {/* Load more button (alternative to pagination) */}
          {hasMore && !searchQuery && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={isLoadingMore || isPending}
                className="w-40"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando
                  </>
                ) : (
                  'Carregar mais'
                )}
              </Button>
                  </div>
                )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhum post encontrado com os filtros atuais.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('todas');
            }}
          >
            Limpar filtros
          </Button>
          </div>
        )}
    </div>
  );
} 