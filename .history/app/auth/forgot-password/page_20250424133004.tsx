"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { toast } from '@/components/ui/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    
    // Simular um atraso de envio
    setTimeout(() => {
      console.log("Recovery email:", data.email);
      // Aqui você implementaria a lógica real de envio de email de recuperação
      
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
      
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden rounded-lg shadow-xl">
          <CardHeader className="bg-gradient-to-br from-[#08a4a7] to-[#0bdbb6] text-white p-8">
            <div className="flex justify-between items-start mb-4">
              <Link href="/auth/login" className="text-white hover:text-white/80 inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o login
              </Link>
              <div className="w-[100px] h-[40px] relative">
                <Image 
                  src="/images/logo-vindee.svg" 
                  alt="Vindee"
                  fill
                  className="object-contain filter brightness-0 invert"
                  priority
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-white/80 mt-1">
              Digite seu email para redefinir sua senha.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Verifique seu email</h3>
                <p className="text-gray-500 mb-6">
                  Enviamos um link para {form.getValues().email} com instruções para redefinir sua senha.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSubmitted(false)}
                >
                  Tentar com outro email
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                              type="email"
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
                        Enviando...
                      </div>
                    ) : (
                      "Enviar link de recuperação"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          
          <CardFooter className="p-6 pt-0 text-center">
            <p className="text-sm text-gray-500">
              Lembrou sua senha? <Link href="/auth/login" className="text-[#08a4a7] font-medium hover:underline">Faça login</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 