"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const { user } = useAuth();

  // Load wishlist when user changes
  useEffect(() => {
    const loadWishlist = async () => {
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
              await updateDoc(userDocRef, {
                wishlist: parsedWishlist
              });
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
    };
    
    const loadFromLocalStorage = () => {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Failed to parse wishlist from localStorage:', error);
        }
      }
    };
    
    loadWishlist();
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    setWishlistCount(wishlistItems.length);
    
    // If user is logged in, save to Firestore
    const saveToFirestore = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            wishlist: wishlistItems
          });
        } catch (error) {
          console.error('Failed to save wishlist to Firestore:', error);
        }
      }
    };
    
    saveToFirestore();
  }, [wishlistItems, user]);

  const addToWishlist = (product: Product) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        toast.info(`"${product.title}" já está na sua lista de desejos`);
        return prevItems;
      } else {
        toast.success(`Adicionado "${product.title}" à sua lista de desejos`);
        return [...prevItems, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`Removido "${removedItem.title}" da sua lista de desejos`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.info('Sua lista de desejos foi limpa');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}; 