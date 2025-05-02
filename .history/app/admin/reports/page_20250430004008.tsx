"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  LineChart,
  PieChart,
  DownloadCloud,
  Calendar,
  FilterX,
  Filter,
  RefreshCw,
  ChevronDown,
  FileSpreadsheet,
  FilePdf,
  Share2,
  DollarSign,
  Euro,
  Package,
  ShoppingCart
} from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

// Tipos para os dados dos relatórios
interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface ProductData {
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

interface CategoryData {
  name: string;
  sales: number;
  percentage: number;
}

interface CustomerData {
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastPurchase: string;
}

// Componente de gráfico de barras simplificado
const SimpleBarChart = ({ data, labels, height = 180 }: { data: number[], labels: string[], height: number }) => {
  const max = Math.max(...data, 1); // Evitar divisão por zero
  
  return (
    <div className="flex items-end space-x-2 h-full pt-6" style={{ height }}>
      {data.map((value, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-primary/90 hover:bg-primary transition-colors rounded-sm" 
            style={{ height: `${Math.max((value / max) * 100, 4)}%` }}
          />
          <span className="mt-2 text-xs text-muted-foreground">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
};

// Componente de gráfico de pizza simplificado
const SimplePieChart = ({ data }: { data: CategoryData[] }) => {
  const colors = [
    'bg-primary', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-red-500', 'bg-orange-500'
  ];
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-center py-6">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {data.map((item, index) => {
              const startAngle = data
                .slice(0, index)
                .reduce((sum, curr) => sum + curr.percentage, 0);
              const endAngle = startAngle + item.percentage;
              
              // Converter porcentagens para ângulos em radianos
              const startRad = (startAngle / 100) * 2 * Math.PI;
              const endRad = (endAngle / 100) * 2 * Math.PI;
              
              // Calcular pontos na circunferência
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              // Determinar bandeira de arco longo
              const largeArcFlag = item.percentage > 50 ? 1 : 0;
              
              // Caminho SVG para o setor da pizza
              const path = `
                M 50 50
                L ${x1} ${y1}
                A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
              
              return (
                <path 
                  key={index} 
                  d={path} 
                  className={`${colors[index % colors.length]} hover:opacity-90 transition-opacity`}
                  strokeWidth="0"
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-3 h-3 mr-2 rounded-sm ${colors[index % colors.length]}`} />
            <span className="text-sm truncate">{item.name}</span>
            <span className="ml-auto text-sm font-medium">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente principal da página de relatórios
export default function ReportsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryData[]>([]);
  const [topCustomers, setTopCustomers] = useState<CustomerData[]>([]);
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | 'year'>('30days');
  
  // Efeito para carregar dados dos relatórios
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // Calcular intervalo de datas
        const endDate = new Date();
        let startDate;
        
        switch (dateRange) {
          case '7days':
            startDate = subDays(endDate, 7);
            break;
          case '30days':
            startDate = subDays(endDate, 30);
            break;
          case '90days':
            startDate = subDays(endDate, 90);
            break;
          case 'year':
            startDate = subMonths(endDate, 12);
            break;
        }
        
        // Consulta para pedidos no período
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(
          ordersRef,
          where("createdAt", ">=", Timestamp.fromDate(startDate)),
          where("createdAt", "<=", Timestamp.fromDate(endDate)),
          orderBy("createdAt", "desc")
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Dados para gráfico de vendas mensais
        // Em um cenário real, isso seria uma agregação no servidor
        const monthlySalesMap = new Map<string, SalesData>();
        
        // Processar pedidos para gerar relatórios
        const productSalesMap = new Map<string, ProductData>();
        const categorySalesMap = new Map<string, { sales: number, revenue: number }>();
        const customerSalesMap = new Map<string, CustomerData>();
        
        let totalSales = 0;
        
        orders.forEach((order: any) => {
          // Calcular período (mês para relatório)
          const orderDate = order.createdAt?.toDate();
          if (!orderDate) return;
          
          const monthKey = format(orderDate, 'yyyy-MM', { locale: ptBR });
          const monthLabel = format(orderDate, 'MMM', { locale: ptBR });
          
          // Dados de vendas mensais
          if (!monthlySalesMap.has(monthKey)) {
            monthlySalesMap.set(monthKey, {
              period: monthLabel,
              revenue: 0,
              orders: 0,
              averageOrderValue: 0
            });
          }
          
          const monthData = monthlySalesMap.get(monthKey)!;
          monthData.revenue += order.total || 0;
          monthData.orders += 1;
          monthData.averageOrderValue = monthData.revenue / monthData.orders;
          
          // Dados de produtos
          order.items?.forEach((item: any) => {
            if (!item.productId) return;
            
            // Vendas por produto
            if (!productSalesMap.has(item.productId)) {
              productSalesMap.set(item.productId, {
                name: item.productName || 'Produto sem nome',
                sales: 0,
                revenue: 0,
                stock: 0 // Seria atualizado com dados reais
              });
            }
            
            const productData = productSalesMap.get(item.productId)!;
            productData.sales += item.quantity || 1;
            productData.revenue += (item.price || 0) * (item.quantity || 1);
            
            // Vendas por categoria
            const category = item.category || 'Sem categoria';
            if (!categorySalesMap.has(category)) {
              categorySalesMap.set(category, { sales: 0, revenue: 0 });
            }
            
            const categoryData = categorySalesMap.get(category)!;
            categoryData.sales += item.quantity || 1;
            categoryData.revenue += (item.price || 0) * (item.quantity || 1);
            
            // Total para percentuais
            totalSales += item.quantity || 1;
          });
          
          // Dados de clientes
          const customerId = order.userId;
          if (customerId) {
            if (!customerSalesMap.has(customerId)) {
              customerSalesMap.set(customerId, {
                name: order.customerName || 'Cliente',
                email: order.customerEmail || '-',
                orders: 0,
                totalSpent: 0,
                lastPurchase: ''
              });
            }
            
            const customerData = customerSalesMap.get(customerId)!;
            customerData.orders += 1;
            customerData.totalSpent += order.total || 0;
            customerData.lastPurchase = format(orderDate, 'dd/MM/yyyy', { locale: ptBR });
          }
        });
        
        // Converter mapas para arrays para exibição
        const sortedSalesData = Array.from(monthlySalesMap.values())
          .sort((a, b) => a.period.localeCompare(b.period));
        
        const sortedProductsData = Array.from(productSalesMap.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        
        const categoryData = Array.from(categorySalesMap.entries())
          .map(([name, data]) => ({
            name,
            sales: data.sales,
            percentage: totalSales > 0 ? Math.round((data.sales / totalSales) * 100) : 0
          }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 6);
        
        const customersData = Array.from(customerSalesMap.values())
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5);
        
        // Atualizar estado
        setSalesData(sortedSalesData);
        setTopProducts(sortedProductsData);
        setCategoryBreakdown(categoryData);
        setTopCustomers(customersData);
        
      } catch (error) {
        console.error("Erro ao carregar dados dos relatórios:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os relatórios. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [toast, dateRange]);
  
  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };
  
  // Dados para gráficos
  const revenueData = salesData.map(item => item.revenue);
  const ordersData = salesData.map(item => item.orders);
  const periodLabels = salesData.map(item => item.period);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análise de dados e desempenho da loja</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <DownloadCloud className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Formato</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Excel (.xlsx)</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FilePdf className="mr-2 h-4 w-4" />
                <span>PDF (.pdf)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
        </TabsList>
        
        {/* Aba de Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          {/* Cards resumo */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-28" />
                ) : (
                  <div className="text-2xl font-bold">
                    {formatCurrency(salesData.reduce((acc, item) => acc + item.revenue, 0))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {dateRange === '7days' ? 'Nos últimos 7 dias' :
                   dateRange === '30days' ? 'Nos últimos 30 dias' :
                   dateRange === '90days' ? 'Nos últimos 90 dias' : 'No último ano'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Realizados</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    {salesData.reduce((acc, item) => acc + item.orders, 0)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {dateRange === '7days' ? 'Nos últimos 7 dias' :
                   dateRange === '30days' ? 'Nos últimos 30 dias' :
                   dateRange === '90days' ? 'Nos últimos 90 dias' : 'No último ano'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      salesData.reduce((acc, item) => acc + item.revenue, 0) /
                      Math.max(salesData.reduce((acc, item) => acc + item.orders, 0), 1)
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Valor médio por pedido
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    {topProducts.reduce((acc, item) => acc + item.sales, 0)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Unidades vendidas
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráfico de vendas */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho de Vendas</CardTitle>
              <CardDescription>
                Receita e número de pedidos por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : revenueData.length > 0 ? (
                <div className="h-[250px]">
                  <SimpleBarChart 
                    data={revenueData} 
                    labels={periodLabels}
                    height={250}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  Nenhum dado disponível para o período selecionado
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Métricas adicionais em grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>
                  Top 5 produtos por volume de vendas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-5 w-full" />
                    ))}
                  </div>
                ) : topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {topProducts.map((product, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-5 mr-2 text-muted-foreground font-medium text-right">
                          {i + 1}.
                        </div>
                        <div className="flex-1 font-medium truncate">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sales} un.
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-6">
                    Nenhum produto vendido no período
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>
                  Participação de cada categoria nas vendas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : categoryBreakdown.length > 0 ? (
                  <SimplePieChart data={categoryBreakdown} />
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    Nenhum dado disponível para o período selecionado
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Aba de Vendas */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
              <CardDescription>
                Dados detalhados de vendas por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : salesData.length > 0 ? (
                    salesData.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.period}</TableCell>
                        <TableCell>{item.orders}</TableCell>
                        <TableCell>{formatCurrency(item.revenue)}</TableCell>
                        <TableCell>{formatCurrency(item.averageOrderValue)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Nenhum dado disponível para o período selecionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="ml-auto">
                <DownloadCloud className="mr-2 h-4 w-4" />
                Exportar Dados
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Pedidos</CardTitle>
              <CardDescription>
                Número de pedidos por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : ordersData.length > 0 ? (
                <div className="h-[250px]">
                  <SimpleBarChart 
                    data={ordersData} 
                    labels={periodLabels}
                    height={250}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  Nenhum dado disponível para o período selecionado
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba de Produtos */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho de Produtos</CardTitle>
              <CardDescription>
                Análise detalhada de vendas por produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Unidades Vendidas</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Estoque Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      </TableRow>
                    ))
                  ) : topProducts.length > 0 ? (
                    topProducts.map((product, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>{formatCurrency(product.revenue)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Nenhum dado disponível para o período selecionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Mostrando os 5 produtos mais vendidos no período selecionado
              </div>
              <Button variant="outline" className="ml-auto">
                <DownloadCloud className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>
                Participação de cada categoria nas vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {loading ? (
                    <Skeleton className="h-[200px] w-full" />
                  ) : categoryBreakdown.length > 0 ? (
                    <SimplePieChart data={categoryBreakdown} />
                  ) : (
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                      Nenhum dado disponível
                    </div>
                  )}
                </div>
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Vendas</TableHead>
                        <TableHead>%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          </TableRow>
                        ))
                      ) : categoryBreakdown.length > 0 ? (
                        categoryBreakdown.map((category, i) => (
                          <TableRow key={i}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.sales}</TableCell>
                            <TableCell>{category.percentage}%</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                            Nenhum dado disponível
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba de Clientes */}
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Melhores Clientes</CardTitle>
              <CardDescription>
                Clientes com maior volume de compras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Total Gasto</TableHead>
                    <TableHead>Última Compra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : topCustomers.length > 0 ? (
                    topCustomers.map((customer, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.orders}</TableCell>
                        <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                        <TableCell>{customer.lastPurchase}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhum dado disponível para o período selecionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Mostrando os 5 clientes com maior volume de compras
              </div>
              <Button variant="outline" className="ml-auto">
                <Share2 className="mr-2 h-4 w-4" />
                Exportar Lista
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 