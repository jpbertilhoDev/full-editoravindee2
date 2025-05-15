"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, Heart, User, LogOut, Package } from 'lucide-react';
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
            ? 'bg-white/90 backdrop-blur-sm shadow-soft border-b border-brand-petrol/10' 
            : 'bg-transparent'
          : 'bg-white shadow-soft border-b border-brand-petrol/10'
      )}
    >
      {/* Accent line - only show on non-home pages or when scrolled */}
      {(!isHomePage || isScrolled) && (
        <div className="h-1 w-full bg-brand-petrol"></div>
      )}
      
      <div className="container mx-auto px-4">
        {/* Top bar - only show on non-home pages or when scrolled */}
        {(!isHomePage || isScrolled) && (
          <div className="flex h-10 items-center justify-between border-b border-brand-petrol/10 text-sm">
            <div className="hidden md:block">
              <span className={cn(
                "font-medium",
                isHomePage && !isScrolled ? "text-white" : "text-brand-petrol"
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
                    ? "text-white hover:text-brand-mint" 
                    : "text-brand-petrol hover:text-brand-mint"
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
                      ? "text-white hover:text-brand-mint" 
                      : "text-brand-petrol hover:text-brand-mint"
                  )}
                >
                  Sign In
                </Link>
              ) : (
                <Link 
                  href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className={cn(
                    "transition-colors",
                    isHomePage && !isScrolled 
                      ? "text-white hover:text-brand-mint" 
                      : "text-brand-petrol hover:text-brand-mint"
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
                    alt="Editora Vinde Europa"
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
                    alt="Editora Vinde Europa"
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

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navItems.map((item) => (
                item.submenu ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <button className={cn(
                        "flex items-center text-sm font-medium transition-colors",
                        pathname.startsWith(item.href)
                          ? "text-brand-petrol"
                          : isHomePage && !isScrolled
                            ? "text-white hover:text-brand-mint"
                            : "text-brand-dark-blue hover:text-brand-petrol"
                      )}>
                        {item.name}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white shadow-soft rounded-lg">
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link
                            href={subItem.href}
                            className="cursor-pointer hover:bg-brand-aqua/10"
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "text-brand-petrol"
                        : isHomePage && !isScrolled
                          ? "text-white hover:text-brand-mint"
                          : "text-brand-dark-blue hover:text-brand-petrol"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search bar */}
            <div className="hidden md:flex">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input 
                  type="search" 
                  placeholder="Search books..."
                  className="pl-10 h-9 w-[200px] lg:w-[250px]"
                />
              </div>
            </div>
            
            {/* Wishlist */}
            <Link href="/wishlist" className="relative hidden md:flex">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full",
                  isHomePage && !isScrolled
                    ? "text-white hover:bg-white/15"
                    : "text-brand-dark-blue hover:bg-brand-petrol/10"
                )}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-petrol text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Cart */}
            <div className="relative">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full",
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/15"
                        : "text-brand-dark-blue hover:bg-brand-petrol/10"
                    )}
                    aria-label="Cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-petrol text-[10px] font-bold text-white">
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <CartSheet />
                </SheetContent>
              </Sheet>
            </div>
            
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full",
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/15"
                        : "text-brand-dark-blue hover:bg-brand-petrol/10"
                    )}
                  >
                    <Avatar className="h-8 w-8 bg-brand-petrol text-white">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white mt-1 shadow-soft rounded-lg">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "ml-4 rounded-full",
                  isHomePage && !isScrolled
                    ? "text-white hover:bg-white/15 hover:text-white"
                    : "border-brand-petrol text-brand-petrol hover:bg-brand-petrol hover:text-white"
                )}
                asChild
              >
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;