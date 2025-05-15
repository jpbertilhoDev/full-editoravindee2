"use client"

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Search, 
  ShoppingCart, 
  Heart, 
  User 
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import LanguageSwitcher from './LanguageSwitcher';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const { t } = useTranslation();
  const pathname = usePathname();

  // Fechar o menu móvel quando a rota muda
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Alternar submenu
  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Verificar se submenu está aberto
  const isSubmenuOpen = (id: string) => openSubmenus.includes(id);

  // Definir os itens de navegação com segurança para evitar erros
  const navItems = [
    {
      id: 'home',
      label: t('header.home', 'Início'),
      href: '/',
    },
    {
      id: 'shop',
      label: t('header.shop', 'Loja'),
      href: '/products',
    },
    {
      id: 'categories',
      label: t('header.categories', 'Categorias'),
      href: '/categories',
      submenu: [
        { id: 'bibles', label: t('header.bibles', 'Bíblias'), href: '/products/category/bibles' },
        { id: 'books', label: t('header.books', 'Livros'), href: '/products/category/books' },
        { id: 'devotionals', label: t('header.devotionals', 'Devocionais'), href: '/products/category/devotionals' },
      ]
    },
    {
      id: 'sale',
      label: t('header.sale', 'Promoções'),
      href: '/products/sale',
    }
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Menu</h2>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fechar</span>
                </Button>
              </SheetClose>
            </div>
            
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder={t('header.search', 'Pesquisar')}
                  className="w-full rounded-md border bg-background px-9 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 overflow-auto">
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  
                  return hasSubmenu ? (
                    <Collapsible 
                      key={item.id}
                      open={isSubmenuOpen(item.id)}
                      onOpenChange={() => toggleSubmenu(item.id)}
                      className="w-full"
                    >
                      <div className="flex items-center px-4 py-2.5 hover:bg-accent">
                        <CollapsibleTrigger asChild className="flex-1">
                          <div className="flex items-center justify-between cursor-pointer">
                            <span className={`${isActive ? 'font-medium text-primary' : ''}`}>
                              {item.label}
                            </span>
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isSubmenuOpen(item.id) ? 'rotate-180' : ''
                              }`} 
                            />
                          </div>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent>
                        <div className="pl-4 space-y-1 border-l ml-4 my-1">
                          {item.submenu && item.submenu.map((subItem) => (
                            <Link 
                              key={subItem.id}
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm hover:bg-accent ${
                                pathname === subItem.href ? 'font-medium text-primary' : ''
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link 
                      key={item.id}
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 hover:bg-accent ${
                        isActive ? 'font-medium text-primary' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* User Actions */}
            <div className="p-4 border-t space-y-3">
              <Link 
                href="/account" 
                className="flex items-center px-4 py-2.5 hover:bg-accent rounded-md"
              >
                <User className="h-5 w-5 mr-3" />
                <span>{t('header.account', 'Conta')}</span>
              </Link>
              
              <Link 
                href="/wishlist" 
                className="flex items-center px-4 py-2.5 hover:bg-accent rounded-md"
              >
                <Heart className="h-5 w-5 mr-3" />
                <span>{t('header.wishlist', 'Lista de Desejos')}</span>
              </Link>
              
              <Link 
                href="/cart" 
                className="flex items-center px-4 py-2.5 hover:bg-accent rounded-md"
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                <span>{t('header.cart', 'Carrinho')}</span>
              </Link>
              
              <div className="mt-4 px-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}