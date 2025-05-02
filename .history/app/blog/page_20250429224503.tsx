"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Calendar, User, Tag, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

// Firebase imports
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      // Buscar somente posts publicados
      const postsQuery = query(
        collection(db, 'blogPosts'),
        where('status', '==', 'published'),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(postsQuery);
      const fetchedPosts: BlogPost[] = [];
      const uniqueCategories = new Set<string>();
      const featured: BlogPost[] = [];
      
      querySnapshot.forEach((doc) => {
        const postData = { 
          id: doc.id, 
          ...doc.data() 
        } as BlogPost;
        
        fetchedPosts.push(postData);
        
        if (postData.category) {
          uniqueCategories.add(postData.category);
        }
        
        if (postData.featured === 'yes') {
          featured.push(postData);
        }
      });
      
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
      setFeaturedPosts(featured.slice(0, 2)); // Limitar a 2 posts em destaque
      setCategories(Array.from(uniqueCategories).sort());
    } catch (error) {
      console.error('Erro ao buscar posts do blog:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os posts do blog.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar posts quando o usuário pesquisa ou filtra por categoria
  useEffect(() => {
    let results = posts;
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(lowerCaseSearch) ||
        post.excerpt.toLowerCase().includes(lowerCaseSearch) ||
        post.content.toLowerCase().includes(lowerCaseSearch) ||
        post.author.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    if (categoryFilter !== 'all') {
      results = results.filter(post => post.category === categoryFilter);
    }
    
    setFilteredPosts(results);
  }, [searchTerm, categoryFilter, posts]);

  const formatPostDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'devotional': 'Devocional',
      'book-reviews': 'Resenhas de Livros',
      'faith': 'Fé',
      'parenting': 'Parentalidade',
      'bible-study': 'Estudo Bíblico',
      'prayer': 'Oração',
      'leadership': 'Liderança'
    };
    
    return categoryMap[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-6">Nosso Blog</h1>
      <p className="text-center text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
        Reflexões, devocional, insights e recursos para sua caminhada espiritual.
        Explore tópicos bíblicos, práticas de oração e histórias inspiradoras.
      </p>

      {/* Seção de Posts em Destaque */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Posts em Destaque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              Array(2).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : (
              featuredPosts.map(post => (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className="group overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-[250px] w-full overflow-hidden">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sem imagem</span>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#08a4a7] hover:bg-[#08a4a7]/80 text-white px-3 py-1">
                          {getCategoryLabel(post.category)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#08a4a7] transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      {post.date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatPostDate(post.date)}</span>
                        </div>
                      )}
                      {post.author && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <span className="inline-flex items-center text-[#08a4a7] group-hover:text-[#0bdbb6] transition-colors">
                      Ler mais
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar posts..."
              className="pl-10 border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                <SelectValue placeholder="Categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.id}
              className="group overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="relative h-[200px] w-full overflow-hidden">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
                {post.category && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#08a4a7] hover:bg-[#08a4a7]/80 text-white">
                      {getCategoryLabel(post.category)}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-[#08a4a7] transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500 mb-2 space-x-3">
                  {post.date && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatPostDate(post.date)}</span>
                    </div>
                  )}
                  {post.author && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{post.author}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{post.excerpt}</p>
                <span className="inline-flex items-center text-sm text-[#08a4a7] group-hover:text-[#0bdbb6] transition-colors">
                  Continuar lendo
                  <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 text-center py-12">
            <div className="mx-auto max-w-sm">
              <h3 className="text-lg font-medium mb-2">Nenhum post encontrado</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || categoryFilter !== 'all' ? 
                  "Tente ajustar os filtros de pesquisa ou selecionar outra categoria." : 
                  "Ainda não há posts publicados neste blog."}
              </p>
              {(searchTerm || categoryFilter !== 'all') && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                  }}
                  className="bg-[#08a4a7] hover:bg-[#0bdbb6]"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 