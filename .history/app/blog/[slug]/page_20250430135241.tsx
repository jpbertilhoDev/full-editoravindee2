"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, Calendar, User, Tag, MessageSquare, Share2, Loader2, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'

// Firebase imports
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Define como esta página deve ser renderizada (necesário para exportação estática)
export const dynamic = 'auto'
export const dynamicParams = true // Permite parâmetros dinâmicos não pré-renderizados
export const revalidate = 3600 // Revalidar a cada hora

// Interface para os posts do blog
interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  authorImage?: string
  authorBio?: string
  category: string
  imageUrl: string
  slug: string
  status: 'published' | 'draft' | 'scheduled'
  featured: 'yes' | 'no'
  tags?: string[]
  readTime?: number
}

// Interface para comentários
interface Comment {
  id: string
  name: string
  email: string
  content: string
  date: string
  approved: boolean
  postId: string
}

// Generate static params for all blog posts (necessário para exportação estática)
export async function generateStaticParams() {
  try {
    // Em um ambiente de build estático, isso ajuda a determinar quais páginas gerar
    const postsQuery = query(
      collection(db, 'blogPosts'),
      where('status', '==', 'published')
    )
    
    const querySnapshot = await getDocs(postsQuery)
    const slugs: { slug: string }[] = []
    
    querySnapshot.forEach((doc) => {
      const postData = doc.data()
      if (postData.slug) {
        slugs.push({ slug: postData.slug })
      }
    })
    
    console.log(`Generated static paths for ${slugs.length} blog posts`)
    return slugs
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Função auxiliar para formatação de data
function formatPostDate(dateString: string) {
  if (!dateString) return ''
  
  try {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: ptBR })
  } catch (e) {
    console.error('Erro ao formatar data:', e)
    return ''
  }
}

// Função auxiliar para obter rótulo da categoria
function getCategoryLabel(category: string) {
  if (!category) return ''
  
  const categoryMap: Record<string, string> = {
    'devotional': 'Devocional',
    'book-reviews': 'Resenhas de Livros',
    'faith': 'Fé',
    'parenting': 'Parentalidade',
    'bible-study': 'Estudo Bíblico',
    'prayer': 'Oração',
    'leadership': 'Liderança'
  }
  
  return categoryMap[category] || category
}

// Função para garantir que todos os campos necessários existam
function ensurePostFields(post: any): BlogPost {
  return {
    id: post.id || '',
    title: post.title || 'Post sem título',
    excerpt: post.excerpt || 'Nenhuma descrição disponível',
    content: post.content || '<p>Conteúdo não disponível</p>',
    date: post.date || '',
    author: post.author || 'Autor desconhecido',
    authorImage: post.authorImage || '',
    authorBio: post.authorBio || '',
    category: post.category || '',
    imageUrl: post.imageUrl || '',
    slug: post.slug || post.id || '',
    status: post.status || 'published',
    featured: post.featured || 'no',
    tags: post.tags || [],
    readTime: post.readTime || 5
  }
}

