// Script para reparar posts do blog no Firestore
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} = require("firebase/firestore");

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

// Campos necessários para um post de blog
const requiredFields = {
  title: "Post sem título",
  excerpt: "Descrição não disponível",
  content: "Conteúdo não disponível",
  date: new Date().toISOString().split("T")[0],
  author: "Administrador",
  category: "devotional",
  imageUrl: "",
  status: "published",
  featured: "no",
  slug: "",
};

async function repairBlogPosts() {
  console.log("Iniciando reparo de posts do blog...");

  try {
    const postsSnapshot = await getDocs(collection(db, "blogPosts"));

    if (postsSnapshot.empty) {
      console.log("Nenhum post encontrado na coleção blogPosts.");
      return;
    }

    console.log(`Total de posts para verificar: ${postsSnapshot.size}`);
    let repairedCount = 0;

    for (const docSnapshot of postsSnapshot.docs) {
      const postId = docSnapshot.id;
      const postData = docSnapshot.data();

      // Verificar se o slug é válido
      if (!postData.slug) {
        console.log(`Post ${postId} não tem slug. Usando ID como slug.`);
        postData.slug = postId;
      }

      // Verificar campos obrigatórios
      const missingFields = [];
      const fieldsToUpdate = {};

      for (const [field, defaultValue] of Object.entries(requiredFields)) {
        if (
          postData[field] === undefined ||
          postData[field] === null ||
          postData[field] === ""
        ) {
          missingFields.push(field);
          fieldsToUpdate[field] = defaultValue;
        }
      }

      // Se o título foi alterado, atualizar o slug
      if (fieldsToUpdate.title && !fieldsToUpdate.slug) {
        const newSlug = fieldsToUpdate.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();

        fieldsToUpdate.slug = newSlug;
        missingFields.push("slug (regenerated)");
      }

      // Se há campos para atualizar
      if (missingFields.length > 0) {
        console.log(
          `\nReparando post ${postId}: "${postData.title || "Sem título"}"`
        );
        console.log(`Campos ausentes: ${missingFields.join(", ")}`);

        try {
          await updateDoc(doc(db, "blogPosts", postId), fieldsToUpdate);
          console.log("✅ Post reparado com sucesso!");
          repairedCount++;
        } catch (error) {
          console.error(`❌ Erro ao reparar post ${postId}:`, error);
        }
      } else {
        // Apenas para mostrar posts verificados sem problemas
        console.log(`✓ Post ${postId} verificado: OK`);
      }
    }

    console.log(`\nReparo concluído! ${repairedCount} posts foram reparados.`);
  } catch (error) {
    console.error("Erro ao reparar posts:", error);
  }
}

// Executar o reparo
repairBlogPosts()
  .then(() => console.log("\nProcesso de reparo concluído."))
  .catch((error) => console.error("Erro:", error));
