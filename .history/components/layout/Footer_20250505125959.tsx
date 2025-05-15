import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-petrol/10 dark:bg-brand-dark-blue dark:border-brand-petrol/20">
      <div className="container mx-auto px-4 py-12">
        {/* Logo and brand section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-[200px] h-[80px] relative mb-4">
            <Image 
              src="/images/logo-vinde-europa.svg" 
              alt="Editora Vinde Europa"
              fill
              className="object-contain"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/logo-vinde-europa-light.png';
              }}
            />
          </div>
          <p className="text-center text-muted-foreground text-sm max-w-md">
            Providing inspiring Christian literature to strengthen your faith journey since 1998.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-brand-petrol">About Us</h3>
            <p className="text-muted-foreground text-sm">
              Editora Vinde Europa is committed to publishing high-quality Christian literature that inspires, educates, and strengthens faith.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-brand-petrol transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-brand-petrol transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-brand-petrol transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-brand-petrol mb-4">Books</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/products/category/bibles" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  Bibles
                </Link>
              </li>
              <li>
                <Link href="/products/category/devotionals" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  Devotionals
                </Link>
              </li>
              <li>
                <Link href="/products/category/children" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  Children's Books
                </Link>
              </li>
              <li>
                <Link href="/products/category/bestsellers" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/products/category/new-releases" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-brand-petrol mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-brand-petrol transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-brand-petrol mb-4">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Stay updated with our latest releases, special offers, and devotional insights.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white dark:bg-brand-dark-blue/50 border-brand-petrol/20 focus:border-brand-petrol focus-visible:ring-brand-mint"
              />
              <Button className="w-full bg-brand-petrol hover:bg-brand-mint hover:text-brand-dark-blue text-white transition-colors duration-300">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-brand-petrol/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Editora Vinde Europa. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <img src="/images/payment-methods.png" alt="Payment Methods" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;