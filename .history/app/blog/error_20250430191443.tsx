'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
              Blog
            </span>
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-destructive/10 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-4">Ocorreu um erro</h2>
            
            <p className="text-muted-foreground text-center mb-6">
              {error.message || 'Ocorreu um erro ao carregar o blog. Por favor, tente novamente.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default" 
                onClick={reset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
              
              <Button 
                variant="outline" 
                asChild
              >
                <Link href="/">
                  Voltar para o início
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 