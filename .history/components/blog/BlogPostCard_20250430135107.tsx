import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, User, ChevronRight, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

// Função auxiliar para formatação de data
function formatPostDate(dateString: string) {
  if (!dateString) return '';
  
  try {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: ptBR });
  } catch (e) {
    console.error('Erro ao formatar data:', e);
    return '';
  }
}

// Função auxiliar para obter rótulo da categoria
function getCategoryLabel(category: string) {
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
}

interface BlogPostCardProps {
  post: BlogPost;
  isFeatured?: boolean;
}

export function BlogPostCard({ post, isFeatured = false }: BlogPostCardProps) {
  // Garantir que o post tenha um slug, ou usar id como fallback
  const postSlug = post.slug || post.id || 'post';
  const postTitle = post.title || 'Post sem título';
  
  return (
    <Link 
      href={`/blog/${postSlug}`} 
      key={post.id}
      className="group overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="relative h-[200px] w-full overflow-hidden">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={postTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
        )}
        {post.category && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-[#08a4a7] hover:bg-[#08a4a7]/80 text-white">
              {getCategoryLabel(post.category)}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className={`font-bold mb-2 line-clamp-2 group-hover:text-[#08a4a7] transition-colors ${isFeatured ? 'text-xl' : 'text-lg'}`}>
          {postTitle}
        </h3>
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-3">
          {post.date && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatPostDate(post.date)}</span>
            </div>
          )}
          {post.author && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{post.author}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {post.excerpt || 'Clique para ler este post.'}
        </p>
        <span className="inline-flex items-center text-sm text-[#08a4a7] group-hover:text-[#0bdbb6] transition-colors">
          Continuar lendo
          <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
} 