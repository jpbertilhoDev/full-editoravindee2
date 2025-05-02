"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItemProps {
  name: string;
  href: string;
}

interface MobileNavProps {
  navItems: NavItemProps[];
}

const MobileNav = ({ navItems }: MobileNavProps) => {
  const pathname = usePathname();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const categories = [
    {
      name: 'Books',
      subcategories: [
        { name: 'Fiction', href: '/products/category/fiction' },
        { name: 'Non-Fiction', href: '/products/category/non-fiction' },
        { name: 'Bestsellers', href: '/products/category/bestsellers' },
        { name: 'New Releases', href: '/products/category/new-releases' },
      ],
    },
    {
      name: 'Bibles',
      subcategories: [
        { name: 'Study Bibles', href: '/products/category/study-bibles' },
        { name: 'Children\'s Bibles', href: '/products/category/childrens-bibles' },
        { name: 'Devotional Bibles', href: '/products/category/devotional-bibles' },
        { name: 'Reference Bibles', href: '/products/category/reference-bibles' },
      ],
    },
  ];

  const toggleCategory = (name: string) => {
    if (openCategory === name) {
      setOpenCategory(null);
    } else {
      setOpenCategory(name);
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
          const isCategory = categories.some(cat => cat.name === item.name);
          const currentCategory = categories.find(cat => cat.name === item.name);
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <div key={item.name}>
              {isCategory ? (
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
                  
                  {openCategory === item.name && currentCategory && (
                    <div className="ml-6 space-y-1.5 border-l pl-3 mt-1">
                      {currentCategory.subcategories.map((subcat) => (
                        <Link 
                          key={subcat.name} 
                          href={subcat.href}
                          className={cn(
                            "block w-full py-2 px-4 text-sm rounded-md hover:bg-accent",
                            pathname === subcat.href && "bg-accent text-accent-foreground font-medium"
                          )}
                        >
                          {subcat.name}
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

      <div className="mt-auto space-y-2">
        <Button className="w-full" variant="outline" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button className="w-full" asChild>
          <Link href="/auth/register">Create Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default MobileNav;