#!/usr/bin/env node

/**
 * Script para tradução automática offline dos arquivos de tradução
 * Utiliza a API DeepL para traduzir todos os textos do idioma nativo (PT) para outros idiomas
 * 
 * Uso: node scripts/translate.js
 * 
 * Requer: variável de ambiente DEEPL_API_KEY no arquivo .env.local
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// API Key do DeepL
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

if (!DEEPL_API_KEY) {
  console.error('❌ DEEPL_API_KEY não encontrada. Por favor, configure-a em .env.local');
  process.exit(1);
}

// Diretórios
const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const SOURCE_LANG = 'pt'; // Idioma fonte (Português)

// Lista de idiomas a serem traduzidos
const TARGET_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
];

// Função para traduzir texto via DeepL API
async function translateText(text, targetLang) {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api-free.deepl.com/v2/translate',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        text: [text],
        target_lang: targetLang.toUpperCase(),
        source_lang: SOURCE_LANG.toUpperCase(),
      },
    });

    return response.data.translations[0].text;
  } catch (error) {
    console.error(`❌ Erro ao traduzir para ${targetLang}:`, error.message);
    return text; // Retorna o texto original em caso de erro
  }
}

// Função para traduzir objeto JSON recursivamente
async function translateObject(obj, targetLang) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      process.stdout.write(`.`); // Indica progresso
      result[key] = await translateText(value, targetLang);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = await translateObject(value, targetLang);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// Função principal que inicia o processo de tradução
async function main() {
  try {
    // Verificar se o diretório de locais existe
    if (!fs.existsSync(LOCALES_DIR)) {
      console.error(`❌ Diretório ${LOCALES_DIR} não encontrado.`);
      process.exit(1);
    }

    // Ler todos os arquivos de tradução do idioma fonte
    const sourceLangDir = path.join(LOCALES_DIR, SOURCE_LANG);
    if (!fs.existsSync(sourceLangDir)) {
      console.error(`❌ Diretório do idioma fonte ${sourceLangDir} não encontrado.`);
      process.exit(1);
    }

    const sourceFiles = fs.readdirSync(sourceLangDir)
      .filter(file => file.endsWith('.json'));

    console.log(`🌍 Iniciando tradução de ${sourceFiles.length} arquivos para ${TARGET_LANGUAGES.length} idiomas...`);

    // Para cada idioma alvo
    for (const lang of TARGET_LANGUAGES) {
      console.log(`\n🔄 Traduzindo para ${lang.name} (${lang.code})...`);
      
      // Criar diretório do idioma se não existir
      const targetLangDir = path.join(LOCALES_DIR, lang.code);
      if (!fs.existsSync(targetLangDir)) {
        fs.mkdirSync(targetLangDir, { recursive: true });
      }

      // Para cada arquivo de tradução
      for (const file of sourceFiles) {
        const sourceFilePath = path.join(sourceLangDir, file);
        const targetFilePath = path.join(targetLangDir, file);
        
        console.log(`  📝 Processando ${file}`);
        
        // Ler arquivo fonte
        const sourceData = JSON.parse(fs.readFileSync(sourceFilePath, 'utf8'));
        
        // Traduzir objeto JSON
        const translatedData = await translateObject(sourceData, lang.code);
        
        // Salvar resultado
        fs.writeFileSync(
          targetFilePath, 
          JSON.stringify(translatedData, null, 2),
          'utf8'
        );
        
        console.log(`  ✅ ${file} traduzido e salvo.`);
      }
    }

    console.log('\n🎉 Processo de tradução concluído com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro durante o processo de tradução:', error);
    process.exit(1);
  }
}

// Executar script
main(); 