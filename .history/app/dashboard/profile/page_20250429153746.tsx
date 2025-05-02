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
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Esquema de validação para o formulário de perfil
const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }).optional(),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }).optional(),
  city: z.string().min(2, { message: "Cidade deve ter pelo menos 2 caracteres" }).optional(),
  state: z.string().min(2, { message: "Estado deve ter pelo menos 2 caracteres" }).optional(),
  zipCode: z.string().min(5, { message: "CEP deve ter pelo menos 5 caracteres" }).optional(),
  bio: z.string().max(500, { message: "Bio deve ter no máximo 500 caracteres" }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Função utilitária para comprimir imagens antes do upload
const compressImage = async (file: File, maxWidth = 800, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calcular dimensões para manter a proporção
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (!ctx) {
          reject(new Error('Não foi possível obter o contexto do canvas'));
          return;
        }
        
        // Desenhar a imagem no canvas com as novas dimensões
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao comprimir a imagem'));
              return;
            }
            resolve(blob);
          },
          file.type,
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Erro ao carregar a imagem para compressão'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo para compressão'));
    };
  });
};

// Verifica se o dispositivo está online
const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState<number>(Date.now());
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [uploadAttempts, setUploadAttempts] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, setUser, refreshUserData } = useAuth();

  // Reset avatar error when user or photoURL changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.photoURL]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
    };
  }, []);

  // Monitorar conectividade e tentar novamente se necessário
  useEffect(() => {
    const handleOnline = async () => {
      if (isRetrying && uploadAttempts < 3) {
        console.log("Conexão restaurada, tentando upload novamente...");
        setUploadAttempts(prev => prev + 1);
        
        // Adicionar um pequeno atraso para garantir que a conexão esteja estável
        uploadTimeoutRef.current = setTimeout(() => {
          if (fileInputRef.current && fileInputRef.current.files?.[0]) {
            handleAvatarChange({ target: { files: fileInputRef.current.files } } as any);
          }
          setIsRetrying(false);
        }, 1500);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isRetrying, uploadAttempts]);

  // Formulário com React Hook Form e Zod para validação
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      bio: "",
    },
  });

  // Carrega os dados do usuário do Firestore
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          form.reset({
            displayName: user?.displayName || "",
            email: user?.email || "",
            phone: userData?.phone || "",
            address: userData?.address || "",
            city: userData?.city || "",
            state: userData?.state || "",
            zipCode: userData?.zipCode || "",
            bio: userData?.bio || "",
          });
        } else {
          // Se o documento não existir, inicializa com os dados básicos do Auth
          form.reset({
            displayName: user?.displayName || "",
            email: user?.email || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };

    loadUserProfile();
  }, [user, form, toast]);

  // Função para lidar com a alteração da foto de perfil
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Evitar upload duplicado
    if (isUploading) return;
    
    if (!e.target.files || !e.target.files[0] || !user?.uid) {
      console.error("Erro: Arquivo não selecionado ou usuário não autenticado");
      return;
    }
    
    // Verificar conexão com a internet
    if (!isOnline()) {
      toast({
        title: "Sem conexão",
        description: "Verifique sua conexão com a internet e tente novamente.",
        variant: "destructive",
      });
      setIsRetrying(true);
      return;
    }
    
    // Reset do contador de tentativas quando um novo upload é iniciado manualmente
    if (!isRetrying) {
      setUploadAttempts(0);
    }
    
    const file = e.target.files[0];
    console.log("Arquivo selecionado:", file.name, "Tamanho:", file.size, "Tipo:", file.type);
    
    // Validar o tamanho do arquivo (máximo 10MB antes da compressão)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, escolha uma imagem com menos de 10MB",
        variant: "destructive",
      });
      return;
    }
    
    // Validar o tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, escolha um arquivo de imagem",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Criar uma URL temporária para preview
      const fileURL = URL.createObjectURL(file);
      setAvatarFile(fileURL);
      
      // Iniciar upload
      setIsUploading(true);
      setUploadProgress(0);
      
      console.log("Iniciando upload para usuário:", user.uid);
      
      // Comprimir a imagem antes do upload
      console.log("Comprimindo imagem...");
      let fileToUpload: Blob | File = file;
      
      // Comprimir apenas se for uma imagem JPG ou PNG com mais de 500KB
      if (
        (file.type === 'image/jpeg' || file.type === 'image/png') && 
        file.size > 500 * 1024
      ) {
        try {
          // Usar qualidade diferente com base no tamanho da imagem original
          const quality = file.size > 2 * 1024 * 1024 ? 0.7 : 0.8;
          fileToUpload = await compressImage(file, 1200, quality);
          console.log("Imagem comprimida com sucesso. Novo tamanho:", fileToUpload.size);
        } catch (compressError) {
          console.warn("Não foi possível comprimir a imagem, usando o arquivo original:", compressError);
          // Continua com o arquivo original se a compressão falhar
        }
      }
      
      // Referência para o storage do Firebase
      const storageRef = ref(storage, `avatars/${user.uid}`);
      
      // Nome do arquivo com timestamp para evitar problemas de cache
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'originalName': file.name,
          'userId': user.uid,
          'uploadedAt': new Date().toISOString()
        }
      };
      
      // Upload do arquivo
      console.log("Enviando arquivo para Firebase Storage...");
      await uploadBytes(storageRef, fileToUpload, metadata);
      console.log("Upload concluído com sucesso");
      
      // Atualizar progresso
      setUploadProgress(50);
      
      // Obter a URL de download com cache-busting
      console.log("Obtendo URL de download...");
      const timestamp = Date.now();
      const downloadURL = await getDownloadURL(storageRef);
      const cacheBustURL = `${downloadURL}?v=${timestamp}`;
      console.log("URL de download obtida:", cacheBustURL);
      
      // Atualizar progresso
      setUploadProgress(75);
      
      // Atualizar o perfil do usuário no Authentication
      if (auth.currentUser) {
        console.log("Atualizando perfil do usuário no Authentication...");
        await updateProfile(auth.currentUser, {
          photoURL: cacheBustURL
        });
        console.log("Perfil do Authentication atualizado");
      }
      
      // Atualizar os dados do usuário no Firestore
      console.log("Atualizando dados do usuário no Firestore...");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: cacheBustURL,
        updatedAt: serverTimestamp()
      });
      console.log("Documento do Firestore atualizado");
      
      // Atualizar o estado local
      console.log("Atualizando estado local do usuário...");
      setUser({
        ...user,
        photoURL: cacheBustURL
      });
      
      // Tentar forçar uma atualização dos dados do usuário do Auth
      try {
        await refreshUserData();
      } catch (refreshError) {
        console.warn("Aviso: Não foi possível atualizar dados do usuário:", refreshError);
      }
      
      // Atualizar progresso
      setUploadProgress(100);
      
      // Revogar a URL do objeto criado para evitar vazamento de memória
      URL.revokeObjectURL(fileURL);
      setAvatarFile(null);
      
      // Atualizar a chave para forçar a recarga da imagem (evita cache)
      setAvatarKey(timestamp);
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      
      // Log detalhado do erro
      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
        console.error("Stack trace:", error.stack);
      }
      
      // Mensagem de erro mais específica baseada no tipo de erro
      let errorMessage = "Não foi possível atualizar sua foto. Tente novamente mais tarde.";
      
      if (error instanceof Error) {
        // Verificar mensagens específicas de erro do Firebase Storage
        if (error.message.includes("storage/unauthorized")) {
          errorMessage = "Acesso não autorizado ao armazenamento. Verifique as regras do Firebase Storage.";
        } else if (error.message.includes("storage/quota-exceeded")) {
          errorMessage = "Cota de armazenamento excedida. Entre em contato com o administrador.";
        } else if (error.message.includes("storage/invalid-url")) {
          errorMessage = "URL de armazenamento inválida. Entre em contato com o suporte.";
        } else if (error.message.includes("storage/retry-limit-exceeded")) {
          errorMessage = "Tempo limite de upload excedido. Verifique sua conexão e tente novamente.";
        } else if (error.message.includes("storage/canceled")) {
          errorMessage = "Upload cancelado. Tente novamente.";
        } else if (error.message.includes("network-error")) {
          errorMessage = "Erro de rede. Verifique sua conexão com a internet.";
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Limpar o arquivo e estado de erro
      if (avatarFile) {
        URL.revokeObjectURL(avatarFile);
        setAvatarFile(null);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Limpar o input de arquivo para permitir selecionar a mesma imagem novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Função para remover a foto de perfil
  const handleRemoveAvatar = async () => {
    if (!user?.uid || !user?.photoURL) return;
    
    // Verificar conexão com a internet
    if (!isOnline()) {
      toast({
        title: "Sem conexão",
        description: "Verifique sua conexão com a internet e tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsRemovingPhoto(true);
      
      // Referência para o storage do Firebase
      const storageRef = ref(storage, `avatars/${user.uid}`);
      
      // Tentar remover a imagem do storage (pode falhar se o caminho não for exato)
      try {
        await deleteObject(storageRef);
        console.log("Arquivo removido do storage com sucesso");
      } catch (error) {
        // Verificar se o erro é de arquivo não encontrado, o que pode ser ignorado
        if (error instanceof Error && error.message.includes('storage/object-not-found')) {
          console.warn("Arquivo não encontrado no storage, continuando com a remoção da referência");
        } else {
          console.warn("Aviso: Não foi possível excluir o arquivo do storage", error);
        }
        // Continuar mesmo se falhar, pois pode ser que a URL não corresponda exatamente
      }
      
      // Atualizar o perfil do usuário no Authentication
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: null
        });
        console.log("Referência da foto removida do Authentication");
      }
      
      // Atualizar os dados do usuário no Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: null,
        updatedAt: serverTimestamp()
      });
      console.log("Referência da foto removida do Firestore");
      
      // Atualizar o estado local
      setUser({
        ...user,
        photoURL: null
      });
      
      // Forçar atualização dos dados do usuário
      try {
        await refreshUserData();
      } catch (refreshError) {
        console.warn("Aviso: Não foi possível atualizar dados do usuário:", refreshError);
      }
      
      // Resetar estado de erro
      setAvatarError(false);
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil removida com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao remover a foto:", error);
      
      let errorMessage = "Não foi possível remover sua foto. Tente novamente mais tarde.";
      
      if (error instanceof Error) {
        // Verificar mensagens específicas de erro
        if (error.message.includes("network-error") || !isOnline()) {
          errorMessage = "Erro de rede. Verifique sua conexão com a internet.";
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRemovingPhoto(false);
      
      // Resetar qualquer key de cache
      setAvatarKey(Date.now());
    }
  };

  const handleAvatarUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Função para atualizar o perfil
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.uid) return;
    
    try {
      setIsUpdatingProfile(true);
      
      // Atualizar o nome do usuário no Authentication
      if (auth.currentUser && data.displayName !== user.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: data.displayName
        });
      }
      
      // Atualizar os dados do usuário no Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        displayName: data.displayName,
        email: data.email || user.email,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        bio: data.bio || null,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      // Atualizar o estado local
      setUser({
        ...user,
        displayName: data.displayName
      });
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
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
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>Sua foto será exibida no site e em seu perfil</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4 flex flex-col items-center">
            <div className="relative">
              <div className="h-28 w-28 rounded-full overflow-hidden relative">
                {/* Avatar com fallback e gestão de estados */}
                {isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-10">
                    <RefreshCw className="h-8 w-8 text-white animate-spin mb-1" />
                    {uploadProgress > 0 && (
                      <div className="w-3/4 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-white h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
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
                      setAvatarError(true);
                    }}
                  />
                ) : user?.photoURL ? (
                  // Foto do Firebase com fallback para iniciais
                  <img 
                    key={avatarKey}
                    src={`${user.photoURL}`}
                    alt={user?.displayName || ''}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error("Erro ao carregar imagem remota");
                      e.currentTarget.style.display = 'none';
                      setAvatarError(true);
                    }}
                  />
                ) : null}
                
                {/* Fallback com iniciais - visível quando não há foto ou quando há erro */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center bg-[#08a4a7] text-white text-2xl font-medium ${
                    user?.photoURL && !isUploading && !avatarError ? 'hidden' : ''
                  }`}
                >
                  {user?.displayName
                    ? user.displayName.split(' ').map(n => n?.[0] || '').join('').toUpperCase().substring(0, 2)
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
                
                {user?.photoURL && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full h-8 w-8 border-2 border-white bg-white shadow-md"
                        disabled={isUploading || isRemovingPhoto}
                        title="Remover foto"
                      >
                        {isRemovingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover foto de perfil?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Sua foto de perfil será removida permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveAvatar}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Informações do Perfil */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize suas informações pessoais e de contato</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Seu nome completo" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email (somente leitura) */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="seu@email.com" className="pl-10" {...field} disabled />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Email usado para login, não pode ser alterado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Telefone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="(11) 91234-5678" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Número de telefone para contato
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Endereço */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rua, número, complemento" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Cidade */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Sua cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Estado */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AC">Acre</SelectItem>
                            <SelectItem value="AL">Alagoas</SelectItem>
                            <SelectItem value="AP">Amapá</SelectItem>
                            <SelectItem value="AM">Amazonas</SelectItem>
                            <SelectItem value="BA">Bahia</SelectItem>
                            <SelectItem value="CE">Ceará</SelectItem>
                            <SelectItem value="DF">Distrito Federal</SelectItem>
                            <SelectItem value="ES">Espírito Santo</SelectItem>
                            <SelectItem value="GO">Goiás</SelectItem>
                            <SelectItem value="MA">Maranhão</SelectItem>
                            <SelectItem value="MT">Mato Grosso</SelectItem>
                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="PA">Pará</SelectItem>
                            <SelectItem value="PB">Paraíba</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="PE">Pernambuco</SelectItem>
                            <SelectItem value="PI">Piauí</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="RO">Rondônia</SelectItem>
                            <SelectItem value="RR">Roraima</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="SE">Sergipe</SelectItem>
                            <SelectItem value="TO">Tocantins</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* CEP */}
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="12345-678" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bio/Sobre mim */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobre mim</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Conte um pouco sobre você..." 
                          className="resize-none" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Esta informação não será compartilhada publicamente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}