"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, Package, Heart, CreditCard, Settings, LogOut, Menu, X, Bell, 
  ShoppingBag, ChevronDown, Search, Book, Home 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Fechar a sidebar em dispositivos móveis quando a rota mudar
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      title: "Meu Dashboard",
      href: "/dashboard",
      icon: <Home size={20} />
    },
    {
      title: "Meus Pedidos",
      href: "/dashboard/orders",
      icon: <Package size={20} />
    },
    {
      title: "Lista de Desejos",
      href: "/dashboard/wishlist",
      icon: <Heart size={20} />
    },
    {
      title: "Métodos de Pagamento",
      href: "/dashboard/payment-methods",
      icon: <CreditCard size={20} />
    },
    {
      title: "Minhas Avaliações",
      href: "/dashboard/reviews",
      icon: <Book size={20} />
    },
    {
      title: "Configurações",
      href: "/dashboard/settings",
      icon: <Settings size={20} />
    },
  ];

  const userMenuItems = [
    {
      title: "Meu Perfil",
      href: "/dashboard/profile",
      icon: <User size={16} />
    },
    {
      title: "Meus Pedidos",
      href: "/dashboard/orders",
      icon: <Package size={16} />
    },
    {
      title: "Ajuda",
      href: "/help",
      icon: <Search size={16} />
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            {/* Mobile menu trigger */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild className="mr-2 md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b flex items-center justify-between">
                    <Link href="/">
                      <h1 className="text-xl font-bold text-[#08a4a7]">GRACE</h1>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                      <X size={18} />
                    </Button>
                  </div>
                  <div className="px-3 py-4">
                    <div className="mb-6 px-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={20} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">João Silva</p>
                          <p className="text-xs text-gray-500">joao.silva@email.com</p>
                        </div>
                      </div>
                    </div>
                    <nav className="space-y-1">
                      {navItems.map((item) => (
                        <Link 
                          key={item.href}
                          href={item.href}
                          className={`flex items-center px-3 py-2.5 text-sm rounded-lg ${
                            pathname === item.href
                              ? "bg-[#08a4a7]/10 text-[#08a4a7] font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="mt-auto p-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut size={18} className="mr-2" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-[#08a4a7] md:mr-10">GRACE</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <Link 
                href="/"
                className="px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                Loja
              </Link>
              <Link 
                href="/products"
                className="px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                Produtos
              </Link>
              <Link 
                href="/categories"
                className="px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                Categorias
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" aria-label="Pesquisar">
              <Search size={20} />
            </Button>
            
            <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
            </Button>
            
            <Button variant="ghost" size="icon" aria-label="Carrinho" asChild>
              <Link href="/cart" className="relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#08a4a7] text-white text-xs flex items-center justify-center">
                  3
                </span>
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium">João Silva</p>
                    <p className="text-xs text-gray-500 font-normal">joao.silva@email.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 cursor-pointer">
                  <LogOut size={16} className="mr-2" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 h-[calc(100vh-4rem)] bg-white border-r sticky top-16 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium">João Silva</p>
                <p className="text-xs text-gray-500">joao.silva@email.com</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm rounded-lg ${
                    pathname === item.href
                      ? "bg-[#08a4a7]/10 text-[#08a4a7] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut size={18} className="mr-2" />
              Sair
            </Button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 py-8 px-4 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
} 