"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, Globe, Lock, Settings, User, Bell, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { t } = useTranslation();

  // Configurações disponíveis
  const settingsSections = [
    {
      title: "Conta",
      description: "Gerencie suas informações de perfil e preferências",
      icon: <User className="h-6 w-6 mb-2" />,
      href: "/admin/settings/account",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Segurança",
      description: "Configure senhas e opções de autenticação",
      icon: <Lock className="h-6 w-6 mb-2" />,
      href: "/admin/settings/security",
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Aparência",
      description: "Personalize o visual do painel administrativo",
      icon: <Palette className="h-6 w-6 mb-2" />,
      href: "/admin/settings/appearance",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Idioma e Região",
      description: "Configure o idioma e as opções regionais",
      icon: <Globe className="h-6 w-6 mb-2" />,
      href: "/admin/settings/account?tab=language",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Notificações",
      description: "Gerencie como você recebe alertas e atualizações",
      icon: <Bell className="h-6 w-6 mb-2" />,
      href: "/admin/settings/account?tab=notifications",
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Configurações Gerais",
      description: "Outras opções e configurações da loja",
      icon: <Settings className="h-6 w-6 mb-2" />,
      href: "/admin/settings/general",
      color: "bg-gray-100 text-gray-700",
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações para o painel administrativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section) => (
            <Link href={section.href} key={section.title} className="block">
              <Card className="h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className={`inline-flex p-2 rounded-md ${section.color}`}>
                    {section.icon}
                  </div>
                  <CardTitle className="mt-4">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between group">
                    <span>Acessar</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 