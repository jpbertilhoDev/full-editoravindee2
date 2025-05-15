"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { locales } from "@/lib/i18n-config";

// Schema para validação do formulário
const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Schema para validação de notificações
const notificationsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  productUpdates: z.boolean().default(true),
});

type NotificationFormValues = z.infer<typeof notificationsSchema>;

export default function SettingsAccountPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || "profile");
  
  // Atualizar a tab ativa quando o parâmetro mudar
  useEffect(() => {
    if (tabParam && ['profile', 'language', 'notifications'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Simulação de valores iniciais do perfil
  const defaultProfile = {
    name: "Administrador",
    email: "admin@editoravinde.com.br",
    bio: "Gerenciando a loja online da Editora Vinde.",
  };

  // Simulação de valores iniciais de notificações
  const defaultNotifications = {
    emailNotifications: true,
    marketingEmails: false,
    productUpdates: true,
  };

  // Inicializar formulário de perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultProfile,
  });

  // Inicializar formulário de notificações
  const notificationsForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: defaultNotifications,
  });

  // Função de envio do formulário de perfil
  function onProfileSubmit(data: ProfileFormValues) {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações de perfil foram atualizadas com sucesso.",
    });
    console.log(data);
  }

  // Função de envio do formulário de notificações
  function onNotificationsSubmit(data: NotificationFormValues) {
    toast({
      title: "Preferências atualizadas",
      description: "Suas preferências de notificação foram atualizadas com sucesso.",
    });
    console.log(data);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Conta</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências de conta, incluindo idioma e notificações.
          </p>
        </div>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="language">Idioma</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e de contato.
                </CardDescription>
              </CardHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="exemplo@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biografia</FormLabel>
                          <FormControl>
                            <Input placeholder="Sobre você" {...field} />
                          </FormControl>
                          <FormDescription>
                            Breve descrição para seu perfil. Máximo de 160 caracteres.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit">Salvar alterações</Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
          
          <TabsContent value="language" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Idioma</CardTitle>
                <CardDescription>
                  Defina seu idioma preferencial para a interface do administrador.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Idioma da interface</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecione o idioma que deseja usar no painel administrativo.
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <LanguageSwitcher variant="expanded" className="w-full" />
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium mb-2">Idiomas disponíveis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {locales.map((locale) => (
                          <div key={locale.code} className="flex items-center p-3 rounded-md border">
                            <div className="text-2xl mr-3">{locale.flag}</div>
                            <div>
                              <div className="font-medium">{locale.name}</div>
                              <div className="text-sm text-muted-foreground">{locale.code.toUpperCase()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando você deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                  <CardContent className="space-y-6">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificações por email</FormLabel>
                            <FormDescription>
                              Receba emails sobre atividades importantes na loja.
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
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Emails de marketing</FormLabel>
                            <FormDescription>
                              Receba atualizações sobre promoções e novos produtos.
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
                      name="productUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Atualizações de produtos</FormLabel>
                            <FormDescription>
                              Notificações sobre mudanças em produtos e inventário.
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
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit">Salvar preferências</Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 