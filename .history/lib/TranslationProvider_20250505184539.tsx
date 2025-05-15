"use client";

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Recursos de tradução iniciais - podem ser expandidos com mais idiomas e chaves
const resources = {
  en: {
    translation: {
      // Cabeçalho
      header: {
        search: "Search books...",
        cart: "Cart",
        wishlist: "Wishlist",
        account: "My Account",
        login: "Login",
        register: "Register",
      },
      // Rodapé
      footer: {
        about: "About Us",
        contact: "Contact",
        shipping: "Shipping Information",
        returns: "Returns & Exchanges",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        newsletter: "Subscribe to our newsletter",
        newsletterPlaceholder: "Your email address",
        subscribe: "Subscribe",
        copyright: "© 2024 Editora Vinde Europa. All rights reserved.",
      },
      // Página inicial
      home: {
        hero: {
          title: "Discover the best Christian literature",
          subtitle: "Find books that will transform your life and spiritual journey",
          callToAction: "Shop now",
        },
        featured: {
          title: "Featured Books",
          viewAll: "View all",
        },
        bestsellers: {
          title: "Bestsellers",
          subtitle: "The most loved books by our readers",
          viewAll: "View all bestsellers",
        },
        categories: {
          title: "Browse by Category",
          viewAll: "All Categories",
        },
        newsletter: {
          title: "Join Our Newsletter",
          subtitle: "Get updates on new releases and special promotions",
          placeholder: "Your email address",
          button: "Subscribe",
          privacyNote: "We respect your privacy. Unsubscribe at any time.",
        },
      },
      // Botões
      buttons: {
        addToCart: "Add to Cart",
        viewDetails: "View Details",
        buyNow: "Buy Now",
        outOfStock: "Out of Stock",
        addToWishlist: "Add to Wishlist",
        removeFromWishlist: "Remove from Wishlist",
      },
      // Detalhes do produto
      product: {
        sku: "SKU",
        author: "Author",
        category: "Category",
        availability: "Availability",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        description: "Description",
        relatedProducts: "You may also like",
        reviews: "Customer Reviews",
        writeReview: "Write a Review",
      },
      // Carrinho
      cart: {
        title: "Your Cart",
        empty: "Your cart is empty",
        continueShopping: "Continue Shopping",
        subtotal: "Subtotal",
        shipping: "Shipping",
        tax: "Tax",
        total: "Total",
        checkout: "Proceed to Checkout",
        remove: "Remove",
        quantity: "Quantity",
      },
    },
  },
  pt: {
    translation: {
      // Cabeçalho
      header: {
        search: "Buscar livros...",
        cart: "Carrinho",
        wishlist: "Favoritos",
        account: "Minha Conta",
        login: "Entrar",
        register: "Cadastrar",
      },
      // Rodapé
      footer: {
        about: "Sobre Nós",
        contact: "Contato",
        shipping: "Informações de Envio",
        returns: "Trocas e Devoluções",
        privacy: "Política de Privacidade",
        terms: "Termos de Serviço",
        newsletter: "Assine nossa newsletter",
        newsletterPlaceholder: "Seu endereço de email",
        subscribe: "Assinar",
        copyright: "© 2024 Editora Vinde Europa. Todos os direitos reservados.",
      },
      // Página inicial
      home: {
        hero: {
          title: "Descubra a melhor literatura cristã",
          subtitle: "Encontre livros que transformarão sua vida e jornada espiritual",
          callToAction: "Comprar agora",
        },
        featured: {
          title: "Livros em Destaque",
          viewAll: "Ver todos",
        },
        bestsellers: {
          title: "Mais Vendidos",
          subtitle: "Os livros mais amados pelos nossos leitores",
          viewAll: "Ver todos os mais vendidos",
        },
        categories: {
          title: "Navegar por Categoria",
          viewAll: "Todas as Categorias",
        },
        newsletter: {
          title: "Assine Nossa Newsletter",
          subtitle: "Receba atualizações sobre novos lançamentos e promoções especiais",
          placeholder: "Seu endereço de email",
          button: "Assinar",
          privacyNote: "Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.",
        },
      },
      // Botões
      buttons: {
        addToCart: "Adicionar ao Carrinho",
        viewDetails: "Ver Detalhes",
        buyNow: "Comprar Agora",
        outOfStock: "Esgotado",
        addToWishlist: "Adicionar aos Favoritos",
        removeFromWishlist: "Remover dos Favoritos",
      },
      // Detalhes do produto
      product: {
        sku: "Código",
        author: "Autor",
        category: "Categoria",
        availability: "Disponibilidade",
        inStock: "Em Estoque",
        outOfStock: "Esgotado",
        description: "Descrição",
        relatedProducts: "Você também pode gostar",
        reviews: "Avaliações dos Clientes",
        writeReview: "Escrever uma Avaliação",
      },
      // Carrinho
      cart: {
        title: "Seu Carrinho",
        empty: "Seu carrinho está vazio",
        continueShopping: "Continuar Comprando",
        subtotal: "Subtotal",
        shipping: "Frete",
        tax: "Impostos",
        total: "Total",
        checkout: "Finalizar Compra",
        remove: "Remover",
        quantity: "Quantidade",
      },
    },
  },
  de: {
    translation: {
      // Cabeçalho simplificado
      header: {
        search: "Bücher suchen...",
        cart: "Warenkorb",
        wishlist: "Wunschliste",
        account: "Mein Konto",
        login: "Anmelden",
        register: "Registrieren",
      },
      // Rodapé simplificado
      footer: {
        about: "Über uns",
        contact: "Kontakt",
        newsletter: "Abonnieren Sie unseren Newsletter",
        subscribe: "Abonnieren",
        copyright: "© 2024 Editora Vinde Europa. Alle Rechte vorbehalten.",
      },
      // Botões essenciais
      buttons: {
        addToCart: "In den Warenkorb",
        viewDetails: "Details anzeigen",
        buyNow: "Jetzt kaufen",
        outOfStock: "Nicht auf Lager",
      },
      // Carrinho simplificado
      cart: {
        title: "Ihr Warenkorb",
        empty: "Ihr Warenkorb ist leer",
        subtotal: "Zwischensumme",
        total: "Gesamtsumme",
        checkout: "Zur Kasse",
      },
    },
  },
  fr: {
    translation: {
      // Cabeçalho simplificado
      header: {
        search: "Rechercher des livres...",
        cart: "Panier",
        wishlist: "Favoris",
        account: "Mon Compte",
        login: "Connexion",
        register: "S'inscrire",
      },
      // Rodapé simplificado
      footer: {
        about: "À propos de nous",
        contact: "Contact",
        newsletter: "Abonnez-vous à notre newsletter",
        subscribe: "S'abonner",
        copyright: "© 2024 Editora Vinde Europa. Tous droits réservés.",
      },
      // Botões essenciais
      buttons: {
        addToCart: "Ajouter au panier",
        viewDetails: "Voir les détails",
        buyNow: "Acheter maintenant",
        outOfStock: "Rupture de stock",
      },
      // Carrinho simplificado
      cart: {
        title: "Votre Panier",
        empty: "Votre panier est vide",
        subtotal: "Sous-total",
        total: "Total",
        checkout: "Passer à la caisse",
      },
    },
  },
};

// Inicialização do i18n com React e detector de idioma
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'pt', // Idioma padrão se a detecção falhar
    supportedLngs: ['pt', 'en', 'de', 'fr'],
    interpolation: {
      escapeValue: false, // React já escapa por padrão
    },
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage', 'cookie'],
      cookieExpirationDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 anos
    },
  });

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  useEffect(() => {
    // Inicialização adicional, se necessário
    // Por exemplo, carregar dinamicamente mais traduções
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 