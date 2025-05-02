"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import BlogPostCard from '@/components/blog/BlogPostCard';
import { toast } from '@/components/ui/use-toast';

// Firebase imports
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { debounce } from '@/lib/utils';

// Definir configurações de renderização estática
export const dynamic = 'auto';
export const revalidate = 3600; // Revalidar a cada hora

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

// Componente principal da página
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      // Query otimizada - já com índice composto no Firestore
      const postsQuery = query(
        collection(db, "blogPosts"),
        where("status", "==", "published")
      );
      
      const querySnapshot = await getDocs(postsQuery);
      
      const fetchedPosts: BlogPost[] = [];
      const featuredPosts: BlogPost[] = [];
      const uniqueCategories = new Set<string>();
      
      // Processar os resultados
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<BlogPost, "id">;
        const post = {
          id: doc.id,
          ...data
        };
        
        fetchedPosts.push(post);
        
        if (data.featured === "yes") {
          featuredPosts.push(post);
        }
        
        if (data.category) {
          uniqueCategories.add(data.category);
        }
      });
      
      // Ordenar posts manualmente pela data
      fetchedPosts.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
      setFeaturedPosts(featuredPosts);
      setCategories(Array.from(uniqueCategories).sort());
      
      if (fetchedPosts.length === 0) {
        toast({
          title: "Nenhum post encontrado",
          description: "Não há posts publicados disponíveis no momento.",
        });
      }
      
    } catch (error) {
      console.error("Erro ao buscar posts do blog:", error);
      setError("Não foi possível carregar os posts do blog.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar posts com debounce para melhorar performance
  const filterPosts = debounce(() => {
    let filtered = [...posts];
    
    // Filtrar por categoria
    if (selectedCategory && selectedCategory !== 'todas') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    // Filtrar por termo de busca
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.excerpt.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredPosts(filtered);
  }, 300);

  // Efeito para buscar posts
  useEffect(() => {
    fetchBlogPosts();
  }, []);
  
  // Efeito para filtrar posts
  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory, posts]);
  
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
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-6">Nosso Blog</h1>
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg max-w-2xl mx-auto text-center">
          <p>{error}</p>
          <Button className="mt-4" onClick={() => fetchBlogPosts()}>
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
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Em destaque</h2>
          <div className="grid grid-cols-1 gap-6">
            {featuredPosts.slice(0, 1).map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="block">
                <div className="group grid md:grid-cols-2 gap-6 rounded-lg border p-4 transition-colors hover:border-primary">
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold group-hover:text-primary">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-4">
                      <span className="inline-flex items-center text-primary">
                        Ler artigo completo
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
      
      {/* Lista de posts */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
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
              setSelectedCategory('todas');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
} 