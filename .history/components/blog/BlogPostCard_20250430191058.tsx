import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Tag, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    <Link 
      href={`/blog/${post.slug}`} 
      prefetch={false}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
    >
      <div className={cn(
        "group h-full flex flex-col overflow-hidden rounded-xl border bg-white hover:border-primary transition-all duration-300 hover:shadow-lg",
        className
      )}>
        <div className="relative h-48 w-full overflow-hidden">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl || '/images/placeholder-image.jpg'}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdQJAFivt4QAAAABJRU5ErkJggg=="
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-image.jpg';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <Tag className="h-12 w-12 text-gray-300" />
            </div>
          )}
          
          {formattedCategory && (
            <div className="absolute top-3 right-3">
              <Badge className="font-medium text-xs px-2.5 py-0.5 bg-primary/90 hover:bg-primary text-white">
                {formattedCategory}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>
          
          <p className="line-clamp-3 flex-1 text-muted-foreground mb-4">
            {post.excerpt || 'Clique para ler mais...'}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              {formattedDate}
            </div>
            
            <div className="text-primary font-medium group-hover:translate-x-1 transition-transform duration-300">
              Ler artigo →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(BlogPostCard); 