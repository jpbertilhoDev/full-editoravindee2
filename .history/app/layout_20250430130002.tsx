import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ui/error-boundary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Grace Bookstore | Christian Books and Literature',
  description: 'Discover spiritual growth through our collection of Christian books, Bibles, devotionals, and faith-based literature.',
  keywords: 'Christian books, Christian bookstore, Bibles, devotionals, religious books, faith literature',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gracebookstore.com',
    title: 'Grace Bookstore | Christian Books and Literature',
    description: 'Discover spiritual growth through our collection of Christian books, Bibles, devotionals, and faith-based literature.',
    siteName: 'Grace Bookstore',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
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
        </ThemeProvider>
      </body>
    </html>
  );
}