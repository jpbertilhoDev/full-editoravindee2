"use client"

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
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

// Firebase imports
import { collection, query, getDocs, where, orderBy, limit, startAfter, DocumentData, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { debounce } from '@/lib/utils';

// Lazy load the heavy component
const BlogPostCard = dynamic(() => import('@/components/blog/BlogPostCard'), {
  loading: () => (
    <div className="h-full w-full rounded-lg border bg-gray-50 p-4 animate-pulse">
      <div className="h-32 w-full bg-gray-200 rounded-md mb-4"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
    </div>
  ),
  ssr: false,
});

// Definir configurações de renderização estática
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar a cada hora

// Configuração de paginação
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

// Componente de paginação
const Pagination = ({ currentPage, totalPages, onPageChange }: { 
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
};

// Componente de skeleton loader para posts
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

// Componente principal da página
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
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Função para buscar posts com memoização e paginação
  const fetchBlogPosts = useCallback(async (pageNumber = 1, category = 'todas') => {
    if (pageNumber === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    
    try {
      let postsQuery: Query<DocumentData>;
      
      // Query base
      if (category === 'todas') {
        postsQuery = query(
          collection(db, "blogPosts"),
          where("status", "==", "published"),
          orderBy("date", "desc"),
          limit(POSTS_PER_PAGE)
        );
      } else {
        postsQuery = query(
          collection(db, "blogPosts"),
          where("status", "==", "published"),
          where("category", "==", category),
          orderBy("date", "desc"),
          limit(POSTS_PER_PAGE)
        );
      }
      
      // Adicionar startAfter para paginação
      if (pageNumber > 1 && lastVisible) {
        if (category === 'todas') {
          postsQuery = query(
            collection(db, "blogPosts"),
            where("status", "==", "published"),
            orderBy("date", "desc"),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
          );
        } else {
          postsQuery = query(
            collection(db, "blogPosts"),
            where("status", "==", "published"),
            where("category", "==", category),
            orderBy("date", "desc"),
            startAfter(lastVisible),
            limit(POSTS_PER_PAGE)
          );
        }
      }
      
      const querySnapshot = await getDocs(postsQuery);
      
      if (querySnapshot.empty && pageNumber === 1) {
        setPosts([]);
        setFilteredPosts([]);
        setFeaturedPost(null);
        setCategories([]);
        setTotalPages(1);
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
        return;
      }
      
      // Salvar último documento para paginação
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);
      setHasMore(querySnapshot.docs.length === POSTS_PER_PAGE);
      
      const fetchedPosts: BlogPost[] = [];
      const uniqueCategories = new Set<string>();
      let featuredPostData: BlogPost | null = null;
      
      // Processar os resultados
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<BlogPost, "id">;
        const post = {
          id: doc.id, 
          ...data
        };
        
        fetchedPosts.push(post);
        
        if (data.featured === "yes" && !featuredPostData && pageNumber === 1) {
          featuredPostData = post;
        }
        
        if (data.category) {
          uniqueCategories.add(data.category);
        }
      });
      
      // Criar ou atualizar a lista de posts
      if (pageNumber === 1) {
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
        setFeaturedPost(featuredPostData);
      } else {
        setPosts(prev => [...prev, ...fetchedPosts]);
        setFilteredPosts(prev => [...prev, ...fetchedPosts]);
      }
      
      // Buscar todas as categorias na primeira página
      if (pageNumber === 1) {
        const categoriesQuery = query(
          collection(db, "blogPosts"),
          where("status", "==", "published")
        );
        
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const allCategories = new Set<string>();
        
        categoriesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category) {
            allCategories.add(data.category);
          }
        });
        
        setCategories(Array.from(allCategories).sort());
        
        // Estimar o número total de páginas
        setTotalPages(Math.ceil(categoriesSnapshot.size / POSTS_PER_PAGE));
      }
      
    } catch (error) {
      console.error("Erro ao buscar posts do blog:", error);
      setError("Não foi possível carregar os posts do blog. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [lastVisible]);

  // Navegar entre páginas
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || (page > totalPages && !hasMore)) return;
    
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page > 1) {
      fetchBlogPosts(page, selectedCategory);
    }
  }, [totalPages, hasMore, fetchBlogPosts, selectedCategory]);

  // Função para alterar categoria
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setLastVisible(null);
    setHasMore(true);
    fetchBlogPosts(1, category);
  }, [fetchBlogPosts]);

  // Filtrar posts de forma eficiente
  const filterPosts = useCallback(
    debounce(() => {
      if (!searchQuery.trim()) {
        handleCategoryChange(selectedCategory);
        return;
      }
      
      let filtered = [...posts];
      
      // Filtrar por termo de busca
      const searchLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.excerpt.toLowerCase().includes(searchLower)
      );
      
      setFilteredPosts(filtered);
    }, 300),
    [posts, searchQuery, selectedCategory, handleCategoryChange]
  );

  // Efeito para buscar posts
  useEffect(() => {
    fetchBlogPosts(1, 'todas');
  }, []);
  
  // Efeito para filtrar posts
  useEffect(() => {
    filterPosts();
  }, [searchQuery, filterPosts]);
  
  // Renderizar loading state
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
  
  // Renderizar erro
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-6">Nosso Blog</h1>
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg max-w-2xl mx-auto text-center">
          <p>{error}</p>
          <Button className="mt-4" onClick={() => fetchBlogPosts(1, 'todas')}>
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

      {/* Post em destaque */}
      {featuredPost && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Em destaque</h2>
          <div className="grid grid-cols-1 gap-6">
            <Link href={`/blog/${featuredPost.slug}`} prefetch={false} className="block">
              <div className="group grid md:grid-cols-2 gap-6 rounded-lg border p-4 transition-colors hover:border-primary">
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  {featuredPost.imageUrl ? (
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <FileText className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-semibold group-hover:text-primary">{featuredPost.title}</h3>
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

      {/* Filtros */}
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
      
      {/* Lista de posts com lazy loading */}
      {filteredPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense fallback={
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </>
            }>
              {filteredPosts.map((post) => (
                <div key={post.id} className="transition-opacity duration-500 opacity-100">
                  <BlogPostCard post={post} />
                </div>
              ))}
            </Suspense>
          </div>
          
          {/* Paginação */}
          {!searchQuery && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
          
          {/* Botão para carregar mais (alternativa à paginação) */}
          {hasMore && !searchQuery && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={isLoadingMore}
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