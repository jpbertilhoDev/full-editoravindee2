// Script para corrigir URLs de imagens faltantes ou quebradas nos posts do blog
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

// Configuração do Firebase - substitua por suas credenciais
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Placeholder para imagens quebradas
const DEFAULT_IMAGE = '/images/placeholder-image.jpg';

// Lista de URLs de imagens conhecidas que estão quebradas
const BROKEN_URLS = [
  'https://images.pexels.com/photos/3693994/pexels-photo-3693994.jpeg',
  // Adicione outras URLs de imagens quebradas conhecidas aqui
];

async function fixBlogImages() {
  console.log('Iniciando correção de imagens em posts do blog...');
  
  try {
    // Consultar todos os posts do blog
    const postsQuery = query(collection(db, "blogPosts"));
    const querySnapshot = await getDocs(postsQuery);
    
    if (querySnapshot.empty) {
      console.log('Nenhum post encontrado.');
      return;
    }
    
    console.log(`Encontrados ${querySnapshot.size} posts para verificar.`);
    
    let updatedCount = 0;
    const failedUrls = new Set();
    
    // Para cada post, verificar e corrigir a URL da imagem
    for (const postDoc of querySnapshot.docs) {
      const postData = postDoc.data();
      
      // Verificar se a URL da imagem está na lista de quebradas
      if (postData.imageUrl && BROKEN_URLS.includes(postData.imageUrl)) {
        console.log(`Corrigindo imagem quebrada no post: ${postData.title || postDoc.id}`);
        
        try {
          // Atualizar o documento com a URL padrão
          await updateDoc(doc(db, "blogPosts", postDoc.id), {
            imageUrl: DEFAULT_IMAGE
          });
          
          updatedCount++;
          console.log(`✓ Imagem atualizada para: ${DEFAULT_IMAGE}`);
        } catch (error) {
          console.error(`Erro ao atualizar o post ${postDoc.id}:`, error);
          failedUrls.add(postData.imageUrl);
        }
      }
      
      // Verificar posts sem URL de imagem
      if (!postData.imageUrl) {
        console.log(`Post sem imagem encontrado: ${postData.title || postDoc.id}`);
        
        try {
          // Atualizar o documento com a URL padrão
          await updateDoc(doc(db, "blogPosts", postDoc.id), {
            imageUrl: DEFAULT_IMAGE
          });
          
          updatedCount++;
          console.log(`✓ Imagem padrão adicionada: ${DEFAULT_IMAGE}`);
        } catch (error) {
          console.error(`Erro ao adicionar imagem ao post ${postDoc.id}:`, error);
        }
      }
    }
    
    // Relatório final
    console.log('\n===== RELATÓRIO =====');
    console.log(`Total de posts verificados: ${querySnapshot.size}`);
    console.log(`Posts atualizados: ${updatedCount}`);
    
    if (failedUrls.size > 0) {
      console.log('\nURLs que falharam ao atualizar:');
      failedUrls.forEach(url => console.log(` - ${url}`));
    }
    
    console.log('\nVerificação de imagens concluída!');
    
  } catch (error) {
    console.error('Erro ao verificar imagens dos posts:', error);
  }
}

// Executar o script
fixBlogImages()
  .then(() => console.log('Script finalizado.'))
  .catch(error => console.error('Erro no script:', error)); 