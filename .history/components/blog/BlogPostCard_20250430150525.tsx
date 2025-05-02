import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, FileText } from 'lucide-react';
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

// Componente principal do card de post
function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      prefetch={false}
      className="group h-full block"
    >
      <article className="h-full overflow-hidden rounded-lg border transition-colors hover:border-primary">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
          {post.imageUrl && (
            <OptimizedImage
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
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
}

export { BlogPostCard };
export default BlogPostCard; 