import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { LANGUAGE_MAP } from "@/app/i18n/settings";

// ----- Configurações -----
const DEEPL_API_KEY =
  process.env.DEEPL_API_KEY || "33ebc8a0-8a5c-4959-8e51-0c497f729760:fx";
const CACHE_EXPIRATION =
  parseInt(process.env.TRANSLATION_CACHE_TIME || "3600", 10) * 1000; // milissegundos
const API_REQUEST_DELAY = 100; // ms entre batches de API calls para evitar rate limits
const TEXTS_PER_BATCH = 20; // Quantidade de textos por chamada de API (reduzido para evitar erros)

// ----- Sistema de Cache -----
interface CacheItem {
  value: any;
  timestamp: number;
}

class TranslationCache {
  private cache: Map<string, CacheItem>;
  private expirationTime: number;

  constructor(expirationMs: number) {
    this.cache = new Map();
    this.expirationTime = expirationMs;
  }

  getKey(lang: string, text: string): string {
    return `${lang}:${text}`;
  }

  get(lang: string, text: string): string | null {
    const key = this.getKey(lang, text);
    const item = this.cache.get(key);

    if (!item) return null;

    // Verificar expiração
    if (Date.now() - item.timestamp > this.expirationTime) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(lang: string, text: string, translation: string): void {
    const key = this.getKey(lang, text);
    this.cache.set(key, {
      value: translation,
      timestamp: Date.now(),
    });
  }

  getBatchTranslations(lang: string, texts: string[]): (string | null)[] {
    return texts.map((text) => this.get(lang, text));
  }

  setBatchTranslations(
    lang: string,
    texts: string[],
    translations: string[]
  ): void {
    texts.forEach((text, index) => {
      this.set(lang, text, translations[index]);
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Instanciar cache com expiração configurada
const translationCache = new TranslationCache(CACHE_EXPIRATION);

// ----- Utilitários de Tradução -----

/**
 * Mapeia código de idioma do i18next para formato DeepL
 */
function mapLanguageCode(langCode: string): string {
  const code = langCode.toLowerCase().substring(0, 2);
  return LANGUAGE_MAP[code] || "EN"; // Fallback para inglês
}

/**
 * Traduz um lote de textos usando a API DeepL
 */
async function batchTranslate(
  texts: string[],
  targetLang: string,
  sourceLang: string = "PT"
): Promise<string[]> {
  try {
    // Se não houver textos para traduzir, retornar array vazio
    if (!texts.length) return [];

    // Remover textos vazios e duplicados para economizar chamadas de API
    const uniqueTexts = [...new Set(texts.filter((text) => text.trim()))];

    // Limitar tamanho dos textos
    const limitedTexts = uniqueTexts.map((text) =>
      text.length > 1000 ? text.substring(0, 1000) : text
    );

    console.log(`Traduzindo ${limitedTexts.length} textos para ${targetLang}`);

    // Parâmetros da requisição corretamente formatados para DeepL
    const params = new URLSearchParams();
    limitedTexts.forEach((text) => {
      params.append("text", text);
    });
    params.append("target_lang", targetLang);
    params.append("source_lang", sourceLang);

    // Usar FormData para envio quando a API não aceita JSON
    const formData = new FormData();
    limitedTexts.forEach((text) => {
      formData.append("text", text);
    });
    formData.append("target_lang", targetLang);
    formData.append("source_lang", sourceLang);

    // Tenta primeiro com application/x-www-form-urlencoded
    try {
      const response = await axios({
        method: "post",
        url: "https://api-free.deepl.com/v2/translate",
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: params,
        timeout: 10000, // 10 segundos timeout
      });

      // Verificar por resposta válida
      if (response.status !== 200 || !response.data?.translations?.length) {
        throw new Error(`DeepL API respondeu com código ${response.status}`);
      }

      // Criar um mapa de texto original -> texto traduzido
      const translationMap = new Map<string, string>();
      response.data.translations.forEach((t: any, i: number) => {
        translationMap.set(limitedTexts[i], t.text);
      });

      // Mapear as traduções na ordem original dos textos
      return texts.map((text) => {
        if (!text.trim()) return text; // Manter strings vazias como estão
        return (
          translationMap.get(
            text.length > 1000 ? text.substring(0, 1000) : text
          ) || text
        );
      });
    } catch (error: any) {
      console.error(
        `[DEEPL API ERROR - URLEncoded] ${error.message || "Unknown error"}`
      );

      // Segunda tentativa com FormData
      const response = await axios({
        method: "post",
        url: "https://api-free.deepl.com/v2/translate",
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        timeout: 10000, // 10 segundos timeout
      });

      if (response.status !== 200 || !response.data?.translations?.length) {
        throw new Error(`DeepL API respondeu com código ${response.status}`);
      }

      // Criar um mapa de texto original -> texto traduzido
      const translationMap = new Map<string, string>();
      response.data.translations.forEach((t: any, i: number) => {
        translationMap.set(limitedTexts[i], t.text);
      });

      // Mapear as traduções na ordem original dos textos
      return texts.map((text) => {
        if (!text.trim()) return text; // Manter strings vazias como estão
        return (
          translationMap.get(
            text.length > 1000 ? text.substring(0, 1000) : text
          ) || text
        );
      });
    }
  } catch (error: any) {
    console.error(`[DEEPL API ERROR] ${error.message || "Unknown error"}`);

    // Em caso de erro severo, usar fallback
    console.log("Usando traduções de fallback");
    return texts.map((text) => {
      // Retornar um texto modificado como fallback
      if (targetLang === "EN") {
        return `[EN] ${text}`;
      } else if (targetLang === "ES") {
        return `[ES] ${text}`;
      } else {
        return text;
      }
    });
  }
}

/**
 * Traduz um objeto de tradução completo
 */
async function processTranslations(
  source: Record<string, any>,
  targetLang: string
): Promise<Record<string, any>> {
  // Função recursiva para processar todos os textos em um objeto aninhado
  async function processObject(
    obj: Record<string, any>
  ): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    const textsToTranslate: string[] = [];
    const keyMap: [string, string[]][] = [];

    // Fase 1: Extrair todos os textos e preparar para tradução em lote
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        // Se já está em cache, usar diretamente
        const cachedTranslation = translationCache.get(targetLang, value);
        if (cachedTranslation !== null) {
          result[key] = cachedTranslation;
        } else {
          textsToTranslate.push(value);
          keyMap.push([key, [value]]);
        }
      } else if (value !== null && typeof value === "object") {
        result[key] = await processObject(value);
      } else {
        result[key] = value;
      }
    }

    // Fase 2: Traduzir em lotes para evitar muitas chamadas de API
    if (textsToTranslate.length > 0) {
      // Dividir em lotes para não sobrecarregar a API
      for (let i = 0; i < textsToTranslate.length; i += TEXTS_PER_BATCH) {
        const batch = textsToTranslate.slice(i, i + TEXTS_PER_BATCH);
        const batchKeyMap = keyMap.slice(i, i + TEXTS_PER_BATCH);

        // Verificar cache primeiro
        const cachedTranslations = translationCache.getBatchTranslations(
          targetLang,
          batch
        );

        // Filtrar apenas os textos que não estão em cache
        const missingTexts: string[] = [];
        const missingIndices: number[] = [];

        cachedTranslations.forEach((cached, index) => {
          if (cached === null) {
            missingTexts.push(batch[index]);
            missingIndices.push(index);
          }
        });

        // Se houver textos não encontrados no cache, traduzi-los
        if (missingTexts.length > 0) {
          const translations = await batchTranslate(
            missingTexts,
            mapLanguageCode(targetLang)
          );

          // Atualizar cache e resultados
          missingTexts.forEach((text, i) => {
            const translation = translations[i];
            const originalIndex = missingIndices[i];
            translationCache.set(targetLang, text, translation);
            const [key] = batchKeyMap[originalIndex];
            result[key] = translation;
          });
        }

        // Adicionar as traduções em cache que já foram encontradas
        cachedTranslations.forEach((cached, index) => {
          if (cached !== null) {
            const [key] = batchKeyMap[index];
            result[key] = cached;
          }
        });

        // Aguardar para evitar rate limiting
        if (i + TEXTS_PER_BATCH < textsToTranslate.length) {
          await new Promise((resolve) =>
            setTimeout(resolve, API_REQUEST_DELAY)
          );
        }
      }
    }

    return result;
  }

  return processObject(source);
}

// ----- Função principal de solicitação de tradução -----
export async function GET(request: NextRequest) {
  // Extrair parâmetros de consulta
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get("lang") || "en";

  try {
    // Definir idioma de origem como português (Portugal)
    const sourceLang = "pt";

    // Carregar o arquivo de origem (português)
    const sourceData = {
      // Dados do hero
      hero: {
        tagline: "Inspirando Fé Através da Literatura",
        title: "Descubra Livros para a Sua Jornada de Fé",
        description: "Explore a nossa cuidadosa seleção de Bíblias, devocionais e literatura cristã para fortalecer a sua caminhada espiritual.",
        shop_now: "Comprar Agora",
        bestsellers: "Mais Vendidos",
        trusted_by: "Confiado por mais de 10.000 clientes satisfeitos em todo o mundo",
        pause_video: "Pausar vídeo de fundo",
        play_video: "Reproduzir vídeo de fundo"
      },
      
      // Dados do footer
      footer: {
        all_rights_reserved: "Todos os direitos reservados",
        company: "Empresa",
        about_us: "Sobre Nós",
        contact: "Contacto",
        terms: "Termos e Condições",
        privacy: "Política de Privacidade",
        shipping: "Política de Envio",
        returns: "Política de Devoluções",
        faq: "FAQ",
        newsletter: "Newsletter",
        subscribe: "Subscrever",
        your_email: "O seu email",
        social_media: "Redes Sociais",
        follow_us: "Siga-nos",
        careers: "Carreiras",
        help: "Ajuda",
        shipping_info: "Envio",
        returns_info: "Devoluções",
        mission: "Publicamos literatura cristã de qualidade para transformar vidas e fortalecer a fé.",
        newsletter_desc: "Receba novidades, lançamentos e ofertas exclusivas.",
        email_placeholder: "O seu endereço de email",
      },
      
      // Dados do header/navegação
      header: {
        search: "Pesquisar",
        search_placeholder: "Procurar produtos...",
        cart: "Carrinho",
        wishlist: "Lista de Desejos",
        account: "Conta",
        login: "Entrar",
        logout: "Sair",
        home: "Início",
        shop: "Loja",
        categories: "Categorias",
        bibles: "Bíblias",
        books: "Livros",
        devotionals: "Devocionais",
        music: "Música",
        gifts: "Presentes",
        sale: "Promoções",
        register: "Registar",
        orders: "Pedidos",
        dashboard: "Painel"
      },
      
      // Navegação e paginação
      navigation: {
        previous: "Anterior",
        next: "Seguinte",
        back: "Voltar",
        more: "Ver Mais"
      },
      
      // Componentes de UI
      ui: {
        loading: "Carregando...",
        error: "Ocorreu um erro. Tente novamente.",
        success: "Operação realizada com sucesso!",
        confirm: "Confirmar",
        cancel: "Cancelar",
        close: "Fechar",
        save: "Guardar",
        edit: "Editar",
        delete: "Apagar",
        search: "Pesquisar",
        filter: "Filtrar",
        sort: "Ordenar",
        view: "Ver",
        show_more: "Mostrar mais",
        show_less: "Mostrar menos",
      },
      
      // Mensagens do sistema
      messages: {
        welcome: "Bem-vindo à nossa livraria cristã",
        empty_cart: "O seu carrinho está vazio",
        add_to_cart: "Adicionar ao carrinho",
        added_to_cart: "Produto adicionado ao carrinho",
        removed_from_cart: "Produto removido do carrinho",
        checkout: "Finalizar compra",
        continue_shopping: "Continuar a comprar",
        order_success: "Pedido realizado com sucesso!",
        order_error: "Ocorreu um erro ao processar o seu pedido.",
        session_expired: "A sua sessão expirou. Por favor, faça login novamente.",
        language_changed: "Idioma alterado para {0}",
        translation_by_deepl: "Tradução via DeepL API"
      }
    };

    // Processar traduções
    const translatedData = await processTranslations(sourceData, lang);

    // Adicionar metadados para uso nos componentes
    const metadata = {
      _meta: {
        translated_by: "DeepL API",
        target_language: lang,
        source_language: "pt",
        translation_time: new Date().toISOString(),
        // Estes metadados são úteis para debug e para mostrar nos componentes
      }
    };

    // Retornar resultado
    return NextResponse.json({ ...translatedData, ...metadata }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error: any) {
    console.error("Translation error:", error);

    return new NextResponse(
      JSON.stringify({
        error: "Translation failed",
        message: error.message || "Unknown error",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
