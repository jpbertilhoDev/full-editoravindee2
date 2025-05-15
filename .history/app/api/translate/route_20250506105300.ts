import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Chave da API do DeepL
const DEEPL_API_KEY = "33ebc8a0-8a5c-4959-8e51-0c497f729760:fx";

// Tempo de expiração do cache (24 horas em milissegundos)
const CACHE_TTL = 24 * 60 * 60 * 1000;

// Cache com expiração para armazenar traduções
interface CacheItem {
  value: any;
  expiry: number;
}

class TranslationCache {
  private cache: Record<string, CacheItem> = {};

  get(key: string): any | null {
    const item = this.cache[key];
    
    // Se o item não existe ou expirou, retorna null
    if (!item || Date.now() > item.expiry) {
      if (item) {
        // Remove itens expirados do cache
        delete this.cache[key];
      }
      return null;
    }
    
    return item.value;
  }

  set(key: string, value: any, ttl: number = CACHE_TTL): void {
    const expiry = Date.now() + ttl;
    this.cache[key] = { value, expiry };
  }

  clear(): void {
    this.cache = {};
  }
}

// Instância do cache de traduções
const translationCache = new TranslationCache();

// Configurações do DeepL API
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

/**
 * Enumera os idiomas suportados pelo DeepL
 * https://developers.deepl.com/docs/resources/supported-languages
 */
enum DeepLLanguage {
  BG = "BG", // Bulgarian
  CS = "CS", // Czech
  DA = "DA", // Danish
  DE = "DE", // German
  EL = "EL", // Greek
  EN = "EN", // English
  ES = "ES", // Spanish
  ET = "ET", // Estonian
  FI = "FI", // Finnish
  FR = "FR", // French
  HU = "HU", // Hungarian
  ID = "ID", // Indonesian
  IT = "IT", // Italian
  JA = "JA", // Japanese
  KO = "KO", // Korean
  LT = "LT", // Lithuanian
  LV = "LV", // Latvian
  NB = "NB", // Norwegian
  NL = "NL", // Dutch
  PL = "PL", // Polish
  PT = "PT", // Portuguese
  RO = "RO", // Romanian
  RU = "RU", // Russian
  SK = "SK", // Slovak
  SL = "SL", // Slovenian
  SV = "SV", // Swedish
  TR = "TR", // Turkish
  UK = "UK", // Ukrainian
  ZH = "ZH", // Chinese
}

// Backup de traduções para funcionar sem API em ambiente de desenvolvimento
const fallbackTranslations = {
  pt: {
    common: {
      "hero.tagline": "Inspirando Fé Através da Literatura",
      "hero.title": "Descubra Livros para a Sua Jornada de Fé",
      "hero.description": "Explore a nossa cuidadosa seleção de Bíblias, devocionais e literatura cristã para fortalecer a sua caminhada espiritual.",
      "hero.shop_now": "Comprar Agora",
      "hero.bestsellers": "Mais Vendidos",
      "hero.trusted_by": "Confiado por mais de 10.000 clientes satisfeitos em todo o mundo",
    },
  },
  en: {
    common: {
      "hero.tagline": "Inspiring Faith Through Literature",
      "hero.title": "Discover Books for Your Faith Journey",
      "hero.description": "Explore our carefully curated collection of Bibles, devotionals, and Christian literature to strengthen your spiritual walk.",
      "hero.shop_now": "Shop Now",
      "hero.bestsellers": "Bestsellers",
      "hero.trusted_by": "Trusted by over 10,000 satisfied customers worldwide",
    },
  }
};

/**
 * Mapeia códigos de idioma padrão para códigos DeepL
 */
function mapToDeepLLanguage(langCode: string): DeepLLanguage {
  const code = langCode.toLowerCase().substring(0, 2);
  
  const langMap: Record<string, DeepLLanguage> = {
    en: DeepLLanguage.EN,
    pt: DeepLLanguage.PT,
    es: DeepLLanguage.ES,
    fr: DeepLLanguage.FR,
    de: DeepLLanguage.DE,
    it: DeepLLanguage.IT,
    ja: DeepLLanguage.JA,
    ru: DeepLLanguage.RU,
    zh: DeepLLanguage.ZH,
  };
  
  return langMap[code] || DeepLLanguage.EN;
}

