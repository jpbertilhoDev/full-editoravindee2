import React, { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Carregamento dinâmico do componente cliente para melhor performance
const CheckoutClient = dynamic(() => import('./CheckoutClient'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#08a4a7]" />
        <p className="text-sm text-gray-500">Carregando checkout...</p>
      </div>
    </div>
  ),
  ssr: false // Desativa SSR para este componente para melhor performance inicial
});

export const metadata: Metadata = {
  title: 'Checkout | Grace Bookstore',
  description: 'Complete sua compra com segurança',
};

export default function CheckoutPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#08a4a7]" />
            <p className="text-sm text-gray-500">Carregando checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
} 