"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, ArrowUp, ArrowDown, Euro, 
  Package, Users, ShoppingCart, Calendar, Layers,
  BookOpen, TrendingUp, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  getCountFromServer
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

// Componente para gráfico de barras simples
const SimpleBarChart = ({ data, height = 80 }: { data: number[], height?: number }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end justify-between h-full gap-1 pt-2" style={{ height }}>
      {data.map((value, i) => {
        const percentage = max > 0 ? (value / max) * 100 : 0;
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-primary/90 rounded-sm hover:bg-primary transition-all"
              style={{ height: `${Math.max(percentage, 4)}%` }}
            />
            <span className="text-[10px] text-muted-foreground mt-1">{i + 1}</span>
          </div>
        );
      })}
    </div>
  );
};

// Card para exibir estatística com ícone e variação
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  change?: number;
  loading?: boolean;
}

const StatCard = ({ title, value, description, icon: Icon, change, loading = false }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {typeof change !== 'undefined' && !loading && (
          <div className="flex items-center pt-1">
            {change > 0 ? (
              <>
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+{change}%</span>
              </>
            ) : change < 0 ? (
              <>
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs text-red-500">{change}%</span>
              </>
            ) : (
              <span className="text-xs text-gray-500">Estável</span>
            )}
            <span className="text-xs text-muted-foreground ml-1">em relação ao período anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente de tabela simplificada
interface SimpleTableProps {
  headers: string[];
  data: Array<any>;
  loading?: boolean;
}

const SimpleTable = ({ headers, data, loading = false }: SimpleTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {headers.map((header, i) => (
              <th key={i} className="text-left py-3 px-2 font-medium text-muted-foreground">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <tr key={i} className="border-b">
                {Array(headers.length).fill(0).map((_, j) => (
                  <td key={j} className="py-3 px-2">
                    <Skeleton className="h-4 w-full max-w-24" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-4 text-center text-muted-foreground">
                Nenhum dado encontrado
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b">
                {Object.values(row).map((cell, j) => (
                  <td key={j} className="py-3 px-2">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    revenueChange: 0,
    orders: 0,
    ordersChange: 0,
    products: 0,
    users: 0,
    usersChange: 0,
    avgOrderValue: 0,
    dailySales: [0, 0, 0, 0, 0, 0, 0], // Últimos 7 dias
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Determinar datas para consultas
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate;
        
        switch(period) {
          case 'today':
            startDate = today;
            break;
          case 'week':
            startDate = subDays(today, 7);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            break;
        }
        
        const previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - (period === 'today' ? 1 : period === 'week' ? 7 : 30));
        
        // Consulta para pedidos no período atual
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(
          ordersRef,
          where("createdAt", ">=", Timestamp.fromDate(startDate)),
          orderBy("createdAt", "desc")
        );
        
        // Consulta para pedidos no período anterior (para comparação)
        const previousOrdersQuery = query(
          ordersRef,
          where("createdAt", ">=", Timestamp.fromDate(previousStartDate)),
          where("createdAt", "<", Timestamp.fromDate(startDate)),
          orderBy("createdAt", "desc")
        );
        
        // Executar consultas em paralelo
        const [
          ordersSnapshot,
          previousOrdersSnapshot,
          productsCountSnapshot,
          usersCountSnapshot,
          previousUsersCountSnapshot
        ] = await Promise.all([
          getDocs(ordersQuery),
          getDocs(previousOrdersQuery),
          getCountFromServer(collection(db, "products")),
          getCountFromServer(query(collection(db, "users"), where("role", "!=", "admin"))),
          getCountFromServer(query(
            collection(db, "users"), 
            where("role", "!=", "admin"),
            where("createdAt", "<", Timestamp.fromDate(startDate))
          ))
        ]);
        
        // Processar dados de pedidos
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const previousOrders = previousOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Calcular métricas
        const revenue = orders.reduce((sum, order: any) => sum + (order.total || 0), 0);
        const previousRevenue = previousOrders.reduce((sum, order: any) => sum + (order.total || 0), 0);
        
        const revenueChange = previousRevenue > 0 
          ? Math.round(((revenue - previousRevenue) / previousRevenue) * 100) 
          : 100;
          
        const ordersCount = orders.length;
        const previousOrdersCount = previousOrders.length;
        
        const ordersChange = previousOrdersCount > 0 
          ? Math.round(((ordersCount - previousOrdersCount) / previousOrdersCount) * 100) 
          : 100;
          
        const usersCount = usersCountSnapshot.data().count;
        const previousUsersCount = previousUsersCountSnapshot.data().count;
        
        const usersChange = previousUsersCount > 0 
          ? Math.round(((usersCount - previousUsersCount) / previousUsersCount) * 100) 
          : 0;
          
        const avgOrderValue = ordersCount > 0 ? Math.round(revenue / ordersCount) : 0;
        
        // Dados para gráfico de vendas diárias (últimos 7 dias)
        const last7Days = Array(7).fill(0).map((_, i) => subDays(new Date(), i));
        const dailySales = last7Days.map(date => {
          const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
          
          return orders.filter((order: any) => {
            const orderDate = order.createdAt?.toDate();
            return orderDate >= dayStart && orderDate < dayEnd;
          }).reduce((sum, order: any) => sum + (order.total || 0), 0);
        }).reverse();
        
        // Obter pedidos recentes para tabela
        const recentOrdersData = orders.slice(0, 5).map((order: any) => ({
          id: order.id,
          cliente: order.customerName || 'Cliente',
          data: order.createdAt?.toDate() 
            ? format(order.createdAt.toDate(), 'dd/MM/yy HH:mm', { locale: ptBR }) 
            : '-',
          total: order.total ? `R$ ${order.total.toFixed(2)}` : 'R$ 0,00',
          status: order.status || 'Pendente'
        }));
        
        // Obter produtos mais vendidos
        // Em um cenário real, isso seria calculado com mais precisão através de agregações no banco
        const productCounts: {[key: string]: {count: number, name: string, revenue: number}} = {};
        
        orders.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            if (!productCounts[item.productId]) {
              productCounts[item.productId] = { 
                count: 0, 
                name: item.productName || 'Produto', 
                revenue: 0 
              };
            }
            productCounts[item.productId].count += item.quantity || 1;
            productCounts[item.productId].revenue += item.price * (item.quantity || 1);
          });
        });
        
        const topProductsData = Object.entries(productCounts)
          .map(([id, data]) => ({
            id,
            produto: data.name,
            vendidos: data.count,
            receita: `R$ ${data.revenue.toFixed(2)}`
          }))
          .sort((a, b) => b.vendidos - a.vendidos)
          .slice(0, 5);
        
        // Atualizar estados
        setMetrics({
          revenue,
          revenueChange,
          orders: ordersCount,
          ordersChange,
          products: productsCountSnapshot.data().count,
          users: usersCount,
          usersChange,
          avgOrderValue,
          dailySales,
        });
        
        setRecentOrders(recentOrdersData);
        setTopProducts(topProductsData);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">
              {period === 'today' ? 'Hoje' : period === 'week' ? 'Esta semana' : 'Este mês'}
            </span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Seletor de período */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <Button
                variant={period === 'today' ? 'default' : 'outline'}
                size="sm"
                className="rounded-l-md rounded-r-none"
                onClick={() => setPeriod('today')}
              >
                Hoje
              </Button>
              <Button
                variant={period === 'week' ? 'default' : 'outline'}
                size="sm"
                className="rounded-none border-x-0"
                onClick={() => setPeriod('week')}
              >
                Semana
              </Button>
              <Button
                variant={period === 'month' ? 'default' : 'outline'}
                size="sm"
                className="rounded-r-md rounded-l-none"
                onClick={() => setPeriod('month')}
              >
                Mês
              </Button>
            </div>
          </div>
          
          {/* Cards de estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Receita Total"
              value={`€ ${metrics.revenue.toFixed(2)}`}
              icon={Euro}
              change={metrics.revenueChange}
              loading={loading}
            />
            <StatCard
              title="Pedidos"
              value={metrics.orders}
              icon={ShoppingCart}
              change={metrics.ordersChange}
              loading={loading}
            />
            <StatCard
              title="Valor Médio"
              value={`R$ ${metrics.avgOrderValue.toFixed(2)}`}
              icon={TrendingUp}
              loading={loading}
            />
            <StatCard
              title="Novos Usuários"
              value={metrics.users}
              icon={Users}
              change={metrics.usersChange}
              loading={loading}
            />
          </div>
          
          {/* Gráfico de vendas */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
                <CardDescription>
                  Volume de vendas nos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[80px] w-full" />
                ) : (
                  <SimpleBarChart data={metrics.dailySales} />
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Visão Geral do Catálogo</CardTitle>
                <CardDescription>
                  Informações sobre produtos e categorias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-semibold">{loading ? <Skeleton className="h-6 w-12" /> : metrics.products}</div>
                    <div className="text-xs text-muted-foreground text-center">Produtos</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                      <Layers className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-semibold">{loading ? <Skeleton className="h-6 w-12" /> : '8'}</div>
                    <div className="text-xs text-muted-foreground text-center">Categorias</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-semibold">{loading ? <Skeleton className="h-6 w-12" /> : '12'}</div>
                    <div className="text-xs text-muted-foreground text-center">Livros</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-semibold">{loading ? <Skeleton className="h-6 w-12" /> : '30 min'}</div>
                    <div className="text-xs text-muted-foreground text-center">Tempo médio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabelas */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
                <CardDescription>Últimos pedidos realizados na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleTable 
                  headers={['ID', 'Cliente', 'Data', 'Total', 'Status']}
                  data={recentOrders}
                  loading={loading}
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>Produtos com maior volume de vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleTable 
                  headers={['Produto', 'Vendidos', 'Receita']}
                  data={topProducts.map(p => ({ 
                    produto: p.produto, 
                    vendidos: p.vendidos, 
                    receita: p.receita 
                  }))}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análises Detalhadas</CardTitle>
              <CardDescription>
                Relatórios e métricas avançadas sobre o desempenho da loja
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">Relatórios avançados</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  Visualize métricas detalhadas sobre vendas, produtos, clientes e mais.
                  Os relatórios avançados estão em desenvolvimento e estarão disponíveis em breve.
                </p>
                <Button className="mt-4">Criar Relatório Personalizado</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 