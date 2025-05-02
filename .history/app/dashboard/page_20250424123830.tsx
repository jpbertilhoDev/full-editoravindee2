"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, PackageOpen, CreditCard, StarIcon, 
  Heart, TrendingUp, ShoppingBag, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

// Dados simulados
const recentOrders = [
  {
    id: "ORD-7295",
    date: "24 Mai 2023",
    total: 129.80,
    status: "Entregue",
    items: [
      {
        title: "A Revolução dos Bichos",
        image: "/books/animal-farm.jpg",
        price: 45.90,
        quantity: 1
      },
      {
        title: "1984",
        image: "/books/1984.jpg",
        price: 39.90,
        quantity: 2
      }
    ]
  },
  {
    id: "ORD-6184",
    date: "10 Abr 2023",
    total: 56.70,
    status: "Entregue",
    items: [
      {
        title: "O Pequeno Príncipe",
        image: "/books/petit-prince.jpg",
        price: 56.70,
        quantity: 1
      }
    ]
  }
];

const wishlistItems = [
  {
    title: "Dom Quixote",
    author: "Miguel de Cervantes",
    image: "/books/dom-quixote.jpg",
    price: 79.90,
    originalPrice: 99.90,
    discount: 20
  },
  {
    title: "O Código Da Vinci",
    author: "Dan Brown",
    image: "/books/davinci-code.jpg",
    price: 49.90,
    originalPrice: null,
    discount: null
  },
  {
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    image: "/books/hobbit.jpg",
    price: 59.90,
    originalPrice: 69.90,
    discount: 14
  }
];

const recentActivity = [
  {
    type: "order",
    message: "Seu pedido #ORD-7295 foi entregue",
    date: "Hoje",
    time: "09:45"
  },
  {
    type: "wishlist",
    message: "O livro 'Orgulho e Preconceito' da sua lista de desejos está em promoção",
    date: "Ontem",
    time: "14:20"
  },
  {
    type: "review",
    message: "Sua avaliação para '1984' foi publicada",
    date: "23 Mai 2023",
    time: "11:30"
  },
  {
    type: "system",
    message: "Programa de fidelidade ativado na sua conta",
    date: "20 Mai 2023",
    time: "16:15"
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meu Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo de volta, João!</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-[#08a4a7]/10 p-3 rounded-full">
                <PackageOpen size={24} className="text-[#08a4a7]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pedidos</p>
                <h3 className="text-2xl font-bold">6</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">1 novo</span> neste mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Heart size={24} className="text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lista de Desejos</p>
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-purple-500 font-medium">3 em promoção</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <StarIcon size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliações</p>
                <h3 className="text-2xl font-bold">8</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-amber-500 font-medium">94% positivas</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pontos Fidelidade</p>
                <h3 className="text-2xl font-bold">350</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+50</span> no último pedido
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders and Wishlist Section */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="orders" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="orders" className="px-4">Pedidos Recentes</TabsTrigger>
                <TabsTrigger value="wishlist" className="px-4">Lista de Desejos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="m-0">
                <Link href="/dashboard/orders">
                  <Button variant="ghost" size="sm" className="text-xs text-[#08a4a7]">
                    Ver todos
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </TabsContent>
              
              <TabsContent value="wishlist" className="m-0">
                <Link href="/dashboard/wishlist">
                  <Button variant="ghost" size="sm" className="text-xs text-[#08a4a7]">
                    Ver todos
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </TabsContent>
            </div>
            
            <TabsContent value="orders" className="p-0 m-0">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base flex items-center">
                            Pedido <span className="font-mono ml-1">{order.id}</span>
                          </CardTitle>
                          <CardDescription>
                            {order.date} • {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </CardDescription>
                        </div>
                        <div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            order.status === 'Entregue' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {order.items.map((item, index) => (
                          <HoverCard key={index}>
                            <HoverCardTrigger asChild>
                              <div className="relative w-12 h-16 overflow-hidden rounded border border-gray-200 cursor-pointer">
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <ShoppingBag size={14} className="text-gray-400" />
                                </div>
                                {item.quantity > 1 && (
                                  <div className="absolute -bottom-1 -right-1 bg-[#08a4a7] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {item.quantity}
                                  </div>
                                )}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent side="top" className="w-64 p-2">
                              <div className="flex">
                                <div className="w-12 h-16 bg-gray-100 rounded mr-3">
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag size={16} className="text-gray-400" />
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{item.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    R$ {item.price.toFixed(2)} {item.quantity > 1 ? `x ${item.quantity}` : ''}
                                  </p>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Total:</span> R$ {order.total.toFixed(2)}
                      </div>
                      <Button variant="outline" size="sm" className="h-8">
                        Ver detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="wishlist" className="p-0 m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlistItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex p-4">
                      <div className="w-20 h-28 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                        <ShoppingBag size={20} className="text-gray-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.author}</p>
                        
                        <div className="flex items-baseline mt-2">
                          <span className="font-medium">R$ {item.price.toFixed(2)}</span>
                          {item.originalPrice && (
                            <>
                              <span className="text-xs text-muted-foreground line-through ml-2">
                                R$ {item.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs font-medium text-green-600 ml-2">
                                {item.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex mt-3 space-x-2">
                          <Button size="sm" variant="default" className="h-8 bg-[#08a4a7] hover:bg-[#08a4a7]/90 text-xs">
                            Adicionar ao Carrinho
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-xs aspect-square px-0">
                            <Trash size={14} className="text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Activity Feed */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative pl-8 pr-4">
                <div className="absolute left-[14px] top-0 bottom-0 w-px bg-gray-200"></div>
                
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-4 relative">
                    <div className={`absolute left-[-14px] w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                      activity.type === 'order' ? 'bg-green-100' :
                      activity.type === 'wishlist' ? 'bg-purple-100' :
                      activity.type === 'review' ? 'bg-amber-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'order' && <PackageOpen size={12} className="text-green-500" />}
                      {activity.type === 'wishlist' && <Heart size={12} className="text-purple-500" />}
                      {activity.type === 'review' && <StarIcon size={12} className="text-amber-500" />}
                      {activity.type === 'system' && <AlertCircle size={12} className="text-gray-500" />}
                    </div>
                    
                    <div className="pt-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date} às {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-4">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                Ver todas as atividades
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Progresso da Fidelidade</CardTitle>
              <CardDescription>350 de 500 pontos para o próximo nível</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#08a4a7] h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Nível Atual</p>
                    <p className="font-medium">Prata</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Próximo Nível</p>
                    <p className="font-medium">Ouro</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Benefícios do Programa
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 