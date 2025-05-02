"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    // Simular um atraso de autenticação
    setTimeout(() => {
      console.log("Login data:", data);
      // Aqui você implementaria a lógica real de autenticação
      // Nesta demonstração, vamos apenas redirecionar para o dashboard
      router.push('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden rounded-2xl shadow-xl">
        {/* Coluna da Imagem e Mensagem */}
        <div className="hidden md:block relative bg-gradient-to-br from-[#08a4a7] to-[#0bdbb6] p-8 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bem-vindo à Grace Bookstore</h1>
              <p className="text-white/80">
                Acesse sua conta para gerenciar seus pedidos, favoritos e dados pessoais
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="italic text-sm text-white/90 mb-2">
                  "Os livros são a companhia mais tranquila e constante, e os professores mais pacientes."
                </p>
                <p className="text-xs text-white/70 text-right">— Charles W. Eliot</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Lock className="h-4 w-4" />
                </div>
                <p className="text-sm text-white/80">Seus dados estão protegidos com criptografia</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formulário de Login */}
        <div className="bg-white p-8 md:p-10">
          <div className="text-center mb-6 md:text-left">
            <Link href="/" className="inline-block mb-8">
              <div className="w-[120px] h-[50px] relative my-auto">
                <Image 
                  src="/images/logo-vindee.svg" 
                  alt="Vindee"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            <h2 className="text-2xl font-semibold text-gray-800">Faça seu login</h2>
            <p className="text-sm text-gray-500 mt-1">
              Não tem uma conta? <Link href="/auth/register" className="text-[#08a4a7] font-medium hover:underline">Cadastre-se</Link>
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="seu@email.com"
                          className="pl-10"
                          {...field}
                        />
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10"
                          {...field}
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between pt-2">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Lembrar de mim
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <Link href="/auth/forgot-password" className="text-sm text-[#08a4a7] hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#08a4a7] hover:bg-[#0bdbb6] text-white p-6 mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-500">
              Ao fazer login, você concorda com nossos <Link href="/terms" className="text-[#08a4a7] hover:underline">Termos de Uso</Link> e <Link href="/privacy" className="text-[#08a4a7] hover:underline">Política de Privacidade</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 