"use client";

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Product } from '@/lib/types';
import { CN_BUTTON_PRIMARY } from '@/lib/constants/classes';
import { cn } from '@/lib/utils';

interface AddToCartProps {
  product: Product;
  variant?: 'default' | 'slim' | 'icon';
  fullWidth?: boolean;
  quantity?: number;
  className?: string;
  showQuantity?: boolean;
  onClick?: () => void;
}

export default function AddToCart({
  product,
  variant = 'default',
  fullWidth = false,
  quantity = 1,
  className = '',
  showQuantity = false,
  onClick,
}: AddToCartProps) {
  const { addItem } = useCart();
  const { t } = useTranslation();
  
  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addItem(product, quantity);
    
    toast.success(`${product.title} added to cart`, {
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`,
      action: {
        label: 'View Cart',
        onClick: () => {
          // Navegar para o carrinho ou abrir o sidebar do carrinho
          window.location.href = '/cart';
        },
      },
    });
    
    if (onClick) onClick();
  };

  // Determinar classes com base na variante
  const buttonClasses = cn(
    CN_BUTTON_PRIMARY,
    {
      'w-full': fullWidth,
      'px-3 py-1 h-8 text-sm': variant === 'slim',
      'w-9 h-9 p-0': variant === 'icon',
    },
    className
  );

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={buttonClasses}
      aria-label={isOutOfStock 
        ? t('buttons.outOfStock') 
        : `${t('buttons.addToCart')} - ${product.title}`}
    >
      {variant === 'icon' ? (
        <ShoppingBag className="h-4 w-4" />
      ) : (
        <>
          <ShoppingBag className="h-4 w-4 mr-2" />
          <span>
            {isOutOfStock
              ? t('buttons.outOfStock')
              : showQuantity
                ? `${t('buttons.addToCart')} (${quantity})`
                : t('buttons.addToCart')}
          </span>
        </>
      )}
    </Button>
  );
} 