"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, ShoppingBag, Heart, User, Clock, ChevronRight, 
  TrendingUp, Bell, BookOpen, Gift, CalendarClock, CreditCard,
  LayoutDashboard, Settings, LogOut, Home, BookMarked, BarChart3,
  Sparkles, MoreHorizontal, ShoppingCart
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dados simulados para o dashboard
  const userData = {
    name: "João Silva",
    email: "joao.silva@email.com",
    avatarUrl: "/avatar-placeholder.png",
    joinDate: "Abril 2022",
    orders: [
      { id: "ORD-3842", date: "25/04/2023", status: "entregue", items: 3, total: 127.50 },
      { id: "ORD-2719", date: "14/03/2023", status: "entregue", items: 2, total: 85.90 },
      { id: "ORD-1932", date: "02/02/2023", status: "entregue", items: 1, total: 45.00 },
    ],
    recentlyViewed: [
      { id: 1, title: "O Poder do Hábito", author: "Charles Duhigg", coverUrl: "/images/products/product-1.jpg", price: 49.90 },
      { id: 2, title: "Mindset: A Nova Psicologia do Sucesso", author: "Carol S. Dweck", coverUrl: "/images/products/product-2.jpg", price: 54.90 },
      { id: 3, title: "Essencialismo", author: "Greg McKeown", coverUrl: "/images/products/product-3.jpg", price: 39.90 },
    ],
    recommendations: [
      { id: 4, title: "Comece Pelo Porquê", author: "Simon Sinek", coverUrl: "/images/products/product-4.jpg", price: 45.90 },
      { id: 5, title: "Tudo é Óbvio", author: "Duncan J. Watts", coverUrl: "/images/products/product-5.jpg", price: 38.50 },
      { id: 6, title: "Rápido e Devagar", author: "Daniel Kahneman", coverUrl: "/images/products/product-6.jpg", price: 59.90 },
    ],
    wishlist: [
      { id: 7, title: "Pense de Novo", author: "Adam Grant", coverUrl: "/images/products/product-7.jpg", price: 42.90 },
      { id: 8, title: "Inevitável", author: "Kevin Kelly", coverUrl: "/images/products/product-8.jpg", price: 47.90 },
    ],
    notifications: [
      { id: 1, type: "delivery", message: "Seu pedido ORD-3842 foi entregue", time: "2 dias atrás" },
      { id: 2, type: "discount", message: "15% de desconto em livros de Psicologia", time: "5 dias atrás" },
      { id: 3, type: "restock", message: "Um item da sua lista de desejos está disponível", time: "1 semana atrás" },
    ]
  };

  // Estatísticas de uso
  const stats = [
    { title: "Pedidos", value: userData.orders.length, icon: ShoppingBag, color: "from-[#08a4a7] to-[#0bdbb6]" },
    { title: "Favoritos", value: userData.wishlist.length, icon: Heart, color: "from-pink-500 to-rose-400" },
    { title: "Visualizados", value: userData.recentlyViewed.length, icon: BookOpen, color: "from-amber-400 to-orange-500" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "entregue": return "bg-gradient-to-r from-emerald-500 to-green-400 border-none text-white";
      case "em andamento": return "bg-gradient-to-r from-blue-500 to-cyan-400 border-none text-white";
      case "processando": return "bg-gradient-to-r from-amber-500 to-yellow-400 border-none text-white";
      case "cancelado": return "bg-gradient-to-r from-red-500 to-rose-400 border-none text-white";
      default: return "bg-gradient-to-r from-gray-500 to-slate-400 border-none text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "entregue": return <Package className="h-4 w-4" />;
      case "em andamento": return <Clock className="h-4 w-4" />;
      case "processando": return <BarChart3 className="h-4 w-4" />;
      case "cancelado": return <X className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  // Menu de navegação lateral
  const navItems = [
    { label: "Visão Geral", icon: LayoutDashboard, href: "/dashboard", active: activeTab === 'overview' },
    { label: "Pedidos", icon: Package, href: "/dashboard/orders", active: false },
    { label: "Lista de Desejos", icon: Heart, href: "/dashboard/wishlist", active: false },
    { label: "Perfil", icon: User, href: "/dashboard/profile", active: false },
    { label: "Pagamentos", icon: CreditCard, href: "/dashboard/payments", active: false },
    { label: "Configurações", icon: Settings, href: "/dashboard/settings", active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header da página com gradiente */}
        <header className="mb-8 bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden md:flex h-14 w-14 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
                <LayoutDashboard className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Meu Dashboard</h1>
                <p className="opacity-90 mt-1">
                  Bem-vindo de volta, {userData.name.split(' ')[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-white border border-white/20 bg-white/10 hover:bg-white/20 gap-1">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificações</span>
                {userData.notifications.length > 0 && (
                  <Badge variant="destructive" className="ml-1 bg-red-500 hover:bg-red-600 text-xs py-0 px-1.5 rounded-full">
                    {userData.notifications.length}
                  </Badge>
                )}
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white border border-white/20 bg-white/10 hover:bg-white/20">
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="default" size="sm" className="bg-white text-[#08a4a7] hover:bg-white/90 gap-1">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Loja
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Card className="mb-6 overflow-hidden shadow-md border-none bg-white dark:bg-gray-800">
              <div className="h-24 bg-gradient-to-r from-[#08a4a7]/90 to-[#0bdbb6]/90 relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800">
                    <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#08a4a7] to-[#0bdbb6] text-white text-xl">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardContent className="pt-16 pb-6 flex flex-col items-center text-center">
                <h3 className="font-semibold text-xl">{userData.name}</h3>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <Badge variant="outline" className="mt-3 bg-[#08a4a7]/10 text-[#08a4a7] border-[#08a4a7]/20 hover:bg-[#08a4a7]/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Cliente desde {userData.joinDate}
                </Badge>
                
                <div className="w-full mt-6 pt-4 border-t">
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="w-full justify-between transition-all duration-300 hover:bg-[#08a4a7] hover:text-white hover:border-[#08a4a7]">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Menu de navegação */}
            <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-gray-800">
              <CardHeader className="py-4 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">Menu</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 p-2">
                  {navItems.map((item, index) => (
                    <Link href={item.href} key={index}>
                      <Button 
                        variant={item.active ? "default" : "ghost"}
                        className={`w-full justify-start rounded-lg py-2.5 h-auto ${
                          item.active 
                            ? "bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] text-white shadow-md" 
                            : "hover:bg-[#08a4a7]/5 hover:text-[#08a4a7]"
                        }`}
                        onClick={() => item.label === "Visão Geral" && setActiveTab('overview')}
                      >
                        <item.icon className={`h-4 w-4 mr-3 ${item.active ? "" : "text-gray-500"}`} />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
                
                <div className="p-4 mt-4 border-t">
                  <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-3" />
                    Sair
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-9 space-y-6">
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
                  <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                      </div>
                      <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Abas de conteúdo */}
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="mb-6 w-full bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md">
                <TabsTrigger 
                  value="orders" 
                  className="flex-1 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#08a4a7] data-[state=active]:to-[#0bdbb6] data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Últimos Pedidos
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="flex-1 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#08a4a7] data-[state=active]:to-[#0bdbb6] data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Atividade Recente
                </TabsTrigger>
                <TabsTrigger 
                  value="notification" 
                  className="flex-1 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#08a4a7] data-[state=active]:to-[#0bdbb6] data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notificações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
                  <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-[#08a4a7]" />
                        <CardTitle>Seus Pedidos</CardTitle>
                      </div>
                      <Link href="/dashboard/orders">
                        <Button variant="ghost" size="sm" className="text-[#08a4a7] hover:text-[#0bdbb6] hover:bg-[#08a4a7]/5">
                          Ver todos
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                    <CardDescription>Histórico de pedidos recentes</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {userData.orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-[#08a4a7]/10 flex items-center justify-center">
                              <Package className="h-6 w-6 text-[#08a4a7]" />
                            </div>
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Clock className="h-3.5 w-3.5" />
                                {order.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">R$ {order.total.toFixed(2)}</div>
                            <Badge 
                              variant="outline"
                              className={`mt-1 font-medium ${getStatusColor(order.status)} flex items-center gap-1 px-2.5 py-1`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
                  <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BookMarked className="h-5 w-5 text-[#08a4a7]" />
                        <CardTitle>Atividade Recente</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#08a4a7] hover:text-[#0bdbb6] hover:bg-[#08a4a7]/5">
                        Ver todos
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <CardDescription>Livros que você visualizou recentemente</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {userData.recentlyViewed.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="h-20 w-14 bg-gray-100 rounded-lg relative overflow-hidden shrink-0 shadow-md">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              <BookOpen className="h-6 w-6" />
                            </div>
                            {item.coverUrl && (
                              <Image
                                src={item.coverUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base truncate">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.author}</p>
                            <p className="text-sm font-bold text-[#08a4a7] mt-1">R$ {item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                              <Heart className="h-4 w-4 text-rose-500" />
                              <span className="sr-only">Favoritos</span>
                            </Button>
                            <Button variant="default" size="sm" className="bg-[#08a4a7] hover:bg-[#0bdbb6]">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Comprar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notification">
                <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
                  <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-[#08a4a7]" />
                        <CardTitle>Notificações</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#08a4a7] hover:text-[#0bdbb6] hover:bg-[#08a4a7]/5">
                        Marcar como lidas
                      </Button>
                    </div>
                    <CardDescription>Suas notificações recentes</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {userData.notifications.map((notification) => (
                        <div key={notification.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md
                            ${notification.type === 'delivery' ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white' : 
                              notification.type === 'discount' ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' : 
                              'bg-gradient-to-br from-blue-400 to-cyan-500 text-white'}`}>
                            {notification.type === 'delivery' ? (
                              <Package className="h-6 w-6" />
                            ) : notification.type === 'discount' ? (
                              <Gift className="h-6 w-6" />
                            ) : (
                              <Bell className="h-6 w-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-medium">{notification.message}</p>
                            <p className="text-sm text-muted-foreground mt-1.5 flex items-center">
                              <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
                              {notification.time}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Recomendações - Versão Moderna e Elegante */}
            <Card className="border-none shadow-lg overflow-hidden bg-white dark:bg-gray-800">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Recomendados Para Você</CardTitle>
                      <CardDescription className="mt-1">Com base nas suas compras anteriores</CardDescription>
                    </div>
                  </div>
                  <Link href="/products">
                    <Button variant="ghost" size="sm" className="text-[#08a4a7] hover:text-[#0bdbb6] hover:bg-[#08a4a7]/5 gap-1">
                      Ver mais
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {userData.recommendations.map((book) => (
                    <div 
                      key={book.id} 
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-md hover:border-[#08a4a7]/30 dark:bg-gray-800 dark:border-gray-700"
                    >
                      {/* Imagem do livro */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                          <BookOpen className="h-12 w-12" />
                        </div>
                        {book.coverUrl && (
                          <Image
                            src={book.coverUrl}
                            alt={book.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        
                        {/* Ícone de favoritos */}
                        <button 
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-colors duration-300 border border-gray-100 hover:bg-white dark:border-gray-700"
                          aria-label="Adicionar aos favoritos"
                          title="Adicionar aos favoritos"
                        >
                          <Heart className="h-4 w-4 text-rose-500" />
                        </button>
                      </div>
                      
                      {/* Informações do livro */}
                      <div className="flex flex-1 flex-col p-4">
                        {/* Título e autor */}
                        <div className="mb-3 min-h-[60px]">
                          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-[#08a4a7] transition-colors duration-300">
                            {book.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                        </div>
                        
                        {/* Preço e botão de compra */}
                        <div className="flex items-center gap-2">
                          <div className="w-1/3">
                            <div className="text-[#08a4a7] font-bold">
                              R$
                            </div>
                            <div className="text-xl font-bold leading-none">
                              {book.price.toFixed(2).split('.')[0]}
                              <span className="text-sm">.{book.price.toFixed(2).split('.')[1]}</span>
                            </div>
                          </div>
                          <div className="w-2/3">
                            <Button 
                              variant="default" 
                              size="sm"
                              className="w-full bg-gradient-to-r from-[#08a4a7] to-[#0bdbb6] text-white hover:opacity-90 rounded-full transition-opacity"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1.5" />
                              Comprar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 