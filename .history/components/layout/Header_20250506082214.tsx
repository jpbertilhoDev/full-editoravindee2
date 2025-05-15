"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, Heart, User, BookOpen } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MobileNav from './MobileNav';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { items: cartItems = [] } = useCart() || { items: [] };
  const { items: wishlistItems = [] } = useWishlist() || { items: [] };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial scroll position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Livros', href: '/products' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md' 
          : 'bg-white'
      )}
    >
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex h-20 items-center justify-between py-4">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <MobileNav navItems={navItems} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold">Vinde</span>
                <span className="text-2xl font-bold text-[#08a4a7]">Europa</span>
              </div>
            </Link>

            <nav className="hidden md:flex space-x-6 ml-8">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#08a4a7]",
                    pathname === item.href 
                      ? "text-[#08a4a7]" 
                      : "text-foreground/70"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex relative">
              <Input
                type="search"
                placeholder={t('header.search')}
                className="w-[200px] xl:w-[250px] h-9 pl-8 rounded-full bg-gray-50"
              />
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            
            <LanguageSwitcher className="border border-gray-200 hover:border-[#08a4a7] hidden md:flex" />

            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hidden md:flex"
                aria-label={t('header.wishlist')}
              >
                <Heart className="h-5 w-5" />
                {wishlistItems?.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  >
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                aria-label={t('header.cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems?.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/login" className="hidden md:block">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-[#08a4a7] text-[#08a4a7] hover:bg-[#08a4a7] hover:text-white transition-colors"
              >
                {t('header.login')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;