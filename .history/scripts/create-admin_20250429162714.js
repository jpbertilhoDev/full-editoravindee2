// scripts/create-admin.js
// Script para criar um novo usuário administrador

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');

// Configuração do Firebase (mesma do arquivo lib/firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyDBjt6Cb-soc9zWi6OZLrcHFSutCgGvHz8",
  authDomain: "editoravinde-35415.firebaseapp.com",
  projectId: "editoravinde-35415",
  storageBucket: "editoravinde-35415.appspot.com",
  messagingSenderId: "83591132522",
  appId: "1:83591132522:web:aad95311328fbf51a8e113",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Dados do usuário administrador
const adminEmail = process.argv[2];
const adminPassword = process.argv[3];
const adminName = process.argv[4] || "Administrador";

if (!adminEmail || !adminPassword) {
  console.error("Por favor, forneça email e senha do administrador como argumentos.");
  console.error("Uso: node scripts/create-admin.js admin@exemplo.com senha NomeDoAdmin");
  process.exit(1);
}

async function createAdminUser(email, password, name) {
  try {
    console.log(`Criando usuário administrador: ${email}`);
    
    // Criar usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Atualizar o nome de exibição
    await updateProfile(user, {
      displayName: name
    });
    
    console.log(`Usuário criado no Authentication com ID: ${user.uid}`);
    
    // Criar registro no Firestore com role = admin
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: email,
      displayName: name,
      createdAt: new Date(),
      role: 'admin',
    });
    
    console.log(`✅ Usuário administrador ${email} criado com sucesso!`);
    console.log("Dados para login:");
    console.log(`Email: ${email}`);
    console.log(`Senha: ${password}`);
    console.log(`Nome: ${name}`);
    
    // Deslogar o usuário da sessão atual do script
    await auth.signOut();
    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error);
    process.exit(1);
  }
}

createAdminUser(adminEmail, adminPassword, adminName); 