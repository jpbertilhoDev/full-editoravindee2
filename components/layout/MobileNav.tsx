"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, User, Package, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';

interface NavSubItemProps {
  name: string;
  href: string;
}

interface NavItemProps {
  name: string;
  href: string;
  submenu?: NavSubItemProps[];
}

interface MobileNavProps {
  navItems: NavItemProps[];
}

const MobileNav = ({ navItems }: MobileNavProps) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleCategory = (name: string) => {
    if (openCategory === name) {
      setOpenCategory(null);
    } else {
      setOpenCategory(name);
    }
  };

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

  return (
    <div className="flex flex-col h-full py-6">
      <div className="mb-6">
        <form className="relative w-full items-center">
          <input
            type="search"
            placeholder="Search books..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" variant="ghost" size="sm" className="absolute right-0 top-0 h-full">
            <span className="sr-only">Search</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </Button>
        </form>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <div key={item.name}>
              {hasSubmenu ? (
                <div className="space-y-1.5">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between px-4",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => toggleCategory(item.name)}
                  >
                    {item.name}
                    {openCategory === item.name ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {openCategory === item.name && item.submenu && (
                    <div className="ml-6 space-y-1.5 border-l-2 border-[#08a4a7]/20 pl-3 mt-1">
                      {item.submenu.map((subItem) => (
                        <Link 
                          key={subItem.name} 
                          href={subItem.href}
                          className={cn(
                            "block w-full py-2 px-4 text-sm rounded-md transition-colors",
                            pathname === subItem.href 
                              ? "bg-[#08a4a7]/10 text-[#08a4a7] font-medium" 
                              : "text-gray-700 hover:bg-[#08a4a7]/5 hover:text-[#08a4a7]"
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center py-2 px-4 text-sm rounded-md hover:bg-accent",
                    pathname === item.href && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {user ? (
        <div className="mt-auto space-y-2">
          <div className="px-4 py-2 mb-2">
            <h3 className="font-medium text-sm">Minha Conta</h3>
            <Separator className="my-2" />
            <nav className="space-y-1">
              <Link
                href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className="flex items-center py-2 text-sm text-gray-700 hover:text-[#08a4a7]"
              >
                <User className="mr-2 h-4 w-4" />
                <span>{isAdmin ? "Dashboard Admin" : "Dashboard"}</span>
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center py-2 text-sm text-gray-700 hover:text-[#08a4a7]"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Meus Pedidos</span>
              </Link>
              <Link
                href="/dashboard/wishlist"
                className="flex items-center py-2 text-sm text-gray-700 hover:text-[#08a4a7]"
              >
                <Heart className="mr-2 h-4 w-4" />
                <span>Lista de Desejos</span>
              </Link>
            </nav>
            <Separator className="my-2" />
            <Button
              variant="ghost" 
              className="w-full justify-start px-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-auto space-y-2">
          <Button className="w-full" variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button className="w-full" asChild>
            <Link href="/auth/register">Create Account</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileNav;