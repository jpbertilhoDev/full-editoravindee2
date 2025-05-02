import React from 'react';
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
  status: 'published' | 'draft';
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

// Componente principal do card de post
function BlogPostCard({ post }: { post: BlogPost }) {
  const postDate = post.createdAt
    ? formatDate(post.createdAt.seconds)
    : 'Data indisponível';

  // Define imagem de fallback para posts sem imagem
  const fallbackImage = "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  
  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md',
        post.featured === 'yes' ? 'md:flex-row' : '',
      )}
    >
      <div className={cn(
        'relative lazy-load',
        post.featured === 'yes' ? 'md:w-1/2' : 'aspect-video w-full'
      )}>
        <LazyImage
          src={post.imageUrl || fallbackImage}
          alt={post.title}
          fallbackSrc={fallbackImage}
          aspectRatio={post.featured === 'yes' ? 'aspect-[16/12] md:aspect-square' : 'aspect-video'}
          eager={post.featured === 'yes'}
        />
      </div>
      
      <div className={cn(
        'flex flex-col justify-between p-5',
        post.featured === 'yes' ? 'md:w-1/2' : ''
      )}>
        <div>
          {post.category && (
            <span className="mb-2 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {formatCategory(post.category)}
            </span>
          )}
          
          <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600">
            <Link href={`/blog/${post.slug}`} className="line-clamp-2">
              {post.title}
            </Link>
          </h3>
          
          <p className="mb-3 line-clamp-3 text-gray-600">
            {post.excerpt || post.content?.substring(0, 150)}
          </p>
        </div>
        
        <div>
          <div className="mb-3 flex items-center text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <time>{postDate}</time>
            </div>
            
            {post.author && (
              <div className="flex items-center">
                <UserIcon className="mr-1 h-4 w-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            Ler mais
            <svg
              className="ml-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export { BlogPostCard };
export default BlogPostCard; 