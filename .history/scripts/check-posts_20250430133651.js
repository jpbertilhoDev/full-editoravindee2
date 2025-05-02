// Script para verificar e listar posts do blog no Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDBjt6Cb-soc9zWi6OZLrcHFSutCgGvHz8",
  authDomain: "editoravinde-35415.firebaseapp.com",
  projectId: "editoravinde-35415",
  storageBucket: "editoravinde-35415.appspot.com",
  messagingSenderId: "83591132522",
  appId: "1:83591132522:web:aad95311328fbf51a8e113",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkBlogPosts() {
  console.log('Verificando posts do blog no Firestore...');
  
  try {
    // Lista todos os posts
    console.log('\n=== TODOS OS POSTS ===');
    const allPostsSnapshot = await getDocs(collection(db, 'blogPosts'));
    
    if (allPostsSnapshot.empty) {
      console.log('Nenhum post encontrado na coleção blogPosts.');
    } else {
      console.log(`Total de posts: ${allPostsSnapshot.size}`);
      
      allPostsSnapshot.forEach(doc => {
        const post = doc.data();
        console.log(`\nID: ${doc.id}`);
        console.log(`Título: ${post.title}`);
        console.log(`Status: ${post.status}`);
        console.log(`Slug: ${post.slug}`);
        console.log(`Data: ${post.date}`);
        console.log(`Autor: ${post.author}`);
        console.log('-'.repeat(50));
      });
    }
    
    // Verifica apenas os posts publicados
    console.log('\n=== POSTS PUBLICADOS ===');
    const publishedQuery = query(
      collection(db, 'blogPosts'),
      where('status', '==', 'published')
    );
    
    const publishedSnapshot = await getDocs(publishedQuery);
    
    if (publishedSnapshot.empty) {
      console.log('Nenhum post publicado encontrado.');
    } else {
      console.log(`Total de posts publicados: ${publishedSnapshot.size}`);
      
      publishedSnapshot.forEach(doc => {
        const post = doc.data();
        console.log(`\nID: ${doc.id}`);
        console.log(`Título: ${post.title}`);
        console.log(`Data: ${post.date}`);
        console.log(`Slug: ${post.slug}`);
      });
    }
    
  } catch (error) {
    console.error('Erro ao verificar posts:', error);
  }
}

// Executar a verificação
checkBlogPosts()
  .then(() => console.log('\nVerificação concluída.'))
  .catch(error => console.error('Erro:', error)); 