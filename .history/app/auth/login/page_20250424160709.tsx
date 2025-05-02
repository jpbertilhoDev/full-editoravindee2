"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Chrome } from 'lucide-react'; // For Google icon
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { user, signIn, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    // Redirect if already logged in
    if (user && !loading) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  const validateForm = () => {
    const errors: {
      email?: string;
      password?: string;
    } = {};

    if (!email) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email inválido';
    }

    if (!password) {
      errors.password = 'Senha é obrigatória';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
      // Redirect happens automatically in the AuthContext
    } catch (error) {
      console.error('Login failed:', error);
      // Error handling is done in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      // Redirect happens automatically in the AuthContext
    } catch (error) {
      console.error('Google login failed:', error);
      // Error handling is done in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // If checking authentication status, show loading
  if (loading && !isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If already logged in, don't render the form
  if (user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-6 text-center">
        <Link href="/">
          <div className="relative w-32 h-12 mx-auto mb-2">
            <Image
              src="/images/logo-vindee.svg"
              alt="Vindee"
              fill
              className="object-contain"
            />
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Entrar na sua conta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Acesse para gerenciar seus pedidos e preferências
        </p>
      </div>
      
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Google login button */}
          <Button 
            variant="outline" 
            className="w-full mb-4 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <Chrome className="h-4 w-4 mr-2" />
            <span>Continuar com Google</span>
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">
                Ou continue com email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/auth/forgot-password" className="text-xs text-[#08a4a7] hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button 
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={isSubmitting}
                >
                  {showPassword ? 
                    <EyeOff className="h-4 w-4 text-gray-400" /> : 
                    <Eye className="h-4 w-4 text-gray-400" />
                  }
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={() => setRememberMe(!rememberMe)}
                disabled={isSubmitting}
              />
              <Label htmlFor="remember" className="text-sm">Lembrar de mim</Label>
            </div>

            {validationErrors.general && (
              <p className="text-red-500 text-sm text-center">{validationErrors.general}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-[#08a4a7] hover:bg-[#0bdbb6]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-center text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/auth/register" className="text-[#08a4a7] hover:underline font-medium">
              Criar conta
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 