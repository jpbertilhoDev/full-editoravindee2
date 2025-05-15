import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, Calendar, User, Tag, MessageSquare, Share2, Loader2, FileText } from 'lucide-react'
import { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import BlogCommentForm from '@/components/blog/BlogCommentForm'
import BlogPostMetadata from '@/components/blog/BlogPostMetadata'
import OptimizedImage from '@/components/ui/image-loader'

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

// Generate static params for all blog posts (necesário para exportação estática)
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

// Buscar o post do blog pelo slug
async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Verificar se há um post direto com o slug como ID
    const postDocRef = doc(db, 'blogPosts', slug);
    const postDocSnapshot = await getDoc(postDocRef);
    
    if (postDocSnapshot.exists()) {
      // Post encontrado diretamente pelo ID/slug
      const rawPostData = postDocSnapshot.data();
      return ensurePostFields({ id: postDocSnapshot.id, ...rawPostData });
    }
    
    // Tenta buscar por consulta where
    const postsQuery = query(
      collection(db, 'blogPosts'),
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    
    const querySnapshot = await getDocs(postsQuery);
    
    if (!querySnapshot.empty) {
      const postDoc = querySnapshot.docs[0];
      const rawPostData = postDoc.data();
      return ensurePostFields({ id: postDoc.id, ...rawPostData });
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar dados do post:', error);
    return null;
  }
}

// Buscar comentários para um post
async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const commentsQuery = query(
      collection(db, 'blogComments'),
      where('postId', '==', postId),
      where('approved', '==', true)
    );
    
    const commentsSnapshot = await getDocs(commentsQuery);
    const loadedComments: Comment[] = [];
    
    commentsSnapshot.forEach((doc) => {
      loadedComments.push({ id: doc.id, ...doc.data() } as Comment);
    });
    
    return loadedComments;
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return [];
  }
}

// Buscar posts relacionados
async function getRelatedPosts(category: string, currentPostId: string): Promise<BlogPost[]> {
  try {
    if (!category) return [];
    
    const relatedQuery = query(
      collection(db, 'blogPosts'),
      where('category', '==', category),
      where('status', '==', 'published')
    );
    
    const relatedSnapshot = await getDocs(relatedQuery);
    const loadedRelatedPosts: BlogPost[] = [];
    
    relatedSnapshot.forEach((doc) => {
      if (doc.id !== currentPostId) {
        const rawRelatedData = doc.data();
        const relatedPost = ensurePostFields({ id: doc.id, ...rawRelatedData });
        loadedRelatedPosts.push(relatedPost);
      }
    });
    
    return loadedRelatedPosts.slice(0, 3);
  } catch (error) {
    console.error('Erro ao buscar posts relacionados:', error);
    return [];
  }
}

// Função para gerar metadata da página para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post não encontrado',
      description: 'O conteúdo que você está procurando não está disponível.'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags || [],
    authors: [{ name: post.author }],
    category: getCategoryLabel(post.category),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

// Componente principal da página
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Post não encontrado</h1>
          <p className="text-gray-600 mb-6">O post que você está procurando não existe ou foi removido.</p>
          <Link href="/blog">
            <Button variant="default">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const comments = await getCommentsByPostId(post.id);
  const relatedPosts = await getRelatedPosts(post.category, post.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botão de Voltar */}
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Blog
          </Button>
        </Link>
      </div>
      
      {/* Cabeçalho do Post */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <BlogPostMetadata 
          date={post.date}
          author={post.author}
          category={post.category}
          readTime={post.readTime}
          className="mb-6"
          iconSize={4}
        />
      </div>
      
      {/* Imagem de destaque */}
      {post.imageUrl && (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-8 rounded-lg overflow-hidden">
          <OptimizedImage 
            src={post.imageUrl} 
            alt={post.title}
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority
          />
        </div>
      )}
      
      {/* Conteúdo do Post */}
      <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* Seção do Autor */}
      {post.author && (
        <div className="border-t border-b border-gray-200 py-6 mb-12">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border shadow-sm">
              {post.authorImage ? (
                <AvatarImage src={post.authorImage} alt={post.author} />
              ) : (
                <AvatarFallback className="bg-white text-gray-800 border">{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{post.author}</h3>
              {post.authorBio && <p className="text-gray-600 text-sm">{post.authorBio}</p>}
            </div>
          </div>
        </div>
      )}
      
      {/* Comentários */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comentários {comments.length > 0 && `(${comments.length})`}
        </h2>
        
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{comment.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {comment.date ? formatPostDate(comment.date) : ''}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        )}
        
        {/* Formulário de comentários (componente client) */}
        <div className="mt-8">
          <BlogCommentForm postId={post.id} postSlug={post.slug} />
        </div>
      </div>
      
      {/* Posts Relacionados */}
      {relatedPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Posts Relacionados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} prefetch={false}>
                <div className="group h-full border rounded-lg overflow-hidden transition-colors hover:border-primary">
                  {relatedPost.imageUrl && (
                    <div className="relative w-full h-40 bg-muted">
                      <OptimizedImage
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 300px"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold truncate group-hover:text-primary">
                      {relatedPost.title}
                    </h3>
                    
                    {relatedPost.date && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatPostDate(relatedPost.date)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 