"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, Heart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import MobileNav from './MobileNav';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import CartSheet from '@/components/cart/CartSheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isHomePage = pathname === '/';
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

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
            ? 'bg-white/90 backdrop-blur-sm shadow-md border-b border-[#08a4a7]/10' 
            : 'bg-transparent'
          : 'bg-white shadow-sm border-b border-[#08a4a7]/10'
      )}
    >
      {/* Accent line - only show on non-home pages or when scrolled */}
      {(!isHomePage || isScrolled) && (
        <div className="h-1 w-full bg-[#08a4a7]"></div>
      )}
      
      <div className="container mx-auto px-4">
        {/* Top bar - only show on non-home pages or when scrolled */}
        {(!isHomePage || isScrolled) && (
          <div className="flex h-10 items-center justify-between border-b border-[#08a4a7]/10 text-sm">
            <div className="hidden md:block">
              <span className={cn(
                "font-medium",
                isHomePage && !isScrolled ? "text-white" : "text-[#08a4a7]"
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
                    ? "text-white hover:text-[#4dfed1]" 
                    : "text-[#08a4a7] hover:text-[#0bdbb6]"
                )}
              >
                Help
              </Link>
              {!user ? (
                <Link 
                  href="/auth/login" 
                  className={cn(
                    "transition-colors",
                    isHomePage && !isScrolled 
                      ? "text-white hover:text-[#4dfed1]" 
                      : "text-[#08a4a7] hover:text-[#0bdbb6]"
                  )}
                >
                  Sign In
                </Link>
              ) : (
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "transition-colors",
                    isHomePage && !isScrolled 
                      ? "text-white hover:text-[#4dfed1]" 
                      : "text-[#08a4a7] hover:text-[#0bdbb6]"
                  )}
                >
                  My Account
                </Link>
              )}
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
                      : "text-[#08a4a7] hover:bg-[#08a4a7]/10"
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
              {isHomePage && !isScrolled ? (
                <div className="w-[120px] h-[50px] relative my-auto">
                  <Image 
                    src="/images/logo-vindee.svg" 
                    alt="Vindee"
                    fill
                    className="object-contain filter brightness-0 invert"
                    priority
                  />
                </div>
              ) : (
                <div className="w-[120px] h-[50px] relative my-auto">
                  <Image 
                    src="/images/logo-vindee.svg" 
                    alt="Vindee"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.slice(0, 5).map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative group",
                    pathname === item.href 
                      ? isHomePage && !isScrolled ? "text-white" : "text-[#08a4a7]"
                      : isHomePage && !isScrolled ? "text-white/80" : "text-[#08a4a7]/70",
                    isHomePage && !isScrolled ? "hover:text-[#4dfed1]" : "hover:text-[#0bdbb6]"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                    isHomePage && !isScrolled ? "bg-[#4dfed1]" : "bg-[#0bdbb6]",
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
                  "pr-10 border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6] rounded-md",
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
                  isHomePage && !isScrolled ? "text-white" : "text-[#08a4a7]"
                )}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </form>

            <div className="hidden md:flex items-center space-x-1">
              <Link href="/wishlist">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "relative rounded-md",
                    isHomePage && !isScrolled 
                      ? "text-white hover:bg-white/10" 
                      : "text-[#08a4a7] hover:bg-[#08a4a7]/10"
                  )}
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-md",
                        isHomePage && !isScrolled
                          ? "text-white hover:bg-white/10"
                          : "text-[#08a4a7] hover:bg-[#08a4a7]/10"
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        {user.photoURL ? (
                          <AvatarImage src={user.photoURL} alt={user.displayName || ''} />
                        ) : (
                          <AvatarFallback className="bg-[#08a4a7] text-white">
                            {user.displayName?.split(' ').map(n => n[0]).join('') || user.email?.[0].toUpperCase() || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/orders">
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        <span>Meus Pedidos</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/wishlist">
                      <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Lista de Desejos</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 focus:text-red-700 cursor-pointer" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-md",
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/10"
                        : "text-[#08a4a7] hover:bg-[#08a4a7]/10"
                    )}
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </Link>
              )}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "relative rounded-md",
                isHomePage && !isScrolled 
                  ? "text-white hover:bg-white/10" 
                  : "text-[#08a4a7] hover:bg-[#08a4a7]/10"
              )}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0bdbb6] text-xs text-white">
                  {cartItemsCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
            
            {/* Cart Sheet */}
            <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;