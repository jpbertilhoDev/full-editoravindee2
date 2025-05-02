"use client";

import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import WishlistButton from './WishlistButton';
import { cn } from '@/lib/utils';

interface QuickActionButtonsProps {
  product: Product;
  isHovered: boolean;
}

const QuickActionButtons = ({ product, isHovered }: QuickActionButtonsProps) => {
  return (
    <div
      className={cn(
        "absolute top-3 right-3 flex flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300",
        isHovered ? "opacity-100 translate-x-0" : ""
      )}
    >
      <WishlistButton product={product} size="sm" />
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-md bg-white/90 dark:bg-gray-800/90 h-8 w-8 hover:bg-white"
      >
        <Bookmark className="h-4 w-4" />
        <span className="sr-only">Save for later</span>
      </Button>
    </div>
  );
};

export default QuickActionButtons; 