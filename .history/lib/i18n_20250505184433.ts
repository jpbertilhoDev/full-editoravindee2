import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traduções iniciais - começando com apenas o mínimo necessário
// As traduções serão expandidas gradualmente
const resources = {
  en: {
    translation: {
      // Cabeçalho
      "header.home": "Home",
      "header.books": "Books",
      "header.blog": "Blog",
      "header.about": "About Us",
      "header.contact": "Contact",
      "header.search_placeholder": "Search books...",
      "header.wishlist": "Wishlist",
      "header.cart": "Cart",
      "header.account": "My Account",
      "header.sign_in": "Sign In",
      "header.sign_out": "Sign Out",
      
      // Rodapé
      "footer.rights_reserved": "All rights reserved",
      "footer.about_us": "About Us",
      "footer.contact": "Contact",
      "footer.terms": "Terms & Conditions",
      "footer.privacy": "Privacy Policy",
      
      // Home page
      "home.featured_books": "Featured Books",
      "home.bestsellers": "Bestsellers",
      "home.categories": "Browse Categories",
      "home.view_all": "View All",
      
      // Botões e ações
      "actions.add_to_cart": "Add to Cart",
      "actions.add": "Add",
      "actions.buy_now": "Buy Now",
      "actions.shop_now": "Shop Now",
      "actions.remove": "Remove",
      "actions.view_details": "View Details",
      "actions.view_product": "View {{product}}",
      "actions.checkout": "Checkout",
      
      // Produto
      "product.bestseller": "Bestseller",
      "product.new": "New",
      "product.off": "{{percent}}% OFF",
      "product.rating": "{{rating}} out of 5 stars",
      "product.reviews": "{{count}} reviews",
      "product.by_author": "by {{author}}",
      
      // Carrinho
      "cart.your_cart": "Your Cart",
      "cart.empty": "Your cart is empty",
      "cart.items": "{{count}} items",
      "cart.item": "{{count}} item",
      "cart.subtotal": "Subtotal",
      "cart.shipping": "Shipping",
      "cart.total": "Total",
      "cart.proceed_to_checkout": "Proceed to Checkout",
    }
  },
  pt: {
    translation: {
      // Cabeçalho
      "header.home": "Início",
      "header.books": "Livros",
      "header.blog": "Blog",
      "header.about": "Sobre Nós",
      "header.contact": "Contato",
      "header.search_placeholder": "Buscar livros...",
      "header.wishlist": "Favoritos",
      "header.cart": "Carrinho",
      "header.account": "Minha Conta",
      "header.sign_in": "Entrar",
      "header.sign_out": "Sair",
      
      // Rodapé
      "footer.rights_reserved": "Todos os direitos reservados",
      "footer.about_us": "Sobre Nós",
      "footer.contact": "Contato",
      "footer.terms": "Termos e Condições",
      "footer.privacy": "Política de Privacidade",
      
      // Home page
      "home.featured_books": "Livros em Destaque",
      "home.bestsellers": "Mais Vendidos",
      "home.categories": "Explorar Categorias",
      "home.view_all": "Ver Todos",
      
      // Botões e ações
      "actions.add_to_cart": "Adicionar ao Carrinho",
      "actions.add": "Adicionar",
      "actions.buy_now": "Comprar Agora",
      "actions.shop_now": "Comprar Agora",
      "actions.remove": "Remover",
      "actions.view_details": "Ver Detalhes",
      "actions.view_product": "Ver {{product}}",
      "actions.checkout": "Finalizar Compra",
      
      // Produto
      "product.bestseller": "Mais Vendido",
      "product.new": "Novo",
      "product.off": "{{percent}}% OFF",
      "product.rating": "{{rating}} de 5 estrelas",
      "product.reviews": "{{count}} avaliações",
      "product.by_author": "por {{author}}",
      
      // Carrinho
      "cart.your_cart": "Seu Carrinho",
      "cart.empty": "Seu carrinho está vazio",
      "cart.items": "{{count}} itens",
      "cart.item": "{{count}} item",
      "cart.subtotal": "Subtotal",
      "cart.shipping": "Envio",
      "cart.total": "Total",
      "cart.proceed_to_checkout": "Finalizar Compra",
    }
  },
  de: {
    translation: {
      // Cabeçalho - versão simplificada para começar
      "header.home": "Startseite",
      "header.books": "Bücher",
      "header.blog": "Blog",
      "header.about": "Über Uns",
      "header.contact": "Kontakt",
      "header.search_placeholder": "Bücher suchen...",
      "header.wishlist": "Wunschliste",
      "header.cart": "Warenkorb",
      "header.account": "Mein Konto",
      "header.sign_in": "Anmelden",
      "header.sign_out": "Abmelden",
      
      // Botões e ações - essenciais apenas
      "actions.add_to_cart": "In den Warenkorb",
      "actions.add": "Hinzufügen",
      "actions.buy_now": "Jetzt Kaufen",
      "actions.shop_now": "Jetzt Kaufen",
    }
  },
  fr: {
    translation: {
      // Cabeçalho - versão simplificada para começar
      "header.home": "Accueil",
      "header.books": "Livres",
      "header.blog": "Blog",
      "header.about": "À Propos",
      "header.contact": "Contact",
      "header.search_placeholder": "Rechercher des livres...",
      "header.wishlist": "Liste de souhaits",
      "header.cart": "Panier",
      "header.account": "Mon Compte",
      "header.sign_in": "Se connecter",
      "header.sign_out": "Se déconnecter",
      
      // Botões e ações - essenciais apenas
      "actions.add_to_cart": "Ajouter au Panier",
      "actions.add": "Ajouter",
      "actions.buy_now": "Acheter Maintenant",
      "actions.shop_now": "Acheter Maintenant",
    }
  }
};

// Configuração do i18next
i18n
  .use(initReactI18next)
  .use(LanguageDetector) // Detecta automaticamente o idioma do navegador
  .init({
    resources,
    fallbackLng: 'en', // Idioma de fallback caso uma tradução não exista
    supportedLngs: ['en', 'pt', 'de', 'fr'],
    
    interpolation: {
      escapeValue: false, // React já faz escape por padrão
    },
    
    // Opções de detecção de idioma
    detection: {
      // Ordem de detecção: primeiro verifica a URL, depois cookie, depois o navegador
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      
      // Configurações do detector de URL
      lookupFromPathIndex: 0,
      
      // Configurações de cookie
      lookupCookie: 'i18next',
      cookieExpirationDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 anos
      
      // Outras configurações
      caches: ['cookie'],
      cookieSameSite: 'strict',
    },
  });

export default i18n; 