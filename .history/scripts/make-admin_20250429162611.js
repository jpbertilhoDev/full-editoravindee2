// scripts/make-admin.js
// Script para promover um usuário a administrador

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, updateDoc } = require("firebase/firestore");

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

// Email do usuário que você deseja promover a admin
const userEmail = process.argv[2];

if (!userEmail) {
  console.error("Por favor, forneça o email do usuário como argumento.");
  console.error("Uso: node scripts/make-admin.js usuario@exemplo.com");
  process.exit(1);
}

async function makeUserAdmin(email) {
  try {
    console.log(`Buscando usuário com email: ${email}`);

    // Primeiro precisamos encontrar o documento do usuário pelo email
    const usersSnapshot = await getDocs(collection(db, "users"));
    let userId = null;

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email === email) {
        userId = doc.id;
      }
    });

    if (!userId) {
      console.error(`Usuário com email ${email} não encontrado.`);
      process.exit(1);
    }

    console.log(`Usuário encontrado com ID: ${userId}`);

    // Atualizando o campo role para 'admin'
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: "admin",
    });

    console.log(
      `✅ Usuário ${email} foi promovido a administrador com sucesso!`
    );
    process.exit(0);
  } catch (error) {
    console.error("Erro ao promover usuário:", error);
    process.exit(1);
  }
}

makeUserAdmin(userEmail);
