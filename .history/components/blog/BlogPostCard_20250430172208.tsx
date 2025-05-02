import React, { memo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="relative h-40 w-full overflow-hidden rounded-lg lg:h-52">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder-image.jpg';
              console.log(`Imagem de blog não carregada: ${post.imageUrl}`);
            }}
          />
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