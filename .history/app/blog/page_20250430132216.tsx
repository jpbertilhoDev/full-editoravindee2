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
import { BlogPostCard } from '@/components/blog/BlogPostCard';

// Firebase imports
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      console.log("Iniciando busca de posts...");
      
      // Criar e logar a query
      const postsQuery = query(
        collection(db, "blogPosts"),
        where("status", "==", "published"),
        orderBy("date", "desc")
      );
      console.log("Query criada:", postsQuery);
      
      // Obter os resultados
      console.log("Executando query no Firestore...");
      const querySnapshot = await getDocs(postsQuery);
      console.log("Resposta recebida do Firestore");
      console.log("Número de documentos retornados:", querySnapshot.size);
      
      const fetchedPosts: BlogPost[] = [];
      const featuredPosts: BlogPost[] = [];
      const uniqueCategories = new Set<string>();
      
      // Processar os resultados
      querySnapshot.forEach((doc) => {
        console.log("Processando documento:", doc.id);
        const data = doc.data() as Omit<BlogPost, "id">;
        console.log("Dados do documento:", JSON.stringify(data));
        
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
      
      console.log("Total de posts processados:", fetchedPosts.length);
      console.log("Posts em destaque:", featuredPosts.length);
      console.log("Categorias encontradas:", Array.from(uniqueCategories));
      
      setPosts(fetchedPosts);
      setFeaturedPosts(featuredPosts);
      setCategories(Array.from(uniqueCategories).sort());
      
    } catch (error) {
      console.error("Erro ao buscar posts do blog:", error);
      setError("Não foi possível carregar os posts do blog.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-center mb-6">Nosso Blog</h1>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-[#08a4a7]" />
          <span className="ml-3 text-lg">Carregando posts...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-6">Nosso Blog</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-2xl mx-auto text-center">
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }
  
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
            {featuredPosts.map(post => (
              <BlogPostCard key={post.id} post={post} isFeatured={true} />
            ))}
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
              disabled
            />
          </div>
          <div className="w-full md:w-48">
            <Select disabled>
              <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Para usar a busca e filtros, por favor visite a versão online do blog.
        </p>
      </div>

      {/* Lista de Posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-3 py-20 text-center">
            <div className="bg-gray-50 rounded-lg p-12 max-w-2xl mx-auto border">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum post encontrado</h3>
              <p className="text-gray-500 mb-4">
                Ainda não há posts publicados neste blog. O conteúdo será adicionado em breve.
              </p>
              <p className="text-gray-400 text-sm">
                Se você é um administrador, faça login e acesse o painel admin para criar o primeiro post.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 