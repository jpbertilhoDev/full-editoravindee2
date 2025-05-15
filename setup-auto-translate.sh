#!/bin/bash

# Cores para mensagens
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Configuração do Sistema de Tradução Automática com DeepL ===${NC}"
echo

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm não encontrado. Por favor, instale o Node.js e npm primeiro.${NC}"
    exit 1
fi

# Instalar dependências necessárias
echo -e "${BLUE}Instalando dependências de tradução...${NC}"
npm install --save i18next i18next-browser-languagedetector i18next-http-backend react-i18next axios

echo -e "${GREEN}✓ Dependências instaladas com sucesso!${NC}"

# Criar diretório para traduções se não existir
mkdir -p public/locales/{pt,en,fr,de,es}/

# Verificar se já existe um arquivo .env.local
if [ ! -f .env.local ]; then
    echo -e "${BLUE}Criando arquivo .env.local...${NC}"
    cat > .env.local << EOL
# Configurações de Tradução
DEEPL_API_KEY=33ebc8a0-8a5c-4959-8e51-0c497f729760:fx
TRANSLATION_CACHE_TIME=3600
EOL
    echo -e "${GREEN}✓ Arquivo .env.local criado!${NC}"
else
    # Verificar se já contém as variáveis de ambiente necessárias
    if ! grep -q "DEEPL_API_KEY" .env.local; then
        echo -e "${BLUE}Adicionando configurações de tradução ao .env.local...${NC}"
        cat >> .env.local << EOL

# Configurações de Tradução
DEEPL_API_KEY=33ebc8a0-8a5c-4959-8e51-0c497f729760:fx
TRANSLATION_CACHE_TIME=3600
EOL
        echo -e "${GREEN}✓ Configurações adicionadas ao .env.local!${NC}"
    fi
fi

# Criar README para instruções
echo -e "${BLUE}Criando documentação do sistema de tradução...${NC}"
cat > TRANSLATION-README.md << EOL
# Sistema de Tradução Automática com DeepL

Este projeto utiliza DeepL para tradução automática de conteúdo para múltiplos idiomas.

## Como funciona

1. O idioma nativo do site é Português (Portugal)
2. As traduções são gerenciadas por i18next
3. Idiomas não-nativos são traduzidos automaticamente via DeepL API

## Configuração

No arquivo \`.env.local\`:

\`\`\`
DEEPL_API_KEY=sua-chave-api-deepl
TRANSLATION_CACHE_TIME=3600  # Tempo de cache em segundos
\`\`\`

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

Para adicionar novas strings, adicione-as apenas ao arquivo de tradução Português (\`public/locales/pt/common.json\`).
As traduções para outros idiomas serão geradas automaticamente.

## Produção

Em produção, o sistema usa caching para reduzir chamadas à API e melhorar performance.
EOL

echo -e "${GREEN}✓ Documentação criada: TRANSLATION-README.md${NC}"
echo
echo -e "${GREEN}✅ Configuração concluída com sucesso!${NC}"
echo
echo -e "${BLUE}Para iniciar o servidor:${NC} npm run dev"
echo -e "${BLUE}Para mais informações:${NC} cat TRANSLATION-README.md"
echo

# Perguntar se o usuário quer iniciar o servidor
read -p "Deseja iniciar o servidor agora? (s/n): " iniciar_servidor
if [ "$iniciar_servidor" = "s" ] || [ "$iniciar_servidor" = "S" ]; then
    echo "🚀 Iniciando servidor Next.js..."
    npm run dev
else
    echo "👋 Você pode iniciar o servidor mais tarde com 'npm run dev'"
fi 