// Componente principal da página
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  // Função para adicionar logs
  const addLog = (message: string) => {
    console.log(message);
    setDebugLogs(prev => [...prev, message]);
  };

  useEffect(() => {
    async function fetchPostData() {
      try {
        setIsLoading(true);
        setError(null);
        
        addLog(`Buscando post com slug: ${params.slug}`);
        
        // Verificar se há um post direto com o slug como ID
        const postDocRef = doc(db, 'blogPosts', params.slug);
        const postDocSnapshot = await getDoc(postDocRef);
        
        let currentPost: BlogPost | null = null;
        
        if (postDocSnapshot.exists()) {
          // Post encontrado diretamente pelo ID/slug
          addLog(`Post encontrado pelo ID: ${postDocSnapshot.id}`);
          const rawPostData = postDocSnapshot.data();
          currentPost = ensurePostFields({ id: postDocSnapshot.id, ...rawPostData });
        } else {
          // Tenta buscar por consulta where
          addLog('Post não encontrado pelo ID, buscando por slug...');
          const postsQuery = query(
            collection(db, 'blogPosts'),
            where('slug', '==', params.slug),
            where('status', '==', 'published')
          );
          
          const querySnapshot = await getDocs(postsQuery);
          
          if (!querySnapshot.empty) {
            const postDoc = querySnapshot.docs[0];
            addLog(`Post encontrado pela consulta de slug: ${postDoc.id}`);
            const rawPostData = postDoc.data();
            currentPost = ensurePostFields({ id: postDoc.id, ...rawPostData });
          }
        }
        
        if (!currentPost) {
          addLog(`Post não encontrado com slug: ${params.slug}`);
          setPost(null);
          setComments([]);
          setRelatedPosts([]);
          setError('Post não encontrado');
          return;
        }
        
        setPost(currentPost);
        
        // Buscar comentários aprovados para este post
        addLog(`Buscando comentários para o post: ${currentPost.id}`);
        const commentsQuery = query(
          collection(db, 'blogComments'),
          where('postId', '==', currentPost.id),
          where('approved', '==', true)
        );
        
        const commentsSnapshot = await getDocs(commentsQuery);
        const loadedComments: Comment[] = [];
        
        commentsSnapshot.forEach((doc) => {
          loadedComments.push({ id: doc.id, ...doc.data() } as Comment);
        });
        
        addLog(`Encontrados ${loadedComments.length} comentários aprovados`);
        setComments(loadedComments);
        
        // Buscar posts relacionados na mesma categoria
        if (currentPost.category) {
          addLog(`Buscando posts relacionados na categoria: ${currentPost.category}`);
          const relatedQuery = query(
            collection(db, 'blogPosts'),
            where('category', '==', currentPost.category),
            where('status', '==', 'published')
          );
          
          const relatedSnapshot = await getDocs(relatedQuery);
          const loadedRelatedPosts: BlogPost[] = [];
          
          relatedSnapshot.forEach((doc) => {
            if (doc.id !== currentPost.id) {
              const rawRelatedData = doc.data();
              const relatedPost = ensurePostFields({ id: doc.id, ...rawRelatedData });
              loadedRelatedPosts.push(relatedPost);
            }
          });
          
          // Limitar a 3 posts relacionados
          addLog(`Encontrados ${loadedRelatedPosts.length} posts relacionados`);
          setRelatedPosts(loadedRelatedPosts.slice(0, 3));
        }
      } catch (error) {
        console.error('Erro ao buscar dados do post:', error);
        addLog(`ERRO: ${error instanceof Error ? error.message : String(error)}`);
        setError('Não foi possível carregar o post. Tente novamente mais tarde.');
        
        // Notificar o erro ao usuário
        toast({
          title: "Erro ao carregar post",
          description: "Houve um problema ao carregar o conteúdo do post.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPostData();
  }, [params.slug]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-[#08a4a7]" />
          <span className="ml-3 text-lg">Carregando post...</span>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Post não encontrado</h1>
        <p className="text-gray-600 mb-6">O post que você está procurando não existe ou foi removido.</p>
        <Link href="/blog">
          <Button className="bg-[#08a4a7] hover:bg-[#0bdbb6]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Blog
          </Button>
        </Link>
        
        {/* Informações de debug */}
        {debugLogs.length > 0 && (
          <div className="mt-8 max-w-lg mx-auto p-4 border rounded-lg bg-gray-50">
            <details>
              <summary className="cursor-pointer font-medium">Informações de Diagnóstico</summary>
              <div className="mt-2 text-xs font-mono text-left bg-gray-100 p-2 rounded overflow-auto max-h-[300px]">
                {debugLogs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back to blog link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-gray-600 hover:text-[#08a4a7] mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Blog
        </Link>
        
        {/* Post header */}
        <header className="mb-8">
          {post.category && (
            <Badge className="bg-[#08a4a7] hover:bg-[#08a4a7]/80 text-white mb-4">
              {getCategoryLabel(post.category)}
            </Badge>
          )}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-4">
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
            {post.readTime && (
              <div className="flex items-center">
                <span>{post.readTime} min de leitura</span>
              </div>
            )}
          </div>
        </header>
        
        {/* Featured image */}
        {post.imageUrl ? (
          <div className="relative h-[500px] w-full mb-8 overflow-hidden rounded-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        ) : (
          <div className="relative h-[300px] w-full mb-8 overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
            <FileText className="h-20 w-20 text-gray-400" />
          </div>
        )}
        
        {/* Post content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        {/* Debug info para administradores */}
        {debugLogs.length > 0 && (
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <details>
              <summary className="cursor-pointer font-medium">Informações de Diagnóstico</summary>
              <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded overflow-auto max-h-[300px]">
                {debugLogs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </details>
          </div>
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag className="h-4 w-4 text-gray-500" />
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-gray-600">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Author bio */}
        {post.author && (
          <div className="border rounded-lg p-6 mb-12 bg-gray-50">
            <div className="flex items-center mb-4">
              <Avatar className="h-16 w-16 mr-4 border">
                <AvatarImage src={post.authorImage} alt={post.author} />
                <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">Sobre {post.author}</h3>
                <p className="text-gray-600">Autor</p>
              </div>
            </div>
            <p className="text-gray-600">
              {post.authorBio || `${post.author} é um autor que compartilha sua fé e experiências com a comunidade cristã.`}
            </p>
          </div>
        )}
        
        <Separator className="my-12" />
        
        {/* Comments section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Comentários ({comments.length})</h2>
          
          {comments.length > 0 ? (
            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{comment.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{comment.name}</h4>
                        <p className="text-xs text-gray-500">
                          {formatPostDate(comment.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-8">Seja o primeiro a comentar neste post.</p>
          )}
          
          {/* Comment form - placeholder for client-side functionality */}
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Deixe seu comentário</h3>
            <p className="text-sm text-gray-600 mb-4">
              Para comentar neste post, por favor faça login ou preencha o formulário abaixo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#08a4a7]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#08a4a7]"
                />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <label htmlFor="content" className="text-sm font-medium">
                Comentário
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={4}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#08a4a7]"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-[#08a4a7] hover:bg-[#0bdbb6]"
            >
              Enviar comentário
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              * Seu comentário será revisado antes de ser publicado.
            </p>
          </div>
        </section>
        
        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Posts relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  href={`/blog/${relatedPost.slug}`} 
                  key={relatedPost.id}
                  className="group overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-[160px] w-full overflow-hidden">
                    {relatedPost.imageUrl ? (
                      <Image
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold line-clamp-2 group-hover:text-[#08a4a7] transition-colors">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      {relatedPost.date && formatPostDate(relatedPost.date)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 