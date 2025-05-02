"use client"

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [pendingFirestoreUpdate, setPendingFirestoreUpdate] = useState(false);
  const { user } = useAuth();

  // Memoize common items to prevent unnecessary rerenders
  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  // Load wishlist when user changes - optimized with useCallback
  const loadWishlist = useCallback(async () => {
    // If user is logged in, load from Firestore
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().wishlist) {
          setWishlistItems(userDoc.data().wishlist);
        } else {
          // If user has items in localStorage, save them to Firestore
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            const parsedWishlist = JSON.parse(savedWishlist);
            setWishlistItems(parsedWishlist);
            
            // Save to Firestore
            setPendingFirestoreUpdate(true);
          }
        }
      } catch (error) {
        console.error('Failed to load wishlist from Firestore:', error);
        loadFromLocalStorage();
      }
    } else {
      // If not logged in, load from localStorage
      loadFromLocalStorage();
    }
  }, [user]);
  
  const loadFromLocalStorage = useCallback(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Erro ao salvar lista de desejos no localStorage:', error);
    }
  }, [wishlistItems]);

  // Throttled Firestore updates
  useEffect(() => {
    if (!user || !pendingFirestoreUpdate) return;
    
    const timeoutId = setTimeout(async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        
        // Verificar se o documento existe antes de tentar atualizar
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            wishlist: wishlistItems
          });
        } else {
          // Criar o documento se não existir
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            wishlist: wishlistItems,
            createdAt: new Date(),
          });
        }
        setPendingFirestoreUpdate(false);
      } catch (error) {
        console.error('Falha ao salvar lista de desejos no Firestore:', error);
        // Não mostrar toast para não interromper a experiência do usuário
      }
    }, 1000); // Throttle updates to once per second
    
    return () => clearTimeout(timeoutId);
  }, [wishlistItems, user, pendingFirestoreUpdate]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        toast.info(`"${product.title}" já está na sua lista de desejos`);
        return prevItems;
      } else {
        toast.success(`Adicionado "${product.title}" à sua lista de desejos`);
        setPendingFirestoreUpdate(true);
        return [...prevItems, product];
      }
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`Removido "${removedItem.title}" da sua lista de desejos`);
      }
      setPendingFirestoreUpdate(true);
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    setPendingFirestoreUpdate(true);
    toast.info('Sua lista de desejos foi limpa');
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount,
  }), [
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount
  ]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}; 