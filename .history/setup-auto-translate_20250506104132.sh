#!/bin/bash

# Script para configurar o sistema de tradução automática
# Este script vai instalar as dependências necessárias e fazer a configuração básica
# para o sistema de tradução automática via API.

echo "🌎 Configurando sistema de tradução automática para Next.js..."

# Verificar se o npm está disponível
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Instalar dependências necessárias
echo "📦 Instalando dependências..."
npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector axios

# Verificar se a instalação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências."
    exit 1
fi

# Verificar se já existe a pasta de API
if [ ! -d "./app/api/translate" ]; then
    echo "📁 Criando rota de API para tradução..."
    mkdir -p ./app/api/translate
fi

echo "✅ Configuração concluída com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "1. Configure sua chave de API do Google Translate ou DeepL em .env.local"
echo "2. Personalize o arquivo app/api/translate/route.ts conforme necessário"
echo "3. Reinicie seu servidor com 'npm run dev'"
echo ""
echo "🔍 Para mais informações, consulte a documentação em: https://i18next.com/"
echo ""

# Perguntar se o usuário quer iniciar o servidor
read -p "Deseja iniciar o servidor agora? (s/n): " iniciar_servidor
if [ "$iniciar_servidor" = "s" ] || [ "$iniciar_servidor" = "S" ]; then
    echo "🚀 Iniciando servidor Next.js..."
    npm run dev
else
    echo "👋 Você pode iniciar o servidor mais tarde com 'npm run dev'"
fi 