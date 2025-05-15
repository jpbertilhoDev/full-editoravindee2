"use client";

import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Package, ShoppingCart, FileText, Users, Settings, 
  BarChart, LogOut, Store, ArrowLeft, AlertTriangle, BookOpen
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Prefetch common navigation paths for faster transitions
  useEffect(() => {
    router.prefetch('/admin/dashboard');
    router.prefetch('/admin/products');
    router.prefetch('/admin/orders');
    router.prefetch('/admin/blog');
    router.prefetch('/dashboard'); // For non-admin redirect
    router.prefetch('/'); // For logout
  }, [router]);

  // Verificar se o usuário é administrador - otimizado com useCallback
  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        setIsAdmin(true);
      } else {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar a área administrativa.",
          variant: "destructive",
        });
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Erro ao verificar status de administrador:", error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar suas permissões.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, router, toast]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", active: pathname === '/admin/dashboard' || pathname === '/admin' },
    { label: "Produtos", icon: Package, href: "/admin/products", active: pathname?.startsWith('/admin/products') },
    { label: "Pedidos", icon: ShoppingCart, href: "/admin/orders", active: pathname?.startsWith('/admin/orders') },
    { label: "Blog", icon: FileText, href: "/admin/blog", active: pathname?.startsWith('/admin/blog') },
    { label: "Usuários", icon: Users, href: "/admin/users", active: pathname?.startsWith('/admin/users') },
    { label: "Relatórios", icon: BarChart, href: "/admin/reports", active: pathname?.startsWith('/admin/reports') },
    { label: "Configurações", icon: Settings, href: "/admin/settings", active: pathname?.startsWith('/admin/settings') },
  ];
  
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Mostrar tela de carregamento durante a verificação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-[#08a4a7] border-t-transparent rounded-full"></div>
          <p className="text-sm text-gray-500">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se não for administrador
  if (!isAdmin && !isLoading) {
    // O redirecionamento foi movido para o useCallback para evitar renderização desnecessária
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar fixa para desktop */}
        <div className="hidden md:flex flex-col w-64 bg-white shadow-md border-r">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-6 w-6 text-[#08a4a7]" />
              <h1 className="text-xl font-bold text-[#08a4a7]">Admin Panel</h1>
            </div>
          </div>
          
          <div className="flex flex-col justify-between flex-1 overflow-y-auto">
            <div className="px-3 py-4 space-y-1">
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
              
              <div className="pt-2 mt-2">
                <Link href="/">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Store className="h-4 w-4 mr-2 text-gray-500" />
                    Ver Loja
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="p-3 border-t">
              <div className="flex items-center gap-3 mb-3 p-2">
                <Avatar className="h-9 w-9 bg-[#08a4a7]">
                  {user?.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName || ''} />
                  ) : (
                    <AvatarFallback className="bg-[#08a4a7] text-white">
                      {user?.displayName?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase() || 'A'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.displayName || 'Administrador'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="destructive" 
                className="w-full justify-center" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header topo */}
          <header className="bg-white shadow-sm border-b h-14 md:h-16 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              {/* Menu para mobile */}
              <div className="md:hidden flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-[#08a4a7]"
                  onClick={() => router.push('/')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
              
              <div className="md:hidden flex items-center">
                <BookOpen className="h-5 w-5 text-[#08a4a7]" />
                <h1 className="text-lg font-semibold ml-2 text-[#08a4a7]">Admin</h1>
              </div>
              
              {/* Perfil no header para mobile */}
              <div className="md:hidden flex items-center gap-2">
                <LanguageSwitcher variant="minimal" />
                <Avatar className="h-8 w-8 bg-[#08a4a7]">
                  {user?.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName || ''} />
                  ) : (
                    <AvatarFallback className="bg-[#08a4a7] text-white">
                      {user?.displayName?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase() || 'A'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              
              {/* Para desktop, mostrar o caminho atual */}
              <div className="hidden md:flex items-center gap-2">
                <h1 className="text-lg font-semibold">
                  {navItems.find(item => item.active)?.label || 'Painel Administrativo'}
                </h1>
              </div>
              
              {/* Ações gerais para desktop */}
              <div className="hidden md:flex items-center gap-2">
                <LanguageSwitcher />
                <Button variant="outline" size="sm" onClick={() => router.push('/')}>
                  <Store className="h-4 w-4 mr-2" />
                  Ver Loja
                </Button>
              </div>
            </div>
          </header>
          
          {/* Conteúdo da página */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {children}
          </main>
          
          {/* Menu mobile na parte inferior */}
          <div className="md:hidden flex justify-between items-center bg-white border-t p-2">
            {navItems.slice(0, 5).map((item, index) => (
              <Link href={item.href} key={index}>
                <Button 
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center justify-center p-1 h-auto ${
                    item.active ? "text-[#08a4a7]" : "text-gray-500"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] mt-1">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 