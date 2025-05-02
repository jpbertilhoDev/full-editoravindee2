import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isBrowser } from "./optimizations";

/**
 * Tipos de recursos que podem ser pré-carregados
 */
export type PrefetchType = "image" | "style" | "script" | "font" | "fetch";

/**
 * Interface para definir recursos a serem pré-carregados
 */
interface PrefetchResource {
  url: string;
  as: PrefetchType;
  importance?: "high" | "low" | "auto";
  crossOrigin?: "anonymous" | "use-credentials";
}

/**
 * Pré-carrega recursos críticos para melhorar a performance
 * @param resources Array de recursos para pré-carregar
 */
export function usePrefetchResources(resources: PrefetchResource[]): void {
  useEffect(() => {
    if (!isBrowser) return;

    // Função para criar links de prefetch
    const prefetchResource = (resource: PrefetchResource) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = resource.url;
      link.as = resource.as;

      if (resource.importance) {
        link.setAttribute("importance", resource.importance);
      }

      if (resource.crossOrigin) {
        link.crossOrigin = resource.crossOrigin;
      }

      document.head.appendChild(link);
      return link;
    };

    // Cria os elementos de prefetch
    const linkElements = resources.map(prefetchResource);

    // Limpeza ao desmontar
    return () => {
      linkElements.forEach((link) => {
        if (link && link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [resources]);
}

/**
 * Hook para pré-carregar uma página
 * @param paths Caminhos para pré-carregar
 */
export function usePrefetchPages(paths: string[]): void {
  const router = useRouter();

  useEffect(() => {
    if (!isBrowser) return;

    // Pré-carrega cada caminho
    paths.forEach((path) => {
      router.prefetch(path);
    });
  }, [paths, router]);
}

/**
 * Hook para pré-carrega a próxima página provável com base no histórico de navegação
 * ou comportamento do usuário
 */
export function usePredictivePageLoading(): void {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isBrowser) return;

    // Mapeamento simples de páginas relacionadas
    const relatedPageMap: Record<string, string[]> = {
      "/": ["/products", "/blog", "/about"],
      "/products": [
        "/products/category/bible",
        "/products/category/devotionals",
        "/cart",
      ],
      "/blog": ["/blog/category/faith", "/blog/category/testimonies"],
      "/about": ["/contact", "/terms"],
      "/contact": ["/about", "/faq"],
    };

    // Obtém páginas relacionadas à atual
    const relatedPages = relatedPageMap[pathname as string] || [];

    // Pré-carrega as páginas relacionadas
    relatedPages.forEach((path) => {
      router.prefetch(path);
    });
  }, [pathname, router]);
}

/**
 * Carrega recursos depois que o conteúdo principal já foi renderizado
 * @param callback Função a ser executada após o carregamento inicial
 */
export function useDeferredLoading(callback: () => void): void {
  useEffect(() => {
    if (!isBrowser) return;

    // Verifica se a página já foi carregada
    if (document.readyState === "complete") {
      // Executa após um pequeno atraso para garantir que o conteúdo principal já foi processado
      setTimeout(callback, 200);
    } else {
      // Caso contrário, aguarda o evento load
      const handler = () => setTimeout(callback, 200);
      window.addEventListener("load", handler);
      return () => window.removeEventListener("load", handler);
    }
  }, [callback]);
}
