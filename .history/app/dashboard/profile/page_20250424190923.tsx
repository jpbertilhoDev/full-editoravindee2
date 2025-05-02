"use client";

import React, { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  User, Mail, Phone, Home, MapPin, Shield, 
  Save, RefreshCw, Camera, X, Upload, Trash2
} from 'lucide-react';
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, auth, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

// Schemas de validação
const profileFormSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  bio: z.string().optional(),
});

const addressFormSchema = z.object({
  street: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  city: z.string().min(2, "Cidade é obrigatória"),
  postalCode: z.string().min(4, "Código postal inválido"),
  country: z.string().min(2, "País é obrigatório"),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(8, "A confirmação de senha deve ter pelo menos 8 caracteres"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Tipos para os formulários
type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AddressFormValues = z.infer<typeof addressFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, refreshUserData } = useAuth();
  
  // Formulário de Perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
    },
  });
  
  // Formulário de Endereço
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: "",
      number: "",
      complement: "",
      city: "",
      postalCode: "",
      country: "Portugal",
    },
  });
  
  // Formulário de Segurança
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    if (user) {
      // Carregar dados do perfil do Firestore
      const loadUserData = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Separar nome completo em primeiro nome e sobrenome
            const nameParts = (user.displayName || "").split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";
            
            // Atualizar formulário de perfil
            profileForm.reset({
              firstName,
              lastName,
              email: user.email || "",
              phone: userData.phone || "",
              bio: userData.bio || "",
            });
            
            // Atualizar formulário de endereço se houver dados
            if (userData.address) {
              addressForm.reset({
                street: userData.address.street || "",
                number: userData.address.number || "",
                complement: userData.address.complement || "",
                city: userData.address.city || "",
                postalCode: userData.address.postalCode || "",
                country: userData.address.country || "Portugal",
              });
            }
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
      
      loadUserData();
    }
  }, [user, profileForm, addressForm]);
  
  // Monitorar mudanças no perfil do usuário (incluindo foto)
  useEffect(() => {
    if (user && user.photoURL) {
      // Definir a URL da imagem do perfil quando o usuário muda
      setAvatarFile(null); // Limpar o arquivo local
    }
  }, [user]);
  
  // Adicionar efeito para forçar atualização da exibição do avatar
  useEffect(() => {
    // Cada vez que o photoURL mudar, gerar nova chave para forçar re-render
    if (user?.photoURL) {
      setAvatarKey(Date.now());
      console.log("Avatar key atualizada para forçar re-render:", avatarKey);
    }
  }, [user?.photoURL]);
  
  // Manipuladores de envio dos formulários
  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Atualizar nome no perfil do Firebase Auth
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      // Preservar a foto de perfil atual
      await updateProfile(auth.currentUser!, {
        displayName: fullName
      });
      
      // Atualizar dados no Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName: fullName,
        phone: data.phone,
        bio: data.bio,
        updatedAt: new Date()
      });
      
      // Atualizar os dados do usuário no contexto
      if (refreshUserData) {
        await refreshUserData();
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações pessoais foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onAddressSubmit = async (data: AddressFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Atualizar dados de endereço no Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        address: {
          street: data.street,
          number: data.number,
          complement: data.complement,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country
        },
        updatedAt: new Date()
      });
      
      toast({
        title: "Endereço atualizado",
        description: "Suas informações de endereço foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSecuritySubmit = async (data: SecurityFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Importar a função updatePassword e reauthenticateWithCredential
      const { updatePassword, reauthenticateWithCredential, EmailAuthProvider } = await import('firebase/auth');
      
      // Reautenticar o usuário com a senha atual
      const credential = EmailAuthProvider.credential(
        user.email!,
        data.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser!, credential);
      
      // Atualizar a senha
      await updatePassword(auth.currentUser!, data.newPassword);
      
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      let errorMessage = "Não foi possível atualizar sua senha. Tente novamente.";
      
      // Verificar o tipo de erro
      if (error.code === 'auth/wrong-password') {
        errorMessage = "A senha atual está incorreta.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Por motivos de segurança, é necessário fazer login novamente antes de alterar sua senha.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const compressImage = (file: File, maxWidth = 500, maxHeight = 500): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calcular as dimensões mantendo a proporção
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round(height * maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round(width * maxHeight / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprimir para JPEG com qualidade 0.8 (80%)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        };
        img.onerror = (error) => {
          reject(error);
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  const handleRemoveAvatar = async () => {
    if (!user) return;
    
    try {
      setIsRemovingPhoto(true);
      
      // Tentar encontrar e excluir arquivos antigos no Storage
      if (user.photoURL) {
        try {
          // Extrair o nome do arquivo da URL completa
          const urlParts = user.photoURL.split('/');
          const filename = urlParts[urlParts.length - 1].split('?')[0];
          
          if (filename && filename.includes('avatar_')) {
            const oldAvatarRef = ref(storage, `avatars/${filename}`);
            await deleteObject(oldAvatarRef).catch(err => console.log('Arquivo não encontrado, continuando:', err));
            console.log('Arquivo antigo removido do Storage:', filename);
          }
        } catch (storageError) {
          console.log('Erro ao tentar remover arquivo antigo (não crítico):', storageError);
          // Continuar mesmo se falhar, pois isso não é crítico
        }
      }
      
      // Atualizar o perfil do usuário no Auth
      await updateProfile(auth.currentUser!, {
        photoURL: null
      });
      
      console.log("Foto removida do Auth");
      
      // Remover foto do Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        photoURL: null,
        updatedAt: new Date()
      });
      
      console.log("Foto removida do Firestore");
      
      // Limpar o avatar local imediatamente
      setAvatarFile(null);
      
      // Forçar atualização dos dados do usuário
      if (refreshUserData) {
        await refreshUserData();
        console.log("Dados do usuário atualizados após remoção");
      }
      
      toast({
        title: "Foto removida",
        description: "Sua foto de perfil foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro detalhado ao remover avatar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover sua foto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsRemovingPhoto(false);
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    try {
      setIsUploading(true);
      
      const file = e.target.files[0];
      console.log("Arquivo original:", file.name, file.type, file.size);
      
      // Comprimir a imagem antes de fazer upload
      const compressedImage = await compressImage(file);
      
      // Mostrar imagem comprimida imediatamente no UI
      setAvatarFile(compressedImage);
      
      // Criar um novo arquivo a partir do blob para upload
      const timestamp = Date.now();
      const filename = `avatar_${user.uid}_${timestamp}.jpg`;
      
      // Converter a URL de dados em Blob
      const response = await fetch(compressedImage);
      const blob = await response.blob();
      
      // Criar um novo arquivo para upload com tipo correto
      const imageFile = new File([blob], filename, { type: 'image/jpeg' });
      console.log("Arquivo para upload:", imageFile.name, imageFile.type, imageFile.size);
      
      // Preparar referência para upload
      const storageRef = ref(storage, `avatars/${filename}`);
      
      // Upload para o Firebase Storage
      const uploadTask = await uploadBytes(storageRef, imageFile);
      console.log("Upload concluído:", uploadTask.metadata);
      
      // Obter URL de download da imagem
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log("URL gerada:", downloadURL);
      
      // Aplicar uma pequena pausa para garantir que o storage processou a imagem
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Salvar URL no Firestore primeiro
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        photoURL: downloadURL,
        avatarUpdatedAt: serverTimestamp()
      });
      console.log("URL salva no Firestore");
      
      // Depois atualizar o Auth
      await updateProfile(auth.currentUser!, {
        photoURL: downloadURL
      });
      console.log("Auth profile atualizado");
      
      // Forçar refresh explícito dos dados do usuário
      if (refreshUserData) {
        await refreshUserData();
        console.log("Contexto do usuário atualizado");
      }
      
      // Atualizar a chave do avatar para forçar re-render da imagem
      setAvatarKey(Date.now());
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Erro detalhado ao atualizar avatar:", error);
      setAvatarFile(null);
      
      toast({
        title: "Erro",
        description: "Não foi possível atualizar sua foto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
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
              <Avatar className="h-28 w-28 relative overflow-hidden">
                {avatarFile ? (
                  // Imagem local temporária durante upload
                  <>
                    <AvatarImage 
                      src={avatarFile} 
                      alt={user?.displayName || ''}
                      className="object-cover w-full h-full"
                      onError={() => {
                        console.error("Erro ao carregar imagem local");
                        setAvatarFile(null);
                      }}
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <RefreshCw className="h-8 w-8 text-white animate-spin" />
                      </div>
                    )}
                  </>
                ) : user?.photoURL ? (
                  // Foto do Firebase Auth com indicador de carregamento e usando key para forçar re-render
                  <>
                    <AvatarImage 
                      key={avatarKey} // Forçar re-render quando o usuário muda
                      src={`${user.photoURL}?v=${avatarKey}`} // Cache-busting
                      alt={user.displayName || ''}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.error("Erro ao carregar imagem do perfil");
                        const target = e.target as HTMLImageElement;
                        if (target) target.style.display = 'none';
                      }}
                    />
                  </>
                ) : (
                  // Fallback quando não há foto
                  <AvatarFallback className="bg-[#08a4a7] text-xl">
                    {user?.displayName?.split(' ').map(n => n?.[0] || '').join('') || (user?.email?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
                aria-label="Upload de foto de perfil"
                title="Selecione uma imagem para o seu perfil"
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
                
                {(user?.photoURL || avatarFile) && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-8 w-8 border-2 border-white bg-white shadow-md"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading || isRemovingPhoto}
                    title="Remover foto"
                  >
                    {isRemovingPhoto ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium">{user?.displayName || 'Usuário'}</h3>
              <p className="text-muted-foreground text-sm">Cliente desde {new Date(user?.metadata?.creationTime || Date.now()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
              <p className="text-xs text-muted-foreground mt-2">Clique no ícone de câmera para alterar sua foto</p>
            </div>
            
            <div className="w-full mt-6 pt-4 border-t">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>{user?.email || '-'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>{profileForm.watch('phone') || '-'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Home className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>{addressForm.watch('city') ? `${addressForm.watch('city')}, ${addressForm.watch('country')}` : '-'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      
        {/* Form Tabs */}
        <Card className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
              <TabsList className="grid grid-cols-3 w-full max-w-sm">
                <TabsTrigger value="personal" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Pessoal</span>
                </TabsTrigger>
                <TabsTrigger value="address" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Endereço</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Segurança</span>
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="pb-0">
              <TabsContent value="personal" className="mt-0">
                <div className="space-y-6">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sobrenome</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu sobrenome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="seu@email.com" 
                                  {...field} 
                                  disabled={true}
                                />
                              </FormControl>
                              <FormDescription>
                                O email não pode ser alterado
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sobre você</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Conte-nos um pouco sobre você e seus interesses de leitura" 
                                className="h-24 resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Essas informações nos ajudam a personalizar recomendações para você.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-[#08a4a7] hover:bg-[#08a4a7]/90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Salvar Alterações
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              <TabsContent value="address" className="mt-0">
                <div className="space-y-6">
                  <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <FormField
                            control={addressForm.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rua/Avenida</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome da rua ou avenida" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={addressForm.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={addressForm.control}
                          name="complement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input placeholder="Apartamento, bloco, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addressForm.control}
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
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={addressForm.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Postal</FormLabel>
                              <FormControl>
                                <Input placeholder="1000-100" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addressForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>País</FormLabel>
                              <FormControl>
                                <Select 
                                  value={field.value} 
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um país" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Portugal">Portugal</SelectItem>
                                    <SelectItem value="Espanha">Espanha</SelectItem>
                                    <SelectItem value="França">França</SelectItem>
                                    <SelectItem value="Alemanha">Alemanha</SelectItem>
                                    <SelectItem value="Itália">Itália</SelectItem>
                                    <SelectItem value="Reino Unido">Reino Unido</SelectItem>
                                    <SelectItem value="Holanda">Holanda</SelectItem>
                                    <SelectItem value="Bélgica">Bélgica</SelectItem>
                                    <SelectItem value="Suíça">Suíça</SelectItem>
                                    <SelectItem value="Áustria">Áustria</SelectItem>
                                    <SelectItem value="Irlanda">Irlanda</SelectItem>
                                    <SelectItem value="Grécia">Grécia</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-[#08a4a7] hover:bg-[#08a4a7]/90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Salvar Endereço
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <div className="space-y-6">
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                      <FormField
                        control={securityForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Separator className="my-4" />
                      
                      <FormField
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormDescription>
                              A senha deve ter pelo menos 8 caracteres.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-[#08a4a7] hover:bg-[#08a4a7]/90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Atualizando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Atualizar Senha
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Alert for data changes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Sobre seus dados pessoais</p>
              <p className="text-sm text-blue-700 mt-1">
                Valorizamos sua privacidade. Suas informações são usadas apenas para melhorar sua experiência de compra e nunca são compartilhadas com terceiros sem sua permissão.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 