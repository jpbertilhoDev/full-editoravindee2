# Sistema de Tradução Automática com DeepL

Este projeto utiliza DeepL para tradução automática de conteúdo para múltiplos idiomas.

## Como funciona

1. O idioma nativo do site é Português (Portugal)
2. As traduções são gerenciadas por i18next
3. Idiomas não-nativos são traduzidos automaticamente via DeepL API

## Estrutura do Sistema

```
/app
  /i18n
    - client.ts    # Configuração i18next (Client Components)
    - settings.ts  # Configurações compartilhadas (Server + Client)
    - index.ts     # Re-exports para compatibilidade
  /api
    /translate
      - route.ts   # API Route para tradução com DeepL
```

## Uso em componentes

### Em Client Components

```tsx
'use client';
import { useTranslation } from 'react-i18next';
import i18n from '@/app/i18n/client';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('title', 'Título padrão')}</h1>;
}
```

### Em Server Components

```tsx
// Apenas importar configurações estáticas
import { LANGUAGES_LIST } from '@/app/i18n/settings';

// Não utilizar hooks de tradução em Server Components
```

## Configuração

No arquivo `.env.local`:

```
DEEPL_API_KEY=sua-chave-api-deepl
TRANSLATION_CACHE_TIME=3600  # Tempo de cache em segundos
```

## Idiomas Suportados

O sistema suporta todos os idiomas disponíveis na API DeepL:
- Português 🇵🇹 (nativo)
- Inglês 🇺🇸
- Espanhol 🇪🇸
- Francês 🇫🇷
- Alemão 🇩🇪
- Italiano 🇮🇹
- Holandês 🇳🇱
- Polonês 🇵🇱
- Russo 🇷🇺
- Japonês 🇯🇵
- Chinês 🇨🇳
- E mais...

## Desenvolvimento

Para adicionar novas strings, adicione-as apenas ao arquivo de tradução Português (`public/locales/pt/common.json`).
As traduções para outros idiomas serão geradas automaticamente.

### Pré-geração de traduções

É possível pré-gerar traduções para todos os idiomas executando:

```bash
npm run translate
```

## Produção

Em produção, o sistema usa caching para reduzir chamadas à API e melhorar performance. 