"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, ShoppingBag, Heart, User, Clock, ChevronRight, 
  TrendingUp, Bell, BookOpen, Gift, CalendarClock, CreditCard
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    { title: "Pedidos", value: userData.orders.length, icon: ShoppingBag },
    { title: "Favoritos", value: userData.wishlist.length, icon: Heart },
    { title: "Visualizados", value: userData.recentlyViewed.length, icon: BookOpen },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "entregue": return "bg-green-100 text-green-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "processando": return "bg-amber-100 text-amber-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Header da página */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meu Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo de volta, {userData.name.split(' ')[0]}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
              {userData.notifications.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs py-0 px-1.5 rounded-full">
                  {userData.notifications.length}
                </Badge>
              )}
            </Button>
            <Button variant="default" size="sm" className="bg-[#08a4a7] hover:bg-[#0bdbb6]">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Ir às compras
            </Button>
          </div>
        </div>
      </header>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                <AvatarFallback className="bg-[#08a4a7] text-white text-lg">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{userData.name}</h3>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Cliente desde {userData.joinDate}</p>
              
              <div className="w-full mt-6 pt-4 border-t">
                <Link href="/dashboard/profile">
                  <Button variant="outline" size="sm" className="w-full justify-between">
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
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Menu</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <div className="space-y-1">
                <Link href="/dashboard">
                  <Button 
                    variant={activeTab === 'overview' ? "default" : "ghost"}
                    className={`w-full justify-start ${activeTab === 'overview' ? "bg-[#08a4a7] hover:bg-[#08a4a7]" : ""}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Visão Geral
                  </Button>
                </Link>
                <Link href="/dashboard/orders">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Meus Pedidos
                  </Button>
                </Link>
                <Link href="/dashboard/wishlist">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Lista de Desejos
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>
                </Link>
                <Link href="/dashboard/payments">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagamentos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#08a4a7]/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-[#08a4a7]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Atividade recente e Pedidos */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="mb-4 w-full max-w-md">
              <TabsTrigger value="orders" className="flex-1">Últimos Pedidos</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">Atividade Recente</TabsTrigger>
              <TabsTrigger value="notification" className="flex-1">Notificações</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Seus Pedidos</CardTitle>
                    <Link href="/dashboard/orders">
                      <Button variant="link" size="sm" className="text-[#08a4a7]">
                        Ver todos
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>Histórico de pedidos recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#08a4a7]/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-[#08a4a7]" />
                          </div>
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {order.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">R$ {order.total.toFixed(2)}</div>
                          <Badge 
                            variant="outline"
                            className={`font-normal ${getStatusColor(order.status)}`}
                          >
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
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Atividade Recente</CardTitle>
                    <Button variant="link" size="sm" className="text-[#08a4a7]">
                      Ver todos
                    </Button>
                  </div>
                  <CardDescription>Livros que você visualizou recentemente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.recentlyViewed.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className="h-16 w-12 bg-gray-100 rounded-md relative overflow-hidden shrink-0">
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
                          <h4 className="font-medium text-sm truncate">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                          <p className="text-sm font-medium text-[#08a4a7]">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Comprar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notification">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Notificações</CardTitle>
                    <Button variant="link" size="sm" className="text-[#08a4a7]">
                      Marcar todas como lidas
                    </Button>
                  </div>
                  <CardDescription>Suas notificações recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center
                          ${notification.type === 'delivery' ? 'bg-green-100 text-green-600' : 
                            notification.type === 'discount' ? 'bg-amber-100 text-amber-600' : 
                            'bg-blue-100 text-blue-600'}`}>
                          {notification.type === 'delivery' ? (
                            <Package className="h-5 w-5" />
                          ) : notification.type === 'discount' ? (
                            <Gift className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <CalendarClock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recomendações */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Recomendados Para Você</CardTitle>
                <Link href="/products">
                  <Button variant="link" size="sm" className="text-[#08a4a7]">
                    Ver mais
                  </Button>
                </Link>
              </div>
              <CardDescription>Com base nas suas compras anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userData.recommendations.map((book) => (
                  <div key={book.id} className="rounded-lg border overflow-hidden flex flex-col">
                    <div className="h-40 w-full bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <BookOpen className="h-8 w-8" />
                      </div>
                      {book.coverUrl && (
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-medium text-sm line-clamp-1">{book.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-[#08a4a7]">R$ {book.price.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Heart className="h-4 w-4" />
                        </Button>
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
  );
} 