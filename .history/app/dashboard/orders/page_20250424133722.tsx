"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, PackageOpen, PackageCheck, TruckIcon, 
  ShoppingBag, ChevronDown, Download, Eye, ChevronRight, Calendar, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

// Dados simulados
const orders = [
  {
    id: "ORD-7295",
    date: "24 Mai 2023",
    total: 129.80,
    status: "Entregue",
    paymentMethod: "Cartão de Crédito",
    paymentStatus: "Pago",
    trackingNumber: "BR45678901234",
    shippingMethod: "Padrão",
    items: [
      {
        title: "A Revolução dos Bichos",
        author: "George Orwell",
        image: "/books/animal-farm.jpg",
        price: 45.90,
        quantity: 1
      },
      {
        title: "1984",
        author: "George Orwell",
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
    paymentMethod: "Boleto",
    paymentStatus: "Pago",
    trackingNumber: "BR12345678901",
    shippingMethod: "Expressa",
    items: [
      {
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        image: "/books/petit-prince.jpg",
        price: 56.70,
        quantity: 1
      }
    ]
  },
  {
    id: "ORD-5327",
    date: "18 Mar 2023",
    total: 89.70,
    status: "Entregue",
    paymentMethod: "PayPal",
    paymentStatus: "Pago",
    trackingNumber: "BR09876543210",
    shippingMethod: "Padrão",
    items: [
      {
        title: "Cem Anos de Solidão",
        author: "Gabriel García Márquez",
        image: "/books/hundred-years.jpg",
        price: 69.90,
        quantity: 1
      },
      {
        title: "O Alquimista",
        author: "Paulo Coelho",
        image: "/books/alchemist.jpg",
        price: 19.80,
        quantity: 1
      }
    ]
  },
  {
    id: "ORD-4216",
    date: "05 Fev 2023",
    total: 149.50,
    status: "Entregue",
    paymentMethod: "Cartão de Crédito",
    paymentStatus: "Pago",
    trackingNumber: "BR13579086421",
    shippingMethod: "Expressa",
    items: [
      {
        title: "A Metamorfose",
        author: "Franz Kafka",
        image: "/books/metamorphosis.jpg",
        price: 39.90,
        quantity: 1
      },
      {
        title: "Crime e Castigo",
        author: "Fiódor Dostoiévski",
        image: "/books/crime-punishment.jpg",
        price: 59.80,
        quantity: 1
      },
      {
        title: "O Retrato de Dorian Gray",
        author: "Oscar Wilde",
        image: "/books/dorian-gray.jpg",
        price: 49.80,
        quantity: 1
      }
    ]
  },
  {
    id: "ORD-3157",
    date: "12 Jan 2023",
    total: 112.60,
    status: "Entregue",
    paymentMethod: "PIX",
    paymentStatus: "Pago",
    trackingNumber: "BR24680975310",
    shippingMethod: "Padrão",
    items: [
      {
        title: "Dom Casmurro",
        author: "Machado de Assis",
        image: "/books/dom-casmurro.jpg",
        price: 42.90,
        quantity: 1
      },
      {
        title: "Memórias Póstumas de Brás Cubas",
        author: "Machado de Assis",
        image: "/books/bras-cubas.jpg",
        price: 39.80,
        quantity: 1
      },
      {
        title: "Quincas Borba",
        author: "Machado de Assis",
        image: "/books/quincas-borba.jpg",
        price: 29.90,
        quantity: 1
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Entregue':
      return 'bg-green-100 text-green-700';
    case 'Em trânsito':
      return 'bg-blue-100 text-blue-700';
    case 'Processando':
      return 'bg-amber-100 text-amber-700';
    case 'Cancelado':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Entregue':
      return <PackageCheck size={14} className="text-green-600" />;
    case 'Em trânsito':
      return <TruckIcon size={14} className="text-blue-600" />;
    case 'Processando':
      return <PackageOpen size={14} className="text-amber-600" />;
    case 'Cancelado':
      return <X size={14} className="text-red-600" />;
    default:
      return <PackageOpen size={14} className="text-gray-600" />;
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const filteredOrders = orders.filter(order => {
    // Filter by search term
    const matchesSearch = 
      searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Filter by status  
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Filter by date (simplified for demo)
    const matchesDate = dateFilter === 'all'; // In real app, would filter by date range
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const handleOrderClick = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meus Pedidos</h1>
        <p className="text-muted-foreground mt-1">Gerencie e acompanhe seus pedidos</p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de pedido, produto ou autor..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="Entregue">Entregue</SelectItem>
                  <SelectItem value="Em trânsito">Em trânsito</SelectItem>
                  <SelectItem value="Processando">Processando</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                  <SelectItem value="three-months">Últimos 3 meses</SelectItem>
                  <SelectItem value="six-months">Últimos 6 meses</SelectItem>
                  <SelectItem value="year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-4 text-lg font-medium">Nenhum pedido encontrado</h3>
            <p className="mt-1 text-muted-foreground">
              Tente ajustar seus filtros ou fazer uma nova busca.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Nº do Pedido</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((item, index) => (
                                  <div 
                                    key={index} 
                                    className="h-8 w-6 rounded bg-gray-100 border border-white relative"
                                  >
                                    <div className="h-full w-full flex items-center justify-center">
                                      <ShoppingBag size={12} className="text-gray-400" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {order.items.length > 3 && (
                                <span className="ml-1 text-xs text-muted-foreground">
                                  +{order.items.length - 3}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            R$ {order.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Badge variant="outline" className={`${getStatusColor(order.status)} border-0`}>
                                <span className="flex items-center">
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1">{order.status}</span>
                                </span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <ChevronDown size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye size={14} className="mr-2" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download size={14} className="mr-2" />
                                  Baixar nota fiscal
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <TruckIcon size={14} className="mr-2" />
                                  Rastrear pedido
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {/* Mobile view with accordions */}
            <div className="block md:hidden space-y-3">
              {filteredOrders.map((order) => (
                <Card key={order.id} 
                  className={expandedOrder === order.id ? 'border-[#08a4a7]' : 'border-border'}
                >
                  <CardHeader 
                    className="p-4 cursor-pointer"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base flex items-center">
                          Pedido <span className="font-mono ml-1">{order.id}</span>
                        </CardTitle>
                        <CardDescription>
                          {order.date} • {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={`${getStatusColor(order.status)} border-0`}>
                        <span className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Total:</span>{' '}
                        <span className="font-medium">R$ {order.total.toFixed(2)}</span>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className={`transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </CardHeader>
                  
                  {expandedOrder === order.id && (
                    <>
                      <CardContent className="px-4 pt-0 pb-2">
                        <div className="border-t pt-3 space-y-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Detalhes do Pedido</p>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div className="text-muted-foreground">Método de Pagamento:</div>
                              <div>{order.paymentMethod}</div>
                              
                              <div className="text-muted-foreground">Status do Pagamento:</div>
                              <div>{order.paymentStatus}</div>
                              
                              <div className="text-muted-foreground">Método de Envio:</div>
                              <div>{order.shippingMethod}</div>
                              
                              <div className="text-muted-foreground">Rastreamento:</div>
                              <div>
                                <Link 
                                  href={`/tracking/${order.trackingNumber}`}
                                  className="text-[#08a4a7] hover:underline"
                                >
                                  {order.trackingNumber}
                                </Link>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Itens</p>
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-start py-2 border-t">
                                <div className="w-10 h-14 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                                  <ShoppingBag size={16} className="text-gray-400" />
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium">{item.title}</p>
                                  <p className="text-xs text-muted-foreground">{item.author}</p>
                                  <div className="flex justify-between mt-1 text-sm">
                                    <span>R$ {item.price.toFixed(2)} x {item.quantity}</span>
                                    <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-0 pb-4 px-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye size={14} className="mr-2" />
                          Ver detalhes
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <TruckIcon size={14} className="mr-2" />
                          Rastrear
                        </Button>
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
        
        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
} 