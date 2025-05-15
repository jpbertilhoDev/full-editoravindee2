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
    // Set loading state depending on if it's the initial load or pagination
    if (pageNumber === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    // Create cache key
    const cacheKey = `blog-posts-${pageNumber}-${category}`;
    
    // Check if we have cached data
    const cachedData = cache.get(cacheKey);
    console.log(`Cache status for ${cacheKey}:`, cachedData ? 'HIT' : 'MISS');
    
    if (cachedData) {
      const { timestamp, data } = cachedData;
      const ageInSeconds = (Date.now() - timestamp) / 1000;
      console.log(`Cached data age: ${Math.round(ageInSeconds)} seconds`);
      
      // If data is fresh (less than 5 minutes old), use it
      if (ageInSeconds < 300) {
        console.log('Using cached data', data);
        handleApiResponse(data, pageNumber, category);
        return;
      }
      console.log('Cached data expired, fetching fresh data');
    }

    try {
      // Construct URL
      const params = new URLSearchParams();
      params.append('page', pageNumber.toString());
      if (category !== 'todas') {
        params.append('category', category);
      }
      
      const url = `/api/blog?${params.toString()}`;
      console.log('Fetching blog posts from:', url);
      
      // Make the API request
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('API response status:', response.status);
      console.log('Response headers:', JSON.stringify(Object.fromEntries([...response.headers.entries()])));
      
      if (!response.ok) {
        throw new Error(`Blog API request failed with status ${response.status}`);
      }

      try {
        const jsonData = await response.json();
        console.log('API response data structure:', Object.keys(jsonData));
        console.log('Posts count:', jsonData.posts?.length || 0);
        
        // Cache the data
        cache.set(cacheKey, {
          timestamp: Date.now(),
          data: jsonData,
        });
        
        // Process the data
        handleApiResponse(jsonData, pageNumber, category);
      } catch (jsonError) {
        console.error('Error parsing JSON from blog API:', jsonError);
        const textData = await response.text();
        console.log('Raw response text (first 500 chars):', textData.substring(0, 500));
        
        throw new Error('Failed to parse blog API response as JSON');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      
      // Try using test API as fallback
      console.log('Attempting to use test API as fallback');
      try {
        const testResponse = await fetch('/api/test-blog');
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Test API fallback successful');
          
          toast({
            title: "Usando dados de fallback",
            description: "A API principal falhou. Exibindo posts de teste.",
            variant: "warning",
          });
          
          handleApiResponse(testData, pageNumber, category);
          return;
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
      
      setError(`Erro ao carregar posts: ${error.message}`);
    } finally {
      if (pageNumber === 1) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [cache]);

  // Helper function to process API response
  const handleApiResponse = useCallback((data, pageNumber, category) => {
    if (!data || !data.posts) {
      console.error('Invalid API response structure:', data);
      setError('Estrutura de dados inválida na resposta da API');
      return;
    }
    
    console.log(`Received ${data.posts.length} posts from API`);
    
    if (data.posts.length === 0) {
      if (category !== 'todas') {
        toast({
          title: "Sem posts",
          description: `Não há posts na categoria '${category}'.`,
        });
      }
      
      if (pageNumber === 1) {
        setPosts([]);
        setFilteredPosts([]);
        setFeaturedPost(null);
      }
    } else {
      // Update posts
      if (pageNumber === 1) {
        setPosts(data.posts);
        setFilteredPosts(data.posts);
        
        // Find featured post
        const featured = data.posts.find(post => post.featured === 'yes');
        setFeaturedPost(featured || null);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
        setFilteredPosts(prev => [...prev, ...data.posts]);
      }
      
      // Update pagination
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setHasMore(data.pagination.hasMore);
    }
  }, []);

  // Function to fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/blog/categories', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('Categories API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Categories request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories loaded:', data.categories?.length || 0);
      
      if (data.categories && data.categories.length > 0) {
        setCategories(['todas', ...data.categories]);
      } else {
        console.warn('No categories returned, using fallback');
        setCategories(['todas', 'Vida Cristã', 'Estudo Bíblico', 'Teologia']);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories
      setCategories(['todas', 'Vida Cristã', 'Estudo Bíblico', 'Teologia']);
    }
  }, []);

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

  // Initial load effect
  useEffect(() => {
    console.log('Blog component mounted or reloaded');
    
    const initBlog = async () => {
      try {
        // First load categories
        await fetchCategories();
        
        // Then load posts
        await fetchBlogPosts(1, 'todas');
      } catch (error) {
        console.error('Error during blog initialization:', error);
        
        // Fallback to test API if main initialization fails
        try {
          console.log('Attempting to use test API as initialization fallback');
          const testResponse = await fetch('/api/test-blog');
          if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('Test API fallback successful for initialization');
            
            toast({
              title: "Modo de emergência",
              description: "Blog carregado em modo de teste devido a erros na API principal.",
              variant: "warning",
            });
            
            // Process the test data
            handleApiResponse(testData, 1, 'todas');
            
            // Set fallback categories
            setCategories(['todas', 'Teste', 'Vida Cristã', 'Estudo Bíblico']);
          }
        } catch (fallbackError) {
          console.error('All initialization attempts failed:', fallbackError);
          setError('Não foi possível inicializar o blog. Por favor, recarregue a página.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    initBlog();
    
    // Create an interval to refetch posts to keep them fresh
    const refreshInterval = setInterval(() => {
      console.log('Refreshing blog posts in background');
      // Silent refresh without loading indicators
      const refreshPosts = async () => {
        try {
          const response = await fetch('/api/blog?page=1');
          if (response.ok) {
            const data = await response.json();
            // Only update if we got posts
            if (data.posts && data.posts.length > 0) {
              console.log('Background refresh successful, updating posts');
              setPosts(data.posts);
              setFilteredPosts(data.posts);
              
              // Find featured post
              const featured = data.posts.find(post => post.featured === 'yes');
              setFeaturedPost(featured || null);
            }
          }
        } catch (error) {
          console.error('Background refresh failed:', error);
          // No user-visible error for background refreshes
        }
      };
      
      refreshPosts();
    }, 15 * 60 * 1000); // Refresh every 15 minutes
    
    return () => {
      // Clear the interval when component unmounts
      clearInterval(refreshInterval);
    };
  }, []); // Empty dependency array means this runs once on mount
  
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
        <div className="flex flex-col justify-center items-center py-10">
          <div className="flex justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="ml-3 text-lg">Carregando posts...</span>
          </div>
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

      {/* Error state - inline version */}
      {memoizedFilteredPosts.length === 0 && !isLoading && !error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-2xl mx-auto text-center mb-10">
          <p className="text-red-600 mb-4">Não foi possível carregar os posts do blog. Tente novamente mais tarde.</p>
          <Button 
            onClick={() => fetchBlogPosts(1, selectedCategory)}
            className="bg-brand-petrol hover:bg-brand-petrol/90 text-white"
          >
            Tentar novamente
          </Button>
        </div>
      )}

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