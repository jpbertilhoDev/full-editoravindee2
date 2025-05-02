# Scripts de Manutenção do Blog

Este diretório contém scripts para manutenção e reparo do blog.

## Scripts disponíveis

### `check-posts.js`
Verifica os posts do blog no Firestore e lista todos os posts, incluindo aqueles que estão publicados.

**Como executar:**
```bash
node scripts/check-posts.js
```

### `repair-posts.js`
Repara posts do blog, corrigindo campos ausentes e regenerando slugs quando necessário.

**Como executar:**
```bash
node scripts/repair-posts.js
```

### `fix-blog-images.js`
Novo script para corrigir URLs de imagens quebradas ou ausentes em posts do blog.

**Como executar:**
```bash
node scripts/fix-blog-images.js
```

## Execução dos scripts

Os scripts precisam das variáveis de ambiente do Firebase configuradas. Você pode executá-los de duas maneiras:

### 1. Usando o .env.local do Next.js
Certifique-se de que as variáveis de ambiente estão configuradas no arquivo `.env.local` na raiz do projeto.

### 2. Usando variáveis temporárias na linha de comando
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key \
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain \
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id \
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket \
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id \
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id \
node scripts/nome-do-script.js
```

## Efeito dos scripts

### `fix-blog-images.js`
Este script percorrerá todos os posts do blog e:
1. Corrigirá URL de imagens quebradas conhecidas (como as da Pexels que estão retornando 404)
2. Adicionará uma imagem placeholder para posts sem imagem
3. Mostrará um relatório das alterações feitas

Após executar este script, todos os posts terão imagens válidas, o que melhorará o carregamento e a experiência do usuário no blog. 