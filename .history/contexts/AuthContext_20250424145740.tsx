"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  auth, 
  firebaseSignIn, 
  firebaseSignUp, 
  firebaseSignOut, 
  firebaseResetPassword,
  getUserProfile,
  createUserProfile,
  updateUserProfile
} from '@/lib/firebase';

// Define user profile type
export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photoURL?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Define auth context types
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Create auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          // Fetch user profile from Firestore
          const profile = await getUserProfile(authUser.uid);
          if (profile) {
            setUserProfile(profile as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await firebaseSignIn(email, password);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Falha ao realizar login. Tente novamente.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      const { user: newUser } = await firebaseSignUp(email, password);
      
      // Create user profile in Firestore
      await createUserProfile(newUser.uid, {
        firstName,
        lastName,
        email,
        photoURL: newUser.photoURL,
      });
      
      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Falha ao criar conta. Tente novamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut();
      toast.success('Logout realizado com sucesso!');
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao fazer logout. Tente novamente.');
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      await firebaseResetPassword(email);
      toast.success('Email de redefinição de senha enviado!');
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Falha ao enviar email de redefinição.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Não encontramos um usuário com este email.';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      toast.error('Você precisa estar logado para atualizar seu perfil.');
      return;
    }
    
    try {
      setLoading(true);
      await updateUserProfile(user.uid, data);
      
      // Update local state
      setUserProfile(prev => {
        if (!prev) return null;
        return { ...prev, ...data };
      });
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao atualizar perfil. Tente novamente.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 