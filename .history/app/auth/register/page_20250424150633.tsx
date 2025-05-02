"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    general?: string;
  }>({});

  const { user, signUp, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};

    if (!name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!email) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email inválido';
    }

    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }

    if (!agreeTerms) {
      errors.agreeTerms = 'Você deve concordar com os termos';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await signUp(email, password, name);
      // Redirect happens automatically in the AuthContext
    } catch (error) {
      console.error('Registration failed:', error);
      // Error handling is done in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      // Redirect happens automatically in the AuthContext
    } catch (error) {
      console.error('Google sign up failed:', error);
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
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Criar sua conta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Cadastre-se para acompanhar pedidos e salvar favoritos
        </p>
      </div>
      
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl">Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Google signup button */}
          <Button 
            variant="outline" 
            className="w-full mb-4 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            onClick={handleGoogleSignUp}
            disabled={isSubmitting}
          >
            <FaGoogle className="mr-2" />
            <span>Continuar com Google</span>
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">
                Ou cadastre-se com email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className={`pl-10 ${validationErrors.name ? 'border-red-500' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
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
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
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
                    <FaEyeSlash className="text-gray-400" /> : 
                    <FaEye className="text-gray-400" />
                  }
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button 
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? 
                    <FaEyeSlash className="text-gray-400" /> : 
                    <FaEye className="text-gray-400" />
                  }
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                  disabled={isSubmitting}
                  className={validationErrors.agreeTerms ? 'border-red-500' : ''}
                />
                <Label htmlFor="terms" className="text-sm leading-tight">
                  Eu concordo com os <Link href="/terms" className="text-[#08a4a7] hover:underline">Termos de Uso</Link> e com a <Link href="/privacy" className="text-[#08a4a7] hover:underline">Política de Privacidade</Link>
                </Label>
              </div>
              {validationErrors.agreeTerms && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.agreeTerms}</p>
              )}
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
              Criar conta
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Ao criar uma conta, você concorda em receber emails sobre nossos produtos e serviços.
            </p>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-center text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/auth/login" className="text-[#08a4a7] hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 