"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/components/cart/CartContext";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { CN_HEADER_LINK } from "@/lib/constants/classes";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <span className="text-2xl font-bold">Vinde</span>
              <span className="text-2xl font-bold text-[#08a4a7]">Europa</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <Link
              href="/"
              className={`${CN_HEADER_LINK} ${
                pathname === "/" ? "text-[#08a4a7]" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`${CN_HEADER_LINK} ${
                pathname.startsWith("/products") ? "text-[#08a4a7]" : ""
              }`}
            >
              {/* Livros -> Books */}
              Livros
            </Link>
            <Link
              href="/about"
              className={`${CN_HEADER_LINK} ${
                pathname === "/about" ? "text-[#08a4a7]" : ""
              }`}
            >
              {/* Sobre -> About */}
              Sobre
            </Link>
            <Link
              href="/contact"
              className={`${CN_HEADER_LINK} ${
                pathname === "/contact" ? "text-[#08a4a7]" : ""
              }`}
            >
              {/* Contato -> Contact */}
              Contato
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder={t('header.search')}
                className="w-[200px] xl:w-[250px] h-9 pl-8 rounded-full bg-gray-50"
              />
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            
            <LanguageSwitcher className="border border-gray-200 hover:border-[#08a4a7]" />

            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                aria-label={t('header.wishlist')}
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  >
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                aria-label={t('header.cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-[#08a4a7] text-[#08a4a7] hover:bg-[#08a4a7] hover:text-white transition-colors"
              >
                {t('header.login')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                aria-label={t('header.cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? t('accessibility.close_menu') : t('accessibility.open_menu')}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container px-4 mx-auto py-4 space-y-4">
            <div className="relative">
              <Input
                type="search"
                placeholder={t('header.search')}
                className="w-full h-9 pl-8 rounded-full bg-gray-50"
              />
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            
            <div className="flex justify-center w-full py-2">
              <LanguageSwitcher className="border border-gray-200 hover:border-[#08a4a7]" />
            </div>
            
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`${CN_HEADER_LINK} block py-2 ${
                  pathname === "/" ? "text-[#08a4a7]" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`${CN_HEADER_LINK} block py-2 ${
                  pathname.startsWith("/products") ? "text-[#08a4a7]" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Livros
              </Link>
              <Link
                href="/about"
                className={`${CN_HEADER_LINK} block py-2 ${
                  pathname === "/about" ? "text-[#08a4a7]" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/contact"
                className={`${CN_HEADER_LINK} block py-2 ${
                  pathname === "/contact" ? "text-[#08a4a7]" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
            </nav>
            
            <div className="flex items-center justify-between pt-2">
              <Link href="/wishlist" className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>{t('header.wishlist')}</span>
                {wishlistItems.length > 0 && (
                  <Badge variant="destructive">{wishlistItems.length}</Badge>
                )}
              </Link>
              
              <LanguageSwitcher variant="minimal" />
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/login" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full border-[#08a4a7] text-[#08a4a7] hover:bg-[#08a4a7] hover:text-white transition-colors"
                >
                  {t('header.login')}
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full rounded-full bg-[#08a4a7] hover:bg-[#078e91] transition-colors"
                >
                  {t('header.register')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;