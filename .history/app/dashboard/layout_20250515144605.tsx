"use client";

import React, { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  TrendingUp, Package, Heart, User, Settings, 
  CreditCard, LogOut, ChevronRight, ArrowLeft, FileText
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Nota para SEO: Este é um layout client-side, portanto não pode definir metadados diretamente.
// Para SEO adequado, é recomendado criar um arquivo metadata.js no diretório app/dashboard/ 
// e definir os metadados estáticos lá para melhorar a indexação e descoberta.

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  const navItems = [
    { label: "Visão Geral", icon: TrendingUp, href: "/dashboard", active: pathname === '/dashboard' },
    { label: "Pedidos", icon: Package, href: "/dashboard/orders", active: pathname === '/dashboard/orders' },
    { label: "Lista de Desejos", icon: Heart, href: "/dashboard/wishlist", active: pathname === '/dashboard/wishlist' },
    { label: "Perfil", icon: User, href: "/dashboard/profile", active: pathname === '/dashboard/profile' },
    { label: "Blog", icon: FileText, href: "/dashboard/blog", active: pathname.startsWith('/dashboard/blog') },
    { label: "Pagamentos", icon: CreditCard, href: "/dashboard/payments", active: pathname === '/dashboard/payments' },
    { label: "Configurações", icon: Settings, href: "/dashboard/settings", active: pathname === '/dashboard/settings' },
  ];
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Componente de navegação para dispositivos menores
  const MobileNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center py-2">
        {navItems.slice(0, 4).map((item, index) => (
          <Link href={item.href} key={index}>
            <Button 
              variant={item.active ? "default" : "ghost"}
              className={`flex flex-col items-center justify-center py-1.5 h-auto ${
                item.active 
                  ? "bg-[#08a4a7] text-white" 
                  : "hover:bg-transparent hover:text-[#08a4a7]"
              }`}
              size="sm"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen pb-16 lg:pb-0">
        <div className="container px-4 py-6 max-w-7xl mx-auto">
          {/* Botão de voltar para dispositivos móveis */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-[#08a4a7]"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a loja
            </Button>
          </div>
          
          {/* Header com nome de usuário para dispositivos móveis */}
          <div className="lg:hidden mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.displayName?.split(' ')[0] || 'Cliente'}</h1>
                <p className="text-gray-500 text-sm">Bem-vindo ao seu painel de controle</p>
              </div>
              <LanguageSwitcher variant="minimal" />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar para desktop */}
            <div className="hidden lg:flex flex-col gap-6 w-64">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] text-white pb-2">
                  <CardTitle className="text-lg">Minha Conta</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center pt-2 pb-4">
                    <Avatar className="h-16 w-16 mb-4 bg-[#08a4a7]/10 border-2 border-[#08a4a7]">
                      {user?.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName || ''} />
                      ) : (
                        <AvatarFallback className="bg-[#08a4a7] text-white text-lg">
                          {user?.displayName?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase() || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="font-semibold text-lg">{user?.displayName || 'Usuário'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    {navItems.map((item, index) => (
                      <Link href={item.href} key={index}>
                        <Button 
                          variant={item.active ? "default" : "ghost"}
                          className={`w-full justify-start rounded-md py-2 h-10 ${
                            item.active 
                              ? "bg-[#08a4a7] text-white" 
                              : "hover:bg-[#08a4a7]/5 hover:text-[#08a4a7]"
                          }`}
                        >
                          <item.icon className={`h-4 w-4 mr-2 ${!item.active && "text-gray-500"}`} />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-2 border-t">
                    <LanguageSwitcher variant="minimal" className="mr-2" />
                    <Button 
                      variant="destructive" 
                      className="flex-1 justify-center" 
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Conteúdo principal */}
            <div className="flex-1 min-w-0 pb-16 lg:pb-0">
              {children}
            </div>
          </div>
        </div>
        
        {/* Navegação mobile */}
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
} 