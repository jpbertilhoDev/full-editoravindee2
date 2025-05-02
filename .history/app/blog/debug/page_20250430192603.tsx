"use client"

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Firebase imports
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
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

export default function DebugBlogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Função para adicionar entradas de log
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].slice(0, -1)}: ${message}`]);
  };

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    setLogs([]);
    setError(null);
    
    try {
      addLog("Iniciando busca de posts...");
      
      // Criar e logar a query
      const postsQuery = query(
        collection(db, "blogPosts"),
        where("status", "==", "published"),
        orderBy("date", "desc")
      );
      addLog("Query criada para busca de posts publicados ordenados por data");
      
      // Obter os resultados
      addLog("Executando query no Firestore...");
      const querySnapshot = await getDocs(postsQuery);
      addLog(`Resposta recebida do Firestore - ${querySnapshot.size} documentos retornados`);
      
      if (querySnapshot.empty) {
        addLog("Nenhum post encontrado com os critérios especificados");
      }
      
      const fetchedPosts: BlogPost[] = [];
      
      // Processar os resultados
      querySnapshot.forEach((doc) => {
        addLog(`Processando documento com ID: ${doc.id}`);
        const data = doc.data() as Omit<BlogPost, "id">;
        
        // Verificar se todos os campos necessários existem
        const requiredFields = ['title', 'excerpt', 'content', 'date', 'author', 'slug', 'status'];
        const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);
        
        if (missingFields.length > 0) {
          addLog(`Aviso: Post ${doc.id} está faltando campos: ${missingFields.join(', ')}`);
        }
        
        const post = {
          id: doc.id,
          ...data
        } as BlogPost;
        
        fetchedPosts.push(post);
        addLog(`Post "${post.title}" adicionado à lista (status: ${post.status})`);
      });
      
      addLog(`Total de posts processados: ${fetchedPosts.length}`);
      setPosts(fetchedPosts);
      
    } catch (error) {
      console.error("Erro ao buscar posts do blog:", error);
      addLog(`ERRO: ${error instanceof Error ? error.message : String(error)}`);
      setError("Não foi possível carregar os posts do blog.");
    } finally {
      setIsLoading(false);
      addLog("Operação concluída");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-6">Diagnóstico do Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Ações de Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={fetchBlogPosts} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buscar Posts do Blog
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/blog'} 
                className="w-full"
              >
                Ir para a Página do Blog
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {isLoading ? 'Carregando...' : error ? 'Erro' : `${posts.length} posts encontrados`}</p>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs de Operação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm h-[300px] overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">
                  Nenhum log disponível. Clique em "Buscar Posts do Blog" para começar.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Posts encontrados */}
        {posts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Posts Encontrados ({posts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border p-4 rounded-md">
                    <h3 className="text-lg font-bold">{post.title}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div><strong>ID:</strong> {post.id}</div>
                      <div><strong>Slug:</strong> {post.slug}</div>
                      <div><strong>Status:</strong> {post.status}</div>
                      <div><strong>Data:</strong> {post.date}</div>
                      <div><strong>Autor:</strong> {post.author}</div>
                      <div><strong>Categoria:</strong> {post.category || 'N/A'}</div>
                      <div><strong>Destaque:</strong> {post.featured}</div>
                      <div className="col-span-2">
                        <strong>Imagem:</strong> {post.imageUrl ? 'Sim' : 'Não'}
                        {post.imageUrl && (
                          <div className="mt-2">
                            <img src={post.imageUrl} alt={post.title} className="h-20 object-cover rounded" />
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <strong>Resumo:</strong> {post.excerpt || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 