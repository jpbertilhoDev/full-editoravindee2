"use client";

import React, { useState } from 'react';
import { Package, Search, Filter, Eye, Calendar, Clock, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all-time');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Dados simulados para os pedidos
  const orders = [
    { 
      id: "ORD-3842", 
      date: "25/04/2023", 
      status: "entregue", 
      items: 3, 
      total: 127.50,
      products: [
        { name: "O Poder do Hábito", price: 49.90, quantity: 1, image: "/images/products/product-1.jpg" },
        { name: "Mindset: A Nova Psicologia do Sucesso", price: 54.90, quantity: 1, image: "/images/products/product-2.jpg" },
        { name: "Essencialismo", price: 22.70, quantity: 1, image: "/images/products/product-3.jpg" },
      ],
      address: "Rua das Flores, 123 - São Paulo, SP",
      payment: "Cartão de crédito ****3456",
      tracking: "BR982736459108",
      deliveryDate: "29/04/2023",
    },
    { 
      id: "ORD-2719", 
      date: "14/03/2023", 
      status: "entregue", 
      items: 2, 
      total: 85.90,
      products: [
        { name: "Comece Pelo Porquê", price: 45.90, quantity: 1, image: "/images/products/product-4.jpg" },
        { name: "Tudo é Óbvio", price: 40.00, quantity: 1, image: "/images/products/product-5.jpg" },
      ],
      address: "Rua das Flores, 123 - São Paulo, SP",
      payment: "PayPal",
      tracking: "BR982736442891",
      deliveryDate: "20/03/2023",
    },
    { 
      id: "ORD-1932", 
      date: "02/02/2023", 
      status: "entregue", 
      items: 1, 
      total: 45.00,
      products: [
        { name: "Rápido e Devagar", price: 45.00, quantity: 1, image: "/images/products/product-6.jpg" },
      ],
      address: "Rua das Flores, 123 - São Paulo, SP",
      payment: "Cartão de crédito ****3456",
      tracking: "BR982736442333",
      deliveryDate: "08/02/2023",
    },
    { 
      id: "ORD-4532", 
      date: "10/05/2023", 
      status: "processando", 
      items: 2, 
      total: 90.80,
      products: [
        { name: "Pense de Novo", price: 42.90, quantity: 1, image: "/images/products/product-7.jpg" },
        { name: "Inevitável", price: 47.90, quantity: 1, image: "/images/products/product-8.jpg" },
      ],
      address: "Rua das Flores, 123 - São Paulo, SP",
      payment: "Boleto bancário",
      tracking: "Aguardando processamento",
      deliveryDate: "Estimado para 16/05/2023",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "entregue": return "bg-green-100 text-green-800";
      case "em andamento": return "bg-blue-100 text-blue-800";
      case "processando": return "bg-amber-100 text-amber-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'em andamento', label: 'Em andamento' },
    { value: 'processando', label: 'Processando' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  const dateOptions = [
    { value: 'all-time', label: 'Todo período' },
    { value: 'last-30-days', label: 'Últimos 30 dias' },
    { value: 'last-90-days', label: 'Últimos 90 dias' },
    { value: 'last-year', label: 'Último ano' },
  ];

  // Filtragem de pedidos
  const filteredOrders = orders.filter((order) => {
    // Filtro de busca
    const searchMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de status
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    
    // Retorna true apenas se todos os filtros aplicáveis corresponderem
    return searchMatch && statusMatch;
  });
  
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meus Pedidos</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e acompanhe todos os seus pedidos
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Pedidos</CardTitle>
          <CardDescription>
            Visualize e acompanhe todos os seus pedidos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por número do pedido..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por data" />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`font-normal ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="text-right">R$ {order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="sm:max-w-md">
                            {selectedOrder && (
                              <>
                                <SheetHeader className="mb-5">
                                  <SheetTitle>Detalhes do Pedido {selectedOrder.id}</SheetTitle>
                                  <SheetDescription>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span>Realizado em {selectedOrder.date}</span>
                                    </div>
                                  </SheetDescription>
                                </SheetHeader>
                                
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Status do Pedido</h4>
                                    <Badge 
                                      variant="outline"
                                      className={`font-normal ${getStatusColor(selectedOrder.status)}`}
                                    >
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Produtos</h4>
                                    <div className="space-y-4">
                                      {selectedOrder.products.map((product, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                          <div className="w-12 h-16 bg-gray-100 rounded-md relative flex-shrink-0">
                                            <Package className="absolute inset-0 m-auto h-5 w-5 text-gray-400" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                              R$ {product.price.toFixed(2)} x {product.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <div className="flex justify-between mb-2">
                                      <span className="text-sm text-muted-foreground">Subtotal:</span>
                                      <span className="text-sm">R$ {selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="text-sm text-muted-foreground">Frete:</span>
                                      <span className="text-sm">Grátis</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                      <span>Total:</span>
                                      <span>R$ {selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium mb-2">Informações de Entrega</h4>
                                    <p className="text-sm">{selectedOrder.address}</p>
                                    <div className="mt-2 flex items-center gap-2 text-sm">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span>{selectedOrder.status === 'entregue' ? 'Entregue em' : 'Previsão de entrega'}: {selectedOrder.deliveryDate}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium mb-2">Informações de Pagamento</h4>
                                    <p className="text-sm">{selectedOrder.payment}</p>
                                  </div>
                                  
                                  {selectedOrder.tracking && (
                                    <div className="border-t pt-4">
                                      <h4 className="text-sm font-medium mb-2">Código de Rastreio</h4>
                                      <p className="text-sm font-mono">{selectedOrder.tracking}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <SheetFooter className="mt-6">
                                  <SheetClose asChild>
                                    <Button variant="outline" className="w-full sm:w-auto">
                                      Fechar
                                    </Button>
                                  </SheetClose>
                                  <Button className="w-full sm:w-auto">
                                    <Download className="h-4 w-4 mr-2" />
                                    Baixar Nota Fiscal
                                  </Button>
                                </SheetFooter>
                              </>
                            )}
                          </SheetContent>
                        </Sheet>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              Acompanhar entrega
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Baixar nota fiscal
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Avaliar produtos
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum pedido encontrado com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 