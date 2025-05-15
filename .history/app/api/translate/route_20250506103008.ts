import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Chave da API do DeepL fornecida
const DEEPL_API_KEY = "33ebc8a0-8a5c-4959-8e51-0c497f729760:fx";

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
 * Função para traduzir texto via DeepL API
 */
async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "auto"
): Promise<string> {
  try {
    // Usar a API do DeepL para tradução
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      {},
      {
        params: {
          auth_key: DEEPL_API_KEY,
          text: text,
          target_lang: convertLanguageCodeForDeepL(targetLang),
          source_lang: sourceLang !== "auto" ? convertLanguageCodeForDeepL(sourceLang) : undefined,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Verificar se a resposta contém traduções
    if (response.data && response.data.translations && response.data.translations.length > 0) {
      return response.data.translations[0].text;
    }

    // Se não houver tradução, retornar o texto original
    console.log("Resposta do DeepL sem traduções:", response.data);
    return text;
  } catch (error) {
    // Log detalhado do erro
    if (axios.isAxiosError(error)) {
      console.error("Erro na API DeepL:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error("Erro ao traduzir:", error);
    }
    
    // Em caso de erro, retornar o texto original
    return text;
  }
}

/**
 * Converte códigos de idioma para o formato esperado pelo DeepL
 */
function convertLanguageCodeForDeepL(langCode: string): string {
  // DeepL usa códigos específicos, como EN-US, DE, FR, etc.
  const langMap: Record<string, string> = {
    en: "EN",
    pt: "PT",
    es: "ES",
    fr: "FR",
    de: "DE",
  };

  return langMap[langCode.toLowerCase()] || langCode.toUpperCase();
}

/**
 * Handler da rota de API para tradução
 */
export async function GET(request: NextRequest) {
  // Parâmetros da URL
  const searchParams = request.nextUrl.searchParams;
  const targetLang = searchParams.get("lng") || "pt";
  const namespace = searchParams.get("ns") || "common";
  const key = searchParams.get("key");

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

  // Se chegou até aqui, precisamos traduzir usando a API DeepL
  // Vamos usar o inglês como idioma base para tradução
  let translations = fallbackTranslations.en.common;
  
  if (targetLang !== "en") {
    try {
      // Criar um objeto para armazenar as traduções
      const translatedData = {};
      
      console.log(`Traduzindo para ${targetLang} usando a API DeepL...`);
      
      // Traduzir cada string individualmente
      for (const [key, value] of Object.entries(translations)) {
        // Chamar a API do DeepL
        translatedData[key] = await translateText(value as string, targetLang, "en");
        
        // Adicionar um pequeno atraso para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      translations = translatedData;
      console.log(`Tradução concluída para ${targetLang}`);
    } catch (error) {
      console.error(`Erro ao traduzir textos para ${targetLang}:`, error);
      // Em caso de erro, usar o inglês como fallback
    }
  }

  // Salvar no cache para próximas requisições
  translationCache[cacheKey] = translations;

  return NextResponse.json(translations);
}
