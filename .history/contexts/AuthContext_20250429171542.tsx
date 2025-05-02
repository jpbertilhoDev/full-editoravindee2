"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName: name,
        createdAt: serverTimestamp(),
        role: 'customer',
      });
      
      toast.success("Conta criada com sucesso!");
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error during signup:", error);
      let message = "Erro ao criar conta. Tente novamente.";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "Este email já está em uso. Tente outro.";
      } else if (error.code === 'auth/weak-password') {
        message = "Senha fraca. Use pelo menos 6 caracteres.";
      }
      
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", auth.currentUser!.uid), {
          uid: auth.currentUser!.uid,
          email: auth.currentUser!.email,
          displayName: auth.currentUser!.displayName,
          createdAt: serverTimestamp(),
          role: 'customer',
        });
        
        toast.success("Login realizado com sucesso!");
        router.push('/dashboard');
      } else {
        // Verificar se o usuário é um administrador
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          toast.success("Login de administrador realizado com sucesso!");
          router.push('/admin/dashboard');
        } else {
          toast.success("Login realizado com sucesso!");
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error("Error during sign in:", error);
      let message = "Erro ao fazer login. Tente novamente.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Email ou senha incorretos.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Muitas tentativas. Tente novamente mais tarde.";
      }
      
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp(),
          role: 'customer',
        });
        
        toast.success("Login com Google realizado com sucesso!");
        router.push('/dashboard');
      } else {
        // Verificar se o usuário é um administrador
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          toast.success("Login de administrador realizado com sucesso!");
          router.push('/admin/dashboard');
        } else {
          toast.success("Login com Google realizado com sucesso!");
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error("Error during Google sign in:", error);
      toast.error("Erro ao fazer login com Google. Tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      toast.success("Logout realizado com sucesso!");
      router.push('/');
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Email para redefinição de senha enviado!");
    } catch (error: any) {
      console.error("Error during password reset:", error);
      let message = "Erro ao enviar email de redefinição. Tente novamente.";
      
      if (error.code === 'auth/user-not-found') {
        message = "Email não encontrado.";
      }
      
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      if (!auth.currentUser) return;
      
      // Força a atualização do usuário atual no Firebase Auth
      const currentUser = auth.currentUser;
      await currentUser.reload();
      
      // Obter referência atualizada do usuário após reload
      const refreshedUser = auth.currentUser;
      
      // Log para depuração
      console.log("Dados atualizados:", {
        displayName: refreshedUser?.displayName,
        email: refreshedUser?.email,
        photoURL: refreshedUser?.photoURL,
        reloadTime: new Date().toISOString()
      });
      
      // Atualiza o estado local com o usuário atualizado - importante criar um novo objeto
      // para garantir que o React detectará a mudança
      setUser(refreshedUser ? {...refreshedUser} : null);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  const value = {
    user,
    loading,
    setUser,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 