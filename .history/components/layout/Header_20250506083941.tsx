"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, Heart, User, LogOut, Package, Globe } from 'lucide-react';
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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isHomePage = pathname === '/';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is admin
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkUserRole();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { 
      name: 'Books', 
      href: '/products',
      submenu: [
        { name: 'Bible', href: '/products/category/bible' },
        { name: 'Devotionals', href: '/products/category/devotionals' },
        { name: 'Children', href: '/products/category/children' }
      ]
    },
    { name: 'Blog', href: '/blog' },
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
                {t('header.shipping_banner')}
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
                {t('header.help')}
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
                  {t('header.login')}
                </Link>
              ) : (
                <Link 
                  href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className={cn(
                    "transition-colors",
                    isHomePage && !isScrolled 
                      ? "text-white hover:text-[#4dfed1]" 
                      : "text-[#08a4a7] hover:text-[#0bdbb6]"
                  )}
                >
                  {t('header.account')}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Main header */}
        <div className="flex h-20 items-center justify-between py-4">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 md:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="px-0">
                <MobileNav navItems={navItems} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center mr-8">
              {isHomePage && !isScrolled ? (
                <div className="w-[120px] h-[50px] relative my-auto">
                  <Image 
                    src="/images/logo-vindee.svg" 
                    alt="Grace Bookstore"
                    fill
                    className="object-contain filter brightness-0 invert"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/fallback-logo.png';
                    }}
                  />
                </div>
              ) : (
                <div className="w-[120px] h-[50px] relative my-auto">
                  <Image 
                    src="/images/logo-vindee.svg" 
                    alt="Grace Bookstore"
                    fill
                    className="object-contain"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/fallback-logo.png';
                    }}
                  />
                </div>
              )}
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                item.submenu ? (
                  <div key={item.name} className="relative group">
                    <Link 
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors flex items-center gap-1",
                        pathname === item.href 
                          ? isHomePage && !isScrolled ? "text-white" : "text-[#08a4a7]"
                          : isHomePage && !isScrolled ? "text-white/80" : "text-[#08a4a7]/70",
                        isHomePage && !isScrolled ? "hover:text-[#4dfed1]" : "hover:text-[#0bdbb6]"
                      )}
                    >
                      {t(`header.${item.name.toLowerCase()}`)}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="transition-transform duration-200 group-hover:rotate-180"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                        isHomePage && !isScrolled ? "bg-[#4dfed1]" : "bg-[#0bdbb6]",
                        pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                      )}></span>
                    </Link>
                    
                    {/* Submenu dropdown with modern and minimalist design */}
                    <div className="absolute left-0 top-full mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                      <div className="p-2 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "block px-4 py-2 text-sm rounded-md transition-colors",
                              pathname === subItem.href 
                                ? "bg-[#08a4a7]/10 text-[#08a4a7] font-medium" 
                                : "text-gray-700 hover:bg-[#08a4a7]/5 hover:text-[#08a4a7]"
                            )}
                          >
                            {t(`products.${subItem.name.toLowerCase()}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
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
                    {t(`header.${item.name.toLowerCase()}`)}
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                      isHomePage && !isScrolled ? "bg-[#4dfed1]" : "bg-[#0bdbb6]",
                      pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                    )}></span>
                  </Link>
                )
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <form className="hidden md:flex relative w-full max-w-sm items-center">
              <Input
                type="search"
                placeholder={t('header.search')}
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
              {/* Language Switcher */}
              <LanguageSwitcher 
                className={cn(
                  isHomePage && !isScrolled 
                    ? "text-white hover:bg-white/10" 
                    : "text-[#08a4a7] hover:bg-[#08a4a7]/10"
                )}
              />

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
                    <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>{isAdmin ? "Dashboard Admin" : "Dashboard"}</span>
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

            {/* Mobile Language Switcher */}
            <LanguageSwitcher 
              className={cn(
                "md:hidden",
                isHomePage && !isScrolled 
                  ? "text-white hover:bg-white/10" 
                  : "text-[#08a4a7] hover:bg-[#08a4a7]/10"
              )}
            />

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