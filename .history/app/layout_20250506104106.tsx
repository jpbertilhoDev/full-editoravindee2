import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ui/error-boundary';
import { TranslationProvider } from '@/lib/TranslationProvider';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from './providers';
import { cookies } from 'next/headers';
import MobileNav from '@/components/layout/MobileNav';

// Dynamic imports para componentes não críticos
const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });
const TranslationStatus = dynamic(() => import('@/components/ui/TranslationStatus'), { ssr: false });

// Para garantir que o i18n seja carregado corretamente no SSR
import './i18n';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Editora Vinde',
    default: 'Editora Vinde - Livros Cristãos',
  },
  description: 'Editora de livros cristãos com conteúdo relevante para edificação da fé',
  metadataBase: new URL('https://www.editoravinde.com.br'),
  keywords: ['livros cristãos', 'editora cristã', 'literatura cristã', 'livros evangélicos'],
  authors: [{ name: 'Editora Vinde' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Editora Vinde',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");

  return (
    <html lang="pt" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <TranslationProvider>
          <ThemeProvider forcedTheme={theme?.value === "dark" ? "dark" : "light"}>
            <ErrorBoundary>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Providers>
                      <Header />
                      <MobileNav />
                      <main className="flex-1">
                        {children}
                      </main>
                      <Footer />
                      <TranslationStatus />
                    </Providers>
                    <Toaster />
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  );
}