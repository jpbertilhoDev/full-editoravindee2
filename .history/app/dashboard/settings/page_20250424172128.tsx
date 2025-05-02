"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Bell, 
  Shield, 
  Paintbrush, 
  Save, 
  RefreshCw, 
  Check,
  Info,
  Mail,
  MessageSquare
} from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Schemas de validação
const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  orderUpdates: z.boolean(),
  newReleases: z.boolean(),
  promotions: z.boolean(),
  newsletter: z.boolean(),
});

const privacyFormSchema = z.object({
  dataSharing: z.boolean(),
  activityTracking: z.boolean(),
  savePaymentInfo: z.boolean(),
  saveSearchHistory: z.boolean(),
});

const appearanceFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  fontSize: z.enum(['small', 'medium', 'large']),
  colorScheme: z.enum(['default', 'contrast', 'colorful']),
});

// Tipos para os formulários
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type PrivacyFormValues = z.infer<typeof privacyFormSchema>;
type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Formulário de Notificações
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      orderUpdates: true,
      newReleases: true,
      promotions: false,
      newsletter: false,
    },
  });
  
  // Formulário de Privacidade
  const privacyForm = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      dataSharing: false,
      activityTracking: true,
      savePaymentInfo: true,
      saveSearchHistory: true,
    },
  });
  
  // Formulário de Aparência
  const appearanceForm = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: 'system',
      fontSize: 'medium',
      colorScheme: 'default',
    },
  });
  
  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    if (user) {
      // Carregar configurações do Firestore
      const loadUserSettings = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Carregar configurações de notificações se existirem
            if (userData.settings?.notifications) {
              notificationsForm.reset(userData.settings.notifications);
            }
            
            // Carregar configurações de privacidade se existirem
            if (userData.settings?.privacy) {
              privacyForm.reset(userData.settings.privacy);
            }
            
            // Carregar configurações de aparência se existirem
            if (userData.settings?.appearance) {
              appearanceForm.reset(userData.settings.appearance);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar configurações:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar suas configurações. Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
      };
      
      loadUserSettings();
    }
  }, [user, notificationsForm, privacyForm, appearanceForm]);
  
  // Manipuladores de envio dos formulários
  const onNotificationsSubmit = async (data: NotificationsFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Atualizar configurações no Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        "settings.notifications": data,
        updatedAt: new Date()
      });
      
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar suas configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onPrivacySubmit = async (data: PrivacyFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Atualizar configurações no Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        "settings.privacy": data,
        updatedAt: new Date()
      });
      
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências de privacidade foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar suas configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onAppearanceSubmit = async (data: AppearanceFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Atualizar configurações no Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        "settings.appearance": data,
        updatedAt: new Date()
      });
      
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências de aparência foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar suas configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">Personalize suas preferências de conta e experiência</p>
      </div>
      
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Privacidade</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Paintbrush className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Aparência</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="pb-8">
          <TabsContent value="notifications" className="mt-0">
            <div className="space-y-6">
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-[#08a4a7]" />
                      Notificações por Email
                    </h3>
                    
                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <FormField
                            control={notificationsForm.control}
                            name="emailNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Notificações por Email</FormLabel>
                                  <FormDescription>
                                    Receber notificações via email
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="orderUpdates"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Atualizações de Pedidos</FormLabel>
                                  <FormDescription>
                                    Receber atualizações sobre o status dos seus pedidos
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="newReleases"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Novos Lançamentos</FormLabel>
                                  <FormDescription>
                                    Receber notificações sobre novos lançamentos de livros
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="promotions"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Promoções</FormLabel>
                                  <FormDescription>
                                    Receber ofertas exclusivas e promoções
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="newsletter"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Newsletter</FormLabel>
                                  <FormDescription>
                                    Receber nossa newsletter mensal com novidades
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#08a4a7] hover:bg-[#08a4a7]/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="mt-0">
            <div className="space-y-6">
              <Form {...privacyForm}>
                <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-[#08a4a7]" />
                      Configurações de Privacidade
                    </h3>
                    
                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <FormField
                            control={privacyForm.control}
                            name="dataSharing"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Compartilhamento de Dados</FormLabel>
                                  <FormDescription>
                                    Permitir compartilhamento de dados com parceiros para melhorar recomendações
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={privacyForm.control}
                            name="activityTracking"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Rastreamento de Atividade</FormLabel>
                                  <FormDescription>
                                    Permitir o rastreamento da sua atividade no site para uma experiência personalizada
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={privacyForm.control}
                            name="savePaymentInfo"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Salvar Informações de Pagamento</FormLabel>
                                  <FormDescription>
                                    Salvar informações de pagamento para compras futuras
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={privacyForm.control}
                            name="saveSearchHistory"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Histórico de Pesquisa</FormLabel>
                                  <FormDescription>
                                    Salvar seu histórico de pesquisa para melhores recomendações
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#08a4a7] hover:bg-[#08a4a7]/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-0">
            <div className="space-y-6">
              <Form {...appearanceForm}>
                <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Paintbrush className="h-5 w-5 mr-2 text-[#08a4a7]" />
                      Configurações de Aparência
                    </h3>
                    
                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <div className="space-y-6">
                          <FormField
                            control={appearanceForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Tema</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="system" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Sistema (usar configuração do dispositivo)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="light" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Claro
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="dark" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Escuro
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Separator />
                          
                          <FormField
                            control={appearanceForm.control}
                            name="fontSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tamanho da Fonte</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um tamanho" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="small">Pequeno</SelectItem>
                                    <SelectItem value="medium">Médio</SelectItem>
                                    <SelectItem value="large">Grande</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Ajuste o tamanho da fonte para a melhor leitura
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={appearanceForm.control}
                            name="colorScheme"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Esquema de Cores</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um esquema" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="default">Padrão</SelectItem>
                                    <SelectItem value="contrast">Alto Contraste</SelectItem>
                                    <SelectItem value="colorful">Colorido</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Escolha o esquema de cores que melhor se adapta às suas necessidades
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#08a4a7] hover:bg-[#08a4a7]/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
      
      {/* Informações de privacidade */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Sobre suas configurações</p>
              <p className="text-sm text-blue-700 mt-1">
                Suas configurações são aplicadas apenas à sua conta e podem ser alteradas a qualquer momento. 
                Revisamos regularmente nossa política de privacidade para garantir a proteção dos seus dados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 