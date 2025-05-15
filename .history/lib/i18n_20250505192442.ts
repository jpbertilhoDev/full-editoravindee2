import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

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
      "header.register": "Register",

      // Rodapé
      "footer.rights_reserved": "All rights reserved",
      "footer.about_us": "About Us",
      "footer.contact": "Contact",
      "footer.terms": "Terms & Conditions",
      "footer.privacy": "Privacy Policy",
      "footer.company": "Company",
      "footer.help": "Help",
      "footer.shipping": "Shipping",
      "footer.returns": "Returns & Exchanges",
      "footer.careers": "Careers",
      "footer.newsletter": "Newsletter",
      "footer.newsletter_description":
        "Get the latest news, releases and special offers.",
      "footer.description":
        "Publishing quality Christian literature to transform lives and strengthen faith.",

      // Acessibilidade
      "accessibility.change_language": "Change language",
      "accessibility.current_language": "Current language",
      "accessibility.close_menu": "Close menu",
      "accessibility.open_menu": "Open menu",
      "accessibility.previous": "Previous",
      "accessibility.next": "Next",

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
    },
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
      "header.register": "Cadastrar",

      // Rodapé
      "footer.rights_reserved": "Todos os direitos reservados",
      "footer.about_us": "Sobre Nós",
      "footer.contact": "Contato",
      "footer.terms": "Termos e Condições",
      "footer.privacy": "Política de Privacidade",
      "footer.company": "Empresa",
      "footer.help": "Ajuda",
      "footer.shipping": "Envio",
      "footer.returns": "Trocas e Devoluções",
      "footer.careers": "Carreiras",
      "footer.newsletter": "Newsletter",
      "footer.newsletter_description":
        "Receba novidades, lançamentos e ofertas exclusivas.",
      "footer.description":
        "Publicando literatura cristã de qualidade para transformar vidas e fortalecer a fé.",

      // Acessibilidade
      "accessibility.change_language": "Mudar idioma",
      "accessibility.current_language": "Idioma atual",
      "accessibility.close_menu": "Fechar menu",
      "accessibility.open_menu": "Abrir menu",
      "accessibility.previous": "Anterior",
      "accessibility.next": "Próximo",

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
    },
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
      "header.register": "Registrieren",

      // Acessibilidade
      "accessibility.change_language": "Sprache ändern",
      "accessibility.current_language": "Aktuelle Sprache",
      "accessibility.close_menu": "Menü schließen",
      "accessibility.open_menu": "Menü öffnen",
      "accessibility.previous": "Zurück",
      "accessibility.next": "Weiter",

      // Rodapé
      "footer.rights_reserved": "Alle Rechte vorbehalten",
      "footer.company": "Unternehmen",
      "footer.help": "Hilfe",
      "footer.description":
        "Wir veröffentlichen christliche Literatur von höchster Qualität.",

      // Botões e ações - essenciais apenas
      "actions.add_to_cart": "In den Warenkorb",
      "actions.add": "Hinzufügen",
      "actions.buy_now": "Jetzt Kaufen",
      "actions.shop_now": "Jetzt Kaufen",
      "actions.view_product": "{{product}} anzeigen",

      // Produto
      "product.bestseller": "Bestseller",
      "product.new": "Neu",
      "product.off": "{{percent}}% RABATT",
    },
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
      "header.register": "S'inscrire",

      // Acessibilidade
      "accessibility.change_language": "Changer de langue",
      "accessibility.current_language": "Langue actuelle",
      "accessibility.close_menu": "Fermer le menu",
      "accessibility.open_menu": "Ouvrir le menu",
      "accessibility.previous": "Précédent",
      "accessibility.next": "Suivant",

      // Rodapé
      "footer.rights_reserved": "Tous droits réservés",
      "footer.company": "Société",
      "footer.help": "Aide",
      "footer.description":
        "Publication de littérature chrétienne de qualité pour transformer des vies.",

      // Botões e ações - essenciais apenas
      "actions.add_to_cart": "Ajouter au Panier",
      "actions.add": "Ajouter",
      "actions.buy_now": "Acheter Maintenant",
      "actions.shop_now": "Acheter Maintenant",
      "actions.view_product": "Voir {{product}}",

      // Produto
      "product.bestseller": "Meilleure vente",
      "product.new": "Nouveau",
      "product.off": "{{percent}}% DE RÉDUCTION",
    },
  },
};

// Configuração do i18next
i18n
  .use(initReactI18next)
  .use(LanguageDetector) // Detecta automaticamente o idioma do navegador
  .init({
    resources,
    fallbackLng: "en", // Idioma de fallback caso uma tradução não exista
    supportedLngs: ["en", "pt", "de", "fr"],

    interpolation: {
      escapeValue: false, // React já faz escape por padrão
    },

    // Opções de detecção de idioma
    detection: {
      // Ordem de detecção: primeiro verifica a URL, depois cookie, depois o navegador
      order: ["path", "cookie", "localStorage", "navigator"],

      // Configurações do detector de URL
      lookupFromPathIndex: 0,

      // Configurações de cookie
      lookupCookie: "i18next",
      cookieExpirationDate: new Date(
        Date.now() + 2 * 365 * 24 * 60 * 60 * 1000
      ), // 2 anos

      // Outras configurações
      caches: ["cookie"],
      cookieSameSite: "strict",
    },
  });

export default i18n;
