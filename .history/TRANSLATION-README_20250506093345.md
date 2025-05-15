# Tradução Automática via API para Next.js

Este projeto está configurado para usar tradução automática via API, integrando o i18next com APIs de tradução como Google Translate ou DeepL.

## 🚀 Como funciona

Em vez de manter arquivos JSON estáticos para cada idioma, este sistema:

1. Detecta o idioma do usuário automaticamente
2. Busca traduções dinamicamente via API
3. Aplica as traduções em tempo real
4. Armazena em cache para melhorar performance

## ⚙️ Configuração

### 1. Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```
# Chave de API do Google Translate
GOOGLE_API_KEY=sua_chave_aqui

# OU DeepL API
DEEPL_API_KEY=sua_chave_aqui

# Configurações
TRANSLATION_CACHE_TTL=86400 # 24 horas
DEFAULT_LANGUAGE=pt
SUPPORTED_LANGUAGES=pt,en,es,fr,de
TRANSLATION_DEBUG=true
```

### 2. APIs de Tradução Recomendadas

#### Google Translate API
- Documentação: https://cloud.google.com/translate/docs
- Preço: ~$20 por milhão de caracteres
- Muitos idiomas suportados

#### DeepL API
- Documentação: https://www.deepl.com/pro-api
- Preço: ~€20 por milhão de caracteres
- Melhor qualidade para idiomas europeus

#### Alternativas Gratuitas (para testes)
- LibreTranslate: https://libretranslate.com
- MyMemory API: https://mymemory.translated.net/doc/spec.php

## 📦 Estrutura de Arquivos

- `/lib/i18n.ts` - Configuração principal do i18next
- `/app/api/translate/route.ts` - Endpoint API para tradução
- `/components/ui/TranslationStatus.tsx` - Indicador de tradução automática
- `/components/ui/LanguageSwitcher.tsx` - Seletor de idiomas

## 🔍 Como usar

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('hello_world')}</h1>;  // Traduzido automaticamente!
}
```

## 🏆 Vantagens da Tradução Automática

- **Manutenção simplificada**: sem necessidade de atualizar arquivos JSON
- **Suporte a muitos idiomas**: adicione novos idiomas instantaneamente
- **Escalabilidade**: traduz automaticamente conteúdo novo
- **Performance**: sistema de cache integrado

## 📝 Considerações

- APIs de tradução têm custo baseado em volume
- Qualidade da tradução varia (Google vs DeepL vs outros)
- Considere revisão humana para textos críticos

## 🤝 Contribuição

Sinta-se livre para melhorar este sistema de tradução!

1. Fork o repositório
2. Crie sua branch (`git checkout -b feature/traducao-melhorada`)
3. Commit suas alterações (`git commit -m 'Melhoria no sistema de tradução'`)
4. Push para a branch (`git push origin feature/traducao-melhorada`)
5. Abra um Pull Request 