// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  connectFirestoreEmulator,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBjt6Cb-soc9zWi6OZLrcHFSutCgGvHz8",
  authDomain: "editoravinde-35415.firebaseapp.com",
  projectId: "editoravinde-35415",
  storageBucket: "editoravinde-35415.appspot.com",
  messagingSenderId: "83591132522",
  appId: "1:83591132522:web:aad95311328fbf51a8e113",
};

// Initialize Firebase singleton
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: false, // Usa websockets em vez de long polling
  ignoreUndefinedProperties: true, // Ignora propriedades undefined para reduzir tamanho da payload
});

// Habilitar persistência offline para melhor desempenho
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("Persistência do Firebase falhou: múltiplas abas abertas.");
    } else if (err.code === "unimplemented") {
      console.warn("Seu navegador não suporta persistência do Firebase.");
    }
  });
}

const auth = getAuth(app);
const storage = getStorage(app);

// Conectar a emuladores se em desenvolvimento
if (process.env.NODE_ENV === "development") {
  const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS;
  
  if (useEmulators === "true") {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectStorageEmulator(storage, "localhost", 9199);
  }
}

export { app, db, auth, storage };
