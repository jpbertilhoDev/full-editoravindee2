import React, { memo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import LazyImage from '@/components/ui/lazy-image';

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
  createdAt: { seconds: number; nanoseconds: number };
  status: 'published' | 'draft' | 'scheduled';
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

// Função auxiliar para formatar a data
export function formatDate(seconds: number): string {
  const date = new Date(seconds * 1000);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Função auxiliar para formatar categorias
export function formatCategory(category: string): string {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

// Componente otimizado de imagem com lazy loading
const OptimizedImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"%3E%3C/path%3E%3Cpolyline points="14 2 14 8 20 8"%3E%3C/polyline%3E%3C/svg%3E';

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <FileText className="w-8 h-8 text-gray-300" />
        </div>
      )}
      {error ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <FileText className="h-10 w-10 text-gray-300" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
}

const BlogPostCard = ({ post, className }: BlogPostCardProps) => {
  const formattedDate = formatPostDate(post.date);
  const formattedCategory = getCategoryLabel(post.category);
  
  return (
    <Link href={`/blog/${post.slug}`} prefetch={false}>
      <div className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border bg-white hover:border-primary transition-colors duration-300 shadow-sm",
        className
      )}>
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          {post.imageUrl ? (
            <LazyImage
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              placeholderStyles="bg-muted animate-pulse"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
        
        <div className="flex flex-1 flex-col p-5">
          {formattedCategory && (
            <Badge variant="outline" className="mb-2 max-w-max">
              {formattedCategory}
            </Badge>
          )}
          
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>
          
          {formattedDate && (
            <p className="mt-1 text-sm text-muted-foreground">
              {formattedDate}
              {post.author && ` · ${post.author}`}
            </p>
          )}
          
          <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">
            {post.excerpt || 'Clique para ler mais...'}
          </p>
          
          <div className="mt-4 pt-2 border-t text-sm text-primary">
            Ler mais
          </div>
        </div>
      </div>
    </Link>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(BlogPostCard); 