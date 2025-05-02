import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Interface para o BlogPost
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  slug: string;
  featured: 'yes' | 'no';
}

// Função auxiliar para formatação de data
const formatPostDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: ptBR });
  } catch (e) {
    console.error('Erro ao formatar data:', e);
    return '';
  }
};

// Função auxiliar para obter rótulo da categoria
const getCategoryLabel = (category: string) => {
  if (!category) return '';
  
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

// Componente otimizado do BlogPostCard
export const BlogPostCard = ({ post }: { post: BlogPost }) => {
  // Renderização condicional para placeholder de imagem
  const hasImage = Boolean(post.imageUrl);
  
  return (
    <Link href={`/blog/${post.slug}`} prefetch={false}>
      <article className="group h-full overflow-hidden rounded-lg border transition-colors hover:border-primary">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {hasImage ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-muted-foreground"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <header>
            {post.category && (
              <Badge 
                variant="secondary" 
                className="mb-2 text-xs font-normal"
              >
                {getCategoryLabel(post.category)}
              </Badge>
            )}
            <h2 className="line-clamp-2 text-xl font-semibold group-hover:text-primary">
              {post.title}
            </h2>
          </header>
          
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {post.date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatPostDate(post.date)}</span>
              </div>
            )}
          </div>
          
          {post.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          
          <div className="mt-4">
            <span className="text-sm font-medium text-primary group-hover:underline">
              Ler mais
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

// Exportar tanto como default quanto como named export
export default BlogPostCard; 