/**
 * Batches multiple texts to translate in a single API call
 * This is more efficient than making separate calls for each text
 */
async function batchTranslate(
  texts: string[],
  targetLang: DeepLLanguage,
  sourceLang?: DeepLLanguage
): Promise<string[]> {
  if (!texts.length) return [];
  
  try {
    // Prepare parameters for DeepL API
    const params: Record<string, any> = {
      auth_key: DEEPL_API_KEY,
      text: texts,
      target_lang: targetLang,
    };
    
    // Only add source_lang if provided
    if (sourceLang) {
      params.source_lang = sourceLang;
    }
    
    // Make request to DeepL API
    const response = await axios.post(DEEPL_API_URL, null, {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Check if response contains translations
    if (response.data && response.data.translations) {
      return response.data.translations.map((t: any) => t.text);
    }
    
    // If something went wrong, return original texts
    console.warn("DeepL API response missing translations:", response.data);
    return texts;
  } catch (error) {
    // Log detailed error
    if (axios.isAxiosError(error)) {
      console.error("DeepL API error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error("Translation error:", error);
    }
    
    // Fall back to original texts
    return texts;
  }
}

/**
 * Processa o arquivo de tradução para o idioma solicitado
 * 
 * @param sourceLang Idioma de origem (normalmente en ou pt)
 * @param targetLang Idioma de destino para tradução
 * @param namespace Namespace da tradução (normalmente "common")
 * @returns Objeto com as traduções
 */
async function processTranslations(
  sourceLang: string,
  targetLang: string,
  namespace: string
): Promise<Record<string, any>> {
  // Se o idioma alvo for igual ao idioma fonte, retorna as traduções originais
  if (sourceLang === targetLang) {
    return fallbackTranslations[sourceLang]?.[namespace] || {};
  }
  
  // Prepara idiomas para a API DeepL
  const sourceDeepLLang = mapToDeepLLanguage(sourceLang);
  const targetDeepLLang = mapToDeepLLanguage(targetLang);
  
  // Usa o inglês como origem de tradução (geralmente tem melhor qualidade)
  const baseTranslations = fallbackTranslations.en?.common || {};
  
  // Prepara arrays para tradução em lote
  const keys: string[] = [];
  const textsToTranslate: string[] = [];
  
  // Coleta todos os textos a serem traduzidos
  Object.entries(baseTranslations).forEach(([key, value]) => {
    keys.push(key);
    textsToTranslate.push(value as string);
  });
  
  // Traduz todos os textos em uma única chamada API
  const translatedTexts = await batchTranslate(
    textsToTranslate,
    targetDeepLLang,
    sourceDeepLLang
  );
  
  // Monta o objeto de traduções
  const result: Record<string, string> = {};
  keys.forEach((key, index) => {
    result[key] = translatedTexts[index] || baseTranslations[key] as string;
  });
  
  return result;
}

/**
 * API Route handler para traduções
 */
export async function GET(request: NextRequest) {
  // Parse query parameters
  const searchParams = request.nextUrl.searchParams;
  const targetLang = searchParams.get("lng") || "pt";
  const namespace = searchParams.get("ns") || "common";
  const sourceLang = "en"; // Usa inglês como idioma base para traduções
  
  // Chave para o cache
  const cacheKey = `${targetLang}:${namespace}`;
  
  // Verifica se já temos essa tradução em cache
  const cachedTranslations = translationCache.get(cacheKey);
  if (cachedTranslations) {
    return NextResponse.json(cachedTranslations);
  }
  
  // Verifica se é um idioma que já temos tradução estática
  if (fallbackTranslations[targetLang]?.[namespace]) {
    const translations = fallbackTranslations[targetLang][namespace];
    translationCache.set(cacheKey, translations);
    return NextResponse.json(translations);
  }
  
  try {
    // Processa as traduções para o idioma solicitado
    const translations = await processTranslations(sourceLang, targetLang, namespace);
    
    // Salva no cache para futuras requisições
    translationCache.set(cacheKey, translations);
    
    // Retorna as traduções
    return NextResponse.json(translations);
  } catch (error) {
    console.error(`Error processing translations for ${targetLang}:`, error);
    
    // Em caso de erro, retorna as traduções em inglês como fallback
    return NextResponse.json(fallbackTranslations.en?.common || {});
  }
}
