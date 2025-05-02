import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ui/error-boundary';
import { Analytics } from '@vercel/analytics/react';

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
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload de fontes comuns para melhorar o LCP */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
        />
        
        {/* Prefetch de páginas principais */}
        <link rel="prefetch" href="/blog" />
        <link rel="prefetch" href="/products" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          <ErrorBoundary>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <div className="flex min-h-screen flex-col">
                    <ErrorBoundary>
                      <Header />
                    </ErrorBoundary>
                    <main className="flex-1">
                      <ErrorBoundary>
                        {children}
                      </ErrorBoundary>
                    </main>
                    <ErrorBoundary>
                      <Footer />
                    </ErrorBoundary>
                  </div>
                  <Toaster />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ErrorBoundary>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}