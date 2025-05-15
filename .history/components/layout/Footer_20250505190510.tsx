"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <Link href="/" className="inline-block">
              <div className="flex items-center">
                <span className="text-xl font-bold">Vinde</span>
                <span className="text-xl font-bold text-[#08a4a7]">Europa</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              {t('footer.description', {
                defaultValue: 'Publicando literatura cristã de qualidade para transformar vidas e fortalecer a fé.'
              })}
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[#08a4a7] hover:text-white transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[#08a4a7] hover:text-white transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[#08a4a7] hover:text-white transition-colors"
              >
                <Twitter size={16} />
              </a>
              <div className="ml-2">
                <LanguageSwitcher variant="minimal" />
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              {t('footer.company')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  {t('footer.careers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              {t('footer.help')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-[#08a4a7] transition-colors"
                >
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              {t('footer.newsletter')}
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              {t('footer.newsletter_description', {
                defaultValue: 'Receba novidades, lançamentos e ofertas exclusivas.'
              })}
            </p>
            <form className="mt-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder={t('footer.newsletterPlaceholder')}
                  className="flex-1 rounded-full bg-white border-gray-300 focus-visible:ring-[#08a4a7]"
                  required
                />
                <Button type="submit" className="rounded-full bg-[#08a4a7] hover:bg-[#078e91] text-white">
                  {t('footer.subscribe')}
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {t('home.newsletter.privacyNote')}
              </p>
            </form>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Editora Vinde Europa. {t('footer.rights_reserved')}
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}