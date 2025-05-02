"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate shipping and total
  const shipping = cartTotal > 35 ? 0 : 4.99;
  const finalTotal = cartTotal + shipping;
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Track if cart has just been updated for animation purposes
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);
  
  useEffect(() => {
    if (lastUpdatedId) {
      const timer = setTimeout(() => {
        setLastUpdatedId(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedId]);
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
      setLastUpdatedId(productId);
    }
  };
  
  const handleRemove = (productId: string) => {
    setRemovingItem(productId);
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingItem(null);
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[450px] p-0 overflow-hidden flex flex-col"
      >
        <SheetHeader className="p-6 border-b border-[#08a4a7]/10 bg-gradient-to-r from-[#08a4a7]/5 to-[#0bdbb6]/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-semibold flex items-center gap-2">
              <ShoppingBag size={24} className="text-[#08a4a7]" />
              <span>Your Cart</span>
              {itemCount > 0 && (
                <span className="ml-2 text-sm bg-[#08a4a7] text-white px-2 py-1 rounded-full">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#08a4a7]/10 flex items-center justify-center mb-4">
                <ShoppingBag size={30} className="text-[#08a4a7]" />
              </div>
              <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[#08a4a7] hover:bg-[#0bdbb6] text-white"
              >
                Browse Books
              </Button>
            </div>
          ) : (
            <div className="py-4 px-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 1, height: "auto" }}
                    animate={{
                      opacity: removingItem === item.product.id ? 0 : 1,
                      height: removingItem === item.product.id ? 0 : "auto",
                      scale: lastUpdatedId === item.product.id ? [1, 1.02, 1] : 1,
                      backgroundColor: lastUpdatedId === item.product.id 
                        ? ['transparent', 'rgba(8, 164, 167, 0.05)', 'transparent'] 
                        : 'transparent'
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-4 py-4 border-b border-[#08a4a7]/10 relative"
                  >
                    <div className="w-20 h-24 relative bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.coverImage}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">{item.product.title}</h3>
                          <p className="text-sm text-gray-500">{item.product.author}</p>
                          <div className="text-sm text-gray-500 mt-1">{item.product.format}</div>
                        </div>
                        <button
                          onClick={() => handleRemove(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {cartItems.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm text-gray-500 hover:text-red-500 border-gray-200"
                    onClick={clearCart}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-[#08a4a7]/10 p-6 bg-gradient-to-b from-transparent to-[#08a4a7]/5">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center">
                  Shipping
                  {shipping === 0 && (
                    <span className="ml-2 text-xs text-white bg-[#08a4a7] rounded-full px-2 py-0.5">
                      FREE
                    </span>
                  )}
                </span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="mt-6"
            >
              <Button 
                className="w-full py-6 bg-[#08a4a7] hover:bg-[#0bdbb6] text-white text-base"
                onClick={() => {
                  onOpenChange(false);
                  router.push('/checkout');
                }}
              >
                Proceed to Checkout
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </motion.div>
            
            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center">
              <Package size={14} className="mr-1" />
              Free shipping on all orders over $35
            </p>
          </div>
        )}
        
        {/* Confetti animation when adding items or proceeding to checkout */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* This would be where we'd add a confetti animation */}
            {/* For a real implementation, use libraries like react-confetti */}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet; 