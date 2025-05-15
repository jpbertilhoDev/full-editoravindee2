import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Chave da API do Google Translate (em produção, use variáveis de ambiente)
// Para testes, usamos uma solução alternativa sem custo
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "YOUR_API_KEY";

// Cache para armazenar traduções já feitas (em memória)
const translationCache: Record<string, any> = {};

// Backup de traduções comuns para mostrar exemplos e economizar chamadas à API
const fallbackTranslations = {
  // Traduções para o português
  pt: {
    common: {
      "hero.tagline": "Inspirando Fé Através da Literatura",
      "hero.title": "Descubra Livros para a Sua Jornada de Fé",
      "hero.description":
        "Explore a nossa cuidadosa seleção de Bíblias, devocionais e literatura cristã para fortalecer a sua caminhada espiritual.",
      "hero.shop_now": "Comprar Agora",
      "hero.bestsellers": "Mais Vendidos",
      "hero.trusted_by":
        "Confiado por mais de 10.000 clientes satisfeitos em todo o mundo",
    },
  },
  // Traduções para o inglês
  en: {
    common: {
      "hero.tagline": "Inspiring Faith Through Literature",
      "hero.title": "Discover Books for Your Faith Journey",
      "hero.description":
        "Explore our carefully curated collection of Bibles, devotionals, and Christian literature to strengthen your spiritual walk.",
      "hero.shop_now": "Shop Now",
      "hero.bestsellers": "Bestsellers",
      "hero.trusted_by": "Trusted by over 10,000 satisfied customers worldwide",
    },
  },
  // Traduções para o espanhol
  es: {
    common: {
      "hero.tagline": "Inspirando Fe a Través de la Literatura",
      "hero.title": "Descubra Libros para Su Jornada de Fe",
      "hero.description":
        "Explore nuestra cuidadosamente seleccionada colección de Biblias, devocionales y literatura cristiana para fortalecer su camino espiritual.",
      "hero.shop_now": "Comprar Ahora",
      "hero.bestsellers": "Más Vendidos",
      "hero.trusted_by":
        "Confiado por más de 10.000 clientes satisfechos en todo el mundo",
    },
  },
  // Traduções para o francês
  fr: {
    common: {
      "hero.tagline": "Inspirer la Foi par la Littérature",
      "hero.title": "Découvrez des Livres pour Votre Parcours de Foi",
      "hero.description":
        "Explorez notre collection soigneusement organisée de Bibles, livres de dévotion et littérature chrétienne pour renforcer votre cheminement spirituel.",
      "hero.shop_now": "Acheter Maintenant",
      "hero.bestsellers": "Meilleures Ventes",
      "hero.trusted_by":
        "Faire confiance par plus de 10 000 clients satisfaits dans le monde entier",
    },
  },
  // Traduções para o alemão
  de: {
    common: {
      "hero.tagline": "Glauben durch Literatur inspirieren",
      "hero.title": "Entdecken Sie Bücher für Ihre Glaubensreise",
      "hero.description":
        "Entdecken Sie unsere sorgfältig zusammengestellte Sammlung von Bibeln, Andachtsbüchern und christlicher Literatur, um Ihren spirituellen Weg zu stärken.",
      "hero.shop_now": "Jetzt Einkaufen",
      "hero.bestsellers": "Bestseller",
      "hero.trusted_by": "Vertraut von über 10.000 zufriedenen Kunden weltweit",
    },
  },
};

/**
 * Função para traduzir texto via Google Translate API
 */
async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  try {
    // Em um ambiente de produção real, você usaria:
    /*
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {},
      {
        params: {
          q: text,
          target: targetLang,
          key: GOOGLE_API_KEY,
        },
      }
    );
    return response.data.data.translations[0].translatedText;
    */

    // Para fins de demonstração, usamos uma API gratuita alternativa
    const response = await axios.get(
      `https://api.mymemory.translated.net/get`,
      {
        params: {
          q: text,
          langpair: `en|${targetLang}`,
        },
      }
    );

    if (response.data && response.data.responseData) {
      return response.data.responseData.translatedText;
    }

    throw new Error("Falha na tradução");
  } catch (error) {
    console.error("Erro ao traduzir:", error);
    // Em caso de erro, retornar o texto original
    return text;
  }
}

/**
 * Handler da rota de API para tradução
 */
export async function GET(request: NextRequest) {
  // Parâmetros da URL
  const searchParams = request.nextUrl.searchParams;
  const targetLang = searchParams.get("lng") || "pt";
  const namespace = searchParams.get("ns") || "common";

  // Verificar se já temos no cache ou no fallback
  const cacheKey = `${targetLang}:${namespace}`;

  // Se encontrar no cache, retornar imediatamente
  if (translationCache[cacheKey]) {
    return NextResponse.json(translationCache[cacheKey]);
  }

  // Se encontrar no fallback, retornar e salvar no cache
  if (fallbackTranslations[targetLang]?.[namespace]) {
    translationCache[cacheKey] = fallbackTranslations[targetLang][namespace];
    return NextResponse.json(fallbackTranslations[targetLang][namespace]);
  }

  // Caso contrário, seria necessário buscar as traduções da API
  // Aqui você faria a chamada para a API de tradução real com cada chave

  // Para esse exemplo, vamos retornar uma tradução padrão do fallback
  // Em um sistema real, você traduziria dinamicamente cada string
  let translations = fallbackTranslations.en.common;

  if (targetLang !== "en") {
    try {
      // Em um sistema real, você traduziria todas as strings
      // Aqui estamos apenas simulando para demonstração
      const translatedData = {};

      for (const [key, value] of Object.entries(translations)) {
        // Traduzir cada string individualmente
        translatedData[key] = await translateText(value as string, targetLang);
      }

      translations = translatedData;
    } catch (error) {
      console.error("Erro ao traduzir textos:", error);
      // Em caso de erro, usar o inglês como fallback
    }
  }

  // Salvar no cache para próximas requisições
  translationCache[cacheKey] = translations;

  return NextResponse.json(translations);
}
