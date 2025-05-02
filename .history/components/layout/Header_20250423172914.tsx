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
  const isHomePage = pathname === '/';

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
        isHomePage 
          ? isScrolled 
            ? 'bg-white/90 backdrop-blur-sm shadow-md border-b border-[#00AFEF]/10' 
            : 'bg-transparent'
          : 'bg-white shadow-sm border-b border-[#00AFEF]/10'
      )}
    >
      {/* Accent line - only show on non-home pages or when scrolled */}
      {(!isHomePage || isScrolled) && (
        <div className="h-1 w-full bg-[#00AFEF]"></div>
      )}
      
      <div className="container mx-auto px-4">
        {/* Top bar - only show on non-home pages or when scrolled */}
        {(!isHomePage || isScrolled) && (
          <div className="flex h-10 items-center justify-between border-b border-[#00AFEF]/10 text-sm">
            <div className="hidden md:block">
              <span className={cn(
                "font-medium",
                isHomePage && !isScrolled ? "text-white" : "text-[#00AFEF]"
              )}>
                Free shipping on orders over $35
              </span>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/help" 
                className={cn(
                  "transition-colors",
                  isHomePage && !isScrolled 
                    ? "text-white hover:text-[#00AFEF]" 
                    : "text-[#00AFEF] hover:text-[#00AFEF]/80"
                )}
              >
                Help
              </Link>
              <Link 
                href="/account/login" 
                className={cn(
                  "transition-colors",
                  isHomePage && !isScrolled 
                    ? "text-white hover:text-[#00AFEF]" 
                    : "text-[#00AFEF] hover:text-[#00AFEF]/80"
                )}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Main header */}
        <div className="flex h-20 items-center justify-between py-4">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    isHomePage && !isScrolled 
                      ? "text-white hover:bg-white/10" 
                      : "text-[#00AFEF] hover:bg-[#00AFEF]/10"
                  )}
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-white">
                <MobileNav navItems={navItems} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center mr-8">
              <div className={cn(
                "p-2 rounded-md",
                isHomePage && !isScrolled ? "bg-white/20 backdrop-blur-sm" : "bg-[#00AFEF]"
              )}>
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <span className={cn(
                "font-playfair text-2xl font-bold tracking-tight ml-2",
                isHomePage && !isScrolled ? "text-white" : "text-[#00AFEF]"
              )}>
                Grace
              </span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.slice(0, 5).map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative group",
                    pathname === item.href 
                      ? isHomePage && !isScrolled ? "text-white" : "text-[#00AFEF]"
                      : isHomePage && !isScrolled ? "text-white/80" : "text-[#00AFEF]/70",
                    isHomePage && !isScrolled ? "hover:text-[#00AFEF]" : "hover:text-[#00AFEF]/80"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                    isHomePage && !isScrolled ? "bg-[#00AFEF]" : "bg-[#00AFEF]",
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
                className={cn(
                  "pr-10 border-[#00AFEF]/20 focus-visible:ring-[#00AFEF] rounded-md",
                  isHomePage && !isScrolled 
                    ? "bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm border-white/20" 
                    : "bg-white"
                )}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "absolute right-0",
                  isHomePage && !isScrolled ? "text-white" : "text-[#00AFEF]"
                )}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </form>

            <div className="hidden md:flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-md",
                  isHomePage && !isScrolled 
                    ? "text-white hover:bg-white/10" 
                    : "text-[#00AFEF] hover:bg-[#00AFEF]/10"
                )}
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-md",
                  isHomePage && !isScrolled 
                    ? "text-white hover:bg-white/10" 
                    : "text-[#00AFEF] hover:bg-[#00AFEF]/10"
                )}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </div>

            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "relative rounded-md",
                  isHomePage && !isScrolled 
                    ? "text-white hover:bg-white/10" 
                    : "text-[#00AFEF] hover:bg-[#00AFEF]/10"
                )}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#00AFEF] text-xs text-white">
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