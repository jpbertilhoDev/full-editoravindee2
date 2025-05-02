#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Script para limpar caches do Next.js que podem estar causando
 * problemas de performance no desenvolvimento
 */

const projectRoot = process.cwd();
const dirsToRemove = [".next", "node_modules/.cache", ".turbo"];

console.log("🧹 Limpando caches para melhorar a performance...");

// Limpa diretórios de cache
dirsToRemove.forEach((dir) => {
  const dirPath = path.join(projectRoot, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`Removendo ${dir}...`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ ${dir} removido com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao remover ${dir}:`, error.message);
    }
  } else {
    console.log(`ℹ️ ${dir} não encontrado, pulando...`);
  }
});

// Limpa dependências problemáticas
try {
  console.log("🔄 Instalando dependências limpas...");
  execSync("npm install", { stdio: "inherit" });
  console.log("✅ Dependências reinstaladas com sucesso!");
} catch (error) {
  console.error("❌ Erro ao reinstalar dependências:", error.message);
}

console.log("\n🚀 Limpeza concluída! Agora execute:");
console.log("npm run dev");
console.log("\nVocê deve ver uma melhoria significativa na performance.");
