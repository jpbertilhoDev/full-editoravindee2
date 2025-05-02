"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, Heart, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MobileNav from './MobileNav';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Books', href: '/products' },
    { name: 'Bibles', href: '/products/category/bibles' },
    { name: 'Devotionals', href: '/products/category/devotionals' },
    { name: 'Children', href: '/products/category/children' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled 
          ? 'bg-[#e9ffff] backdrop-blur-sm shadow-md border-b border-[#08a4a7]/10' 
          : 'bg-[#e9ffff]'
      )}
    >
      {/* Simple accent line */}
      <div className="h-1 w-full bg-[#08a4a7]"></div>
      
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-10 items-center justify-between border-b border-[#08a4a7]/10 text-sm">
          <div className="hidden md:block">
            <span className="text-[#08a4a7] font-medium">Free shipping on orders over $35</span>
          </div>
          <div className="flex gap-4">
            <Link href="/help" className="text-[#08a4a7] hover:text-[#0bdbb6] transition-colors">Help</Link>
            <Link href="/account/login" className="text-[#08a4a7] hover:text-[#0bdbb6] transition-colors">Sign In</Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex h-20 items-center justify-between py-4">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-[#08a4a7] hover:text-[#0bdbb6]">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-[#e9ffff]">
                <MobileNav navItems={navItems} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center mr-8">
              <div className="bg-[#08a4a7] p-2 rounded-md">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <span className="font-playfair text-2xl font-bold tracking-tight ml-2 text-[#08a4a7]">
                Grace
              </span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.slice(0, 5).map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#0bdbb6] relative group",
                    pathname === item.href 
                      ? "text-[#08a4a7]" 
                      : "text-[#08a4a7]/70"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-[#0bdbb6] transition-all duration-300",
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )}></span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <form className="hidden md:flex relative w-full max-w-sm items-center">
              <Input
                type="search"
                placeholder="Search books..."
                className="pr-10 border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6] bg-white rounded-md"
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 text-[#08a4a7]">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </form>

            <div className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="text-[#08a4a7] hover:bg-[#08a4a7]/10 rounded-md">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>

              <Button variant="ghost" size="icon" className="text-[#08a4a7] hover:bg-[#08a4a7]/10 rounded-md">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </div>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-[#08a4a7] hover:bg-[#08a4a7]/10 rounded-md">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0bdbb6] text-xs text-white">
                    {cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;