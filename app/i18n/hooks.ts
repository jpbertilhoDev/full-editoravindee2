"use server";

import { cookies, headers } from "next/headers";
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions } from "./settings";

/**
 * Inicializa uma instância i18n para uso em componentes do servidor
 */
async function initServerI18n(lng: string, ns: string | string[]) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(),
      lng,
      ns,
    });

  return i18nInstance;
}

/**
 * Obtém a linguagem atual a partir dos headers ou cookies
 */
export function getLanguage(): string {
  let lng;

  // Tenta obter a linguagem dos cookies
  const cookieStore = cookies();
  if (cookieStore.has("i18next")) {
    lng = cookieStore.get("i18next")?.value;
  }

  // Se não encontrou, tenta obter do header Accept-Language
  if (!lng) {
    const headersList = headers();
    const acceptLanguage = headersList.get("Accept-Language");
    if (acceptLanguage) {
      lng = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();
    }
  }

  // Retorna a linguagem ou o padrão PT
  return lng || "pt";
}

/**
 * Hook para usar traduções em componentes do servidor
 */
export async function useServerTranslation(ns: string | string[] = "common") {
  const lng = getLanguage();
  const i18nextInstance = await initServerI18n(lng, ns);

  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
    language: lng,
  };
}
