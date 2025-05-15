import React from 'react';
import { Calendar, User, Tag, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogPostMetadataProps {
  date?: string;
  author?: string;
  category?: string;
  readTime?: number;
  className?: string;
  iconSize?: number;
  textSize?: 'xs' | 'sm' | 'base';
  layout?: 'horizontal' | 'vertical';
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

// Função para obter o texto da categoria
function getCategoryLabel(category: string) {
  if (!category) return '';
  
  // Formata a categoria para exibição (capitaliza primeira letra)
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function BlogPostMetadata({
  date,
  author,
  category,
  readTime,
  className = '',
  iconSize = 4,
  textSize = 'sm',
  layout = 'horizontal'
}: BlogPostMetadataProps) {
  const textSizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base'
  }[textSize];
  
  const wrapperClass = layout === 'vertical' 
    ? 'flex flex-col gap-2' 
    : 'flex flex-wrap items-center gap-4';
    
  return (
    <div className={`${wrapperClass} text-gray-700 ${className}`}>
      {date && (
        <div className="flex items-center gap-1">
          <Calendar className={`h-${iconSize} w-${iconSize} text-primary`} />
          <span className={textSizeClass}>{formatPostDate(date)}</span>
        </div>
      )}
      
      {author && (
        <div className="flex items-center gap-1">
          <User className={`h-${iconSize} w-${iconSize} text-primary`} />
          <span className={textSizeClass}>{author}</span>
        </div>
      )}
      
      {category && (
        <div className="flex items-center gap-1">
          <Tag className={`h-${iconSize} w-${iconSize} text-primary`} />
          <span className={textSizeClass}>{getCategoryLabel(category)}</span>
        </div>
      )}
      
      {readTime && (
        <div className="flex items-center gap-1">
          <Clock className={`h-${iconSize} w-${iconSize} text-primary`} />
          <span className={textSizeClass}>{readTime} min de leitura</span>
        </div>
      )}
    </div>
  );
} 