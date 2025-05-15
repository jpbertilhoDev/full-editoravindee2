"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Simplificando para um conjunto mínimo de traduções
const resources = {
  en: {
    translation: {
      "header.home": "Home",
      "header.books": "Books",
      "header.blog": "Blog",
      "header.about": "About Us",
      "header.contact": "Contact",
      "header.search": "Search books...",
      "header.wishlist": "Wishlist",
      "header.cart": "Cart",
      "header.login": "Login",
      "header.register": "Register",
      "accessibility.change_language": "Change language",
      "accessibility.current_language": "Current language",
      "accessibility.close_menu": "Close menu",
      "accessibility.open_menu": "Open menu",
      "footer.rights_reserved": "All rights reserved",
      "footer.company": "Company",
      "footer.about": "About Us",
      "footer.contact": "Contact",
    },
  },
  pt: {
    translation: {
      "header.home": "Início",
      "header.books": "Livros",
      "header.blog": "Blog",
      "header.about": "Sobre",
      "header.contact": "Contato",
      "header.search": "Buscar livros...",
      "header.wishlist": "Favoritos",
      "header.cart": "Carrinho",
      "header.login": "Entrar",
      "header.register": "Cadastrar",
      "accessibility.change_language": "Mudar idioma",
      "accessibility.current_language": "Idioma atual",
      "accessibility.close_menu": "Fechar menu",
      "accessibility.open_menu": "Abrir menu",
      "footer.rights_reserved": "Todos os direitos reservados",
      "footer.company": "Empresa",
      "footer.about": "Sobre Nós",
      "footer.contact": "Contato",
    },
  },
};

// Configuração simplificada e robusta
const initI18n = () => {
  // Verificar se estamos no browser para evitar erros durante SSR
  if (typeof window === "undefined") {
    // Retornar uma instância dummy para SSR
    return i18n;
  }

  // Se já estiver inicializado, não reinicializar
  if (i18n.isInitialized) {
    return i18n;
  }

  try {
    i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        resources,
        fallbackLng: "pt",
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ["localStorage", "navigator"],
          caches: ["localStorage"],
        },
        react: {
          useSuspense: false,
        },
      });
  } catch (error) {
    console.error("Erro ao inicializar i18n:", error);
  }

  return i18n;
};

export default initI18n();
