"use client";

import React, { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  TrendingUp, Package, Heart, User, Settings, 
  CreditCard, LogOut, ChevronRight, ArrowLeft
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Em uma aplicação real, você verificaria a autenticação do usuário aqui
  // e redirecionaria para a página de login se não estiver autenticado
  
  const navItems = [
    { name: 'Visão Geral', path: '/dashboard', icon: TrendingUp },
    { name: 'Meus Pedidos', path: '/dashboard/orders', icon: Package },
    { name: 'Lista de Desejos', path: '/dashboard/wishlist', icon: Heart },
    { name: 'Perfil', path: '/dashboard/profile', icon: User },
    { name: 'Pagamentos', path: '/dashboard/payments', icon: CreditCard },
    { name: 'Configurações', path: '/dashboard/settings', icon: Settings },
  ];
  
  const isActive = (path: string) => {
    return pathname === path || 
      (path !== '/dashboard' && pathname?.startsWith(path));
  };
  
  const handleLogout = () => {
    // Em uma aplicação real, você implementaria a lógica de logout aqui
    router.push('/auth/login');
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium">Área do Cliente</h1>
          </div>
          
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
                <AvatarFallback className="bg-[#08a4a7] text-white">JS</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline-block">João Silva</span>
            </div>
          </Link>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar para dispositivos grandes */}
          <div className="hidden lg:block">
            <div className="space-y-6 sticky top-[88px]">
              {/* Navegação */}
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Menu</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link key={item.name} href={item.path}>
                        <Button 
                          variant={isActive(item.path) ? "default" : "ghost"}
                          className={`w-full justify-start ${isActive(item.path) ? "bg-[#08a4a7] hover:bg-[#08a4a7]" : ""}`}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </nav>
                </CardContent>
              </Card>
              
              {/* Links de ajuda */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-3">Precisa de ajuda?</h3>
                  <div className="space-y-2">
                    <Link 
                      href="/help" 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Central de Ajuda
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                    <Link 
                      href="/contact" 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Fale Conosco
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Conteúdo principal */}
          <div className="lg:col-span-3">
            {children}
            
            {/* Navegação móvel (rodapé) para dispositivos pequenos */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
              <div className="grid grid-cols-5 h-16">
                {navItems.slice(0, 5).map((item) => (
                  <Link key={item.name} href={item.path}>
                    <Button 
                      variant="ghost" 
                      className={`h-full w-full flex flex-col rounded-none justify-center items-center space-y-1 ${
                        isActive(item.path) ? "text-[#08a4a7] bg-[#08a4a7]/5" : ""
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-[10px]">{item.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Espaçamento para dispositivos móveis para evitar que o conteúdo fique atrás da navegação */}
            <div className="h-20 lg:hidden" />
          </div>
        </div>
      </div>
    </div>
  );
} 