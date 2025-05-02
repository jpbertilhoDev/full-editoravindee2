"use client";

import React, { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  User, Mail, Phone, Home, MapPin, Shield, 
  Save, RefreshCw, Camera, X, Upload, Trash2, Loader2
} from 'lucide-react';
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, auth, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Head from 'next/head';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Nota: Em Next.js 13+ com App Router, os metadados são definidos em um arquivo 
// metadata.ts ou metadata.js separado para páginas server-side, não em componentes client-side

const handleAvatarUpload = () => {
  // Aciona o input de arquivo
  console.log("handleAvatarUpload chamado");
  if (fileInputRef.current) {
    console.log("Referência do input de arquivo encontrada, clicando...");
    fileInputRef.current.click();
  } else {
    console.error("ERRO: Referência do input de arquivo não encontrada!");
  }
};

return (
  <div className="space-y-8">
    {/* Header */}
    <div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meu Perfil</h1>
      <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e preferências</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* User Info Card com Avatar melhorado */}
      <Card className="lg:col-span-1">
        <CardContent className="pt-6 pb-4 flex flex-col items-center">
          <div className="relative">
            <div className="h-28 w-28 rounded-full overflow-hidden relative">
              {/* Avatar com fallback e gestão de estados */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
              
              {avatarFile ? (
                // Imagem local temporária (preview durante upload)
                <img 
                  src={avatarFile} 
                  alt={user?.displayName || ''}
                  className="h-full w-full object-cover"
                  onError={() => {
                    console.error("Erro ao carregar imagem local");
                    setAvatarFile(null);
                  }}
                />
              ) : user?.photoURL ? (
                // Foto do Firebase com fallback para iniciais
                <img 
                  src={`${user.photoURL}?v=${avatarKey}`}
                  alt={user?.displayName || ''}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error("Erro ao carregar imagem remota");
                    e.currentTarget.style.display = 'none';
                    // Mostrar o fallback com as iniciais
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
              ) : null}
              
              {/* Fallback com iniciais - visível apenas quando a imagem falha ou não existe */}
              <div className={`absolute inset-0 flex items-center justify-center bg-[#08a4a7] text-white text-2xl font-medium ${user?.photoURL && !isUploading ? 'hidden' : ''}`}>
                {user?.displayName
                  ? user.displayName.split(' ').map(n => n?.[0] || '').join('').toUpperCase()
                  : user?.email?.[0].toUpperCase() || 'U'
                }
              </div>
            </div>
            
            {/* File input para upload de avatar */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/jpeg, image/png, image/gif, image/webp"
              aria-label="Upload de foto de perfil"
              title="Escolha uma nova foto de perfil"
            />
              
            <div className="absolute -bottom-1 right-0 flex gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8 border-2 border-white bg-white shadow-md"
                onClick={handleAvatarUpload}
                disabled={isUploading || isRemovingPhoto}
                title="Alterar foto"
              >
                {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
); 