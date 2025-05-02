// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBjt6Cb-soc9zWi6OZLrcHFSutCgGvHz8",
  authDomain: "editoravinde-35415.firebaseapp.com",
  projectId: "editoravinde-35415",
  storageBucket: "editoravinde-35415.firebasestorage.app",
  messagingSenderId: "83591132522",
  appId: "1:83591132522:web:aad95311328fbf51a8e113",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export auth functions
export const firebaseSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const firebaseSignUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const firebaseSignOut = () => signOut(auth);

export const firebaseResetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

// Export firestore helpers
export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }

  return null;
};

export const createUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

export default app;
