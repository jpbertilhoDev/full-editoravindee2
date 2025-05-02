"use client"

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Plus, Minus, ArrowRight, ShoppingCart, RefreshCw } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  
  const hasItems = cartItems.length > 0;
  const shippingCost = 5.99;
  const taxRate = 0.07; // 7%
  const tax = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingCost + tax;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6">
          <ol className="flex flex-wrap items-center space-x-2">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="font-medium text-foreground">Shopping Cart</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-playfair font-bold mb-8">Your Shopping Cart</h1>

        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b">
                  <div className="col-span-6 font-medium">Product</div>
                  <div className="col-span-2 font-medium text-center">Price</div>
                  <div className="col-span-2 font-medium text-center">Quantity</div>
                  <div className="col-span-2 font-medium text-right">Total</div>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center">
                      {/* Product */}
                      <div className="col-span-6 flex items-center space-x-4">
                        <div className="flex-shrink-0 relative h-20 w-16 rounded overflow-hidden">
                          <img 
                            src={item.product.coverImage} 
                            alt={item.product.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <Link 
                            href={`/products/${item.product.slug}`}
                            className="font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.product.format}
                          </p>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="flex items-center text-sm text-red-500 hover:text-red-700 mt-2 md:hidden"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center my-2 md:my-0">
                        <div className="md:hidden text-sm text-muted-foreground">Price:</div>
                        <div>${item.product.price.toFixed(2)}</div>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex items-center justify-center my-2 md:my-0">
                        <div className="md:hidden text-sm text-muted-foreground mr-2">Quantity:</div>
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                            className="w-10 text-center border-0 bg-transparent p-0 focus:ring-0"
                          />
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 text-right flex justify-between md:justify-end items-center">
                        <div className="md:hidden text-sm text-muted-foreground">Total:</div>
                        <div className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-4 text-muted-foreground hover:text-red-500 hidden md:block"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="flex items-center" onClick={clearCart}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/products" className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b">
                  <h2 className="font-semibold text-lg">Order Summary</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <Input placeholder="Discount code" />
                    <Button className="w-full" variant="outline">Apply</Button>
                    <Button className="w-full" asChild>
                      <Link href="/checkout">Checkout</Link>
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-4">
                    <p>Shipping costs calculated at checkout.</p>
                    <p className="mt-1">
                      By proceeding to checkout, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms and Conditions</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 inline-flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet. Browse our collection to find something you'll love.
            </p>
            <Button asChild>
              <Link href="/products" className="flex items-center justify-center">
                Browse Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}