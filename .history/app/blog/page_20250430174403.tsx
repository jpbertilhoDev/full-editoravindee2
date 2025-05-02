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
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy, DocumentData } from 'firebase/firestore';
import { 
  Container, Box, Typography, Grid, Pagination, 
  FormControl, InputLabel, MenuItem, 
  TextField, InputAdornment, CircularProgress, Skeleton
} from '@mui/material';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

// Lazy load the heavy component with virtualization
const BlogPostCard = dynamic(() => import('@/components/blog/BlogPostCard'), {
  loading: () => <PostSkeleton />,
  ssr: false,
});

// Static configuration
export const dynamicConfig = 'force-dynamic';
export const revalidate = 86400; // Revalidate once per day

// Pagination configuration
const POSTS_PER_PAGE = 6;

// Cache timeout (30 minutes in ms)
const CACHE_TIMEOUT = 30 * 60 * 1000;

// Cache for blog posts
let postsCache = {
  data: null,
  timestamp: 0,
  category: null,
  page: 0,
  searchTerm: '',
};

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
const PaginationComponent = React.memo(({ currentPage, totalPages, onPageChange }: { 
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

PaginationComponent.displayName = 'PaginationComponent';

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

// Featured post component to reduce render cost
const FeaturedPost = React.memo(({ post }: { post: DocumentData }) => {
  if (!post) return null;
  
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Post em Destaque
      </Typography>
      <div className="grid grid-cols-1 gap-6">
        <Link href={`/blog/${post.slug}`} prefetch={false} className="block">
          <div className="group grid md:grid-cols-2 gap-6 rounded-lg border p-4 transition-colors hover:border-primary">
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
              {post.imageUrl ? (
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="h-full w-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-image.jpg';
                  }}
                />
              ) : (
                <FileText className="h-16 w-16 text-gray-300" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="mt-2 line-clamp-3 text-muted-foreground">{post.excerpt}</p>
              <div className="mt-4">
                <span className="inline-flex items-center text-primary">
                  Ler artigo completo
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </Box>
  );
});

FeaturedPost.displayName = 'FeaturedPost';

// Main page component
export default function BlogPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Get URL params with fallbacks
  const currentCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSearchTerm = searchParams.get('search') || '';
  
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [featuredPost, setFeaturedPost] = useState<DocumentData | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // Optimize fetch by using SWR pattern
  const fetchWithCache = useCallback(async (url: string) => {
    const cacheKey = url;
    const cachedResponse = sessionStorage.getItem(cacheKey);
    const now = Date.now();
    
    if (cachedResponse) {
      const { data, timestamp } = JSON.parse(cachedResponse);
      if (now - timestamp < CACHE_TIMEOUT) {
        return data;
      }
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    sessionStorage.setItem(
      cacheKey, 
      JSON.stringify({ data, timestamp: now })
    );
    
    return data;
  }, []);

  // Fetch posts based on current params with cache
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check if we have a recent cached result for this query
      const now = Date.now();
      const isCacheValid = 
        postsCache.data && 
        now - postsCache.timestamp < CACHE_TIMEOUT &&
        postsCache.category === currentCategory &&
        postsCache.page === currentPage &&
        postsCache.searchTerm === currentSearchTerm;
      
      if (isCacheValid) {
        // Use cached data
        const { posts, featured, pagination } = postsCache.data;
        setPosts(posts);
        setFeaturedPost(featured);
        setPagination(pagination);
        setLoading(false);
        return;
      }
      
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
      
      const data = await fetchWithCache(apiUrl.toString());
      
      // Update state with fetched data
      setPosts(data.posts || []);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
      });
      
      // Find featured post if we're on page 1 with no filters
      if (currentPage === 1 && !currentCategory && !currentSearchTerm && data.posts?.length > 0) {
        const featured = data.posts.find((post: any) => post.featured === 'true' || post.featured === true);
        setFeaturedPost(featured || data.posts[0]);
      } else {
        setFeaturedPost(null);
      }
      
      // Update cache
      postsCache = {
        data: {
          posts: data.posts || [],
          featured: currentPage === 1 && !currentCategory && !currentSearchTerm ? 
            (data.posts.find((post: any) => post.featured === 'true' || post.featured === true) || data.posts[0]) : null,
          pagination: data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0
          }
        },
        timestamp: now,
        category: currentCategory,
        page: currentPage,
        searchTerm: currentSearchTerm
      };
      
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentPage, currentSearchTerm, fetchWithCache]);

  // Fetch categories once
  const fetchCategories = useCallback(async () => {
    try {
      // Check if categories are cached in sessionStorage
      const cachedCategories = sessionStorage.getItem('blog_categories');
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
        return;
      }
      
      // For simplicity, we're getting categories from the existing posts
      const categoriesSet = new Set<string>();
      
      const postsQuery = query(collection(db, 'blogPosts'), where('status', '==', 'published'));
      const snapshot = await getDocs(postsQuery);
      
      snapshot.docs.forEach(doc => {
        const category = doc.data().category;
        if (category) categoriesSet.add(category);
      });
      
      const categoriesArray = Array.from(categoriesSet);
      setCategories(categoriesArray);
      
      // Cache categories in sessionStorage
      sessionStorage.setItem('blog_categories', JSON.stringify(categoriesArray));
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    // Get categories once
    fetchCategories();
    
    // Get posts whenever URL params change
    fetchPosts();
  }, [fetchCategories, fetchPosts]);

  // Handle category change
  const handleCategoryChange = useCallback((value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set('category', value);
      } else {
        params.delete('category');
      }
      params.set('page', '1'); // Reset to page 1
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [pathname, router, searchParams]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [pathname, router, searchParams]);

  // Handle search with debounce
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        startTransition(() => {
          const params = new URLSearchParams(searchParams);
          if (term) {
            params.set('search', term);
          } else {
            params.delete('search');
          }
          params.set('page', '1'); // Reset to page 1
          router.push(`${pathname}?${params.toString()}`);
        });
      }, 500),
    [pathname, router, searchParams]
  );

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  }, [debouncedSearch]);

  // Loading state
  if (loading) {
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
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg max-w-2xl mx-auto text-center">
          <p>{error}</p>
          <Button className="mt-4" onClick={() => fetchPosts()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Blog
      </Typography>
      
      <Box sx={{ my: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="category-select-label">Categoria</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={currentCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            label="Categoria"
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          variant="outlined"
          placeholder="Buscar posts..."
          defaultValue={currentSearchTerm}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: isPending ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>
      
      {!error && featuredPost && !currentCategory && !currentSearchTerm && (
        <Suspense fallback={<Box sx={{ mb: 6, height: 300, bgcolor: 'grey.100' }} />}>
          <FeaturedPost post={featuredPost} />
        </Suspense>
      )}
      
      <Typography variant="h4" component="h2" sx={{ mb: 2, mt: 4 }}>
        {currentCategory ? `Posts na categoria ${currentCategory}` : 
         currentSearchTerm ? `Resultados para "${currentSearchTerm}"` : 
         'Posts Recentes'}
      </Typography>
      
      <Grid container spacing={4}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Suspense fallback={<PostSkeleton />}>
                <BlogPostCard post={post} />
              </Suspense>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">
                Nenhum post encontrado.
              </Typography>
              {(currentCategory || currentSearchTerm) && (
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    startTransition(() => {
                      router.push('/blog');
                    });
                  }}
                  sx={{ mt: 2 }}
                >
                  Ver todos os posts
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
      
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Pagination 
            count={pagination.totalPages} 
            page={pagination.currentPage} 
            onChange={(_, page) => handlePageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
} 