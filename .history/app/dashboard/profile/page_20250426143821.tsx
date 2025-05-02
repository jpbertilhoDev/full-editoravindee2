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

export default function ProfilePage() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState<number>(Date.now());
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuth();

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
    if (!e.target.files || !e.target.files[0] || !user?.uid) {
      console.error("Erro: Arquivo não selecionado ou usuário não autenticado");
      return;
    }
    
    const file = e.target.files[0];
    console.log("Arquivo selecionado:", file.name, "Tamanho:", file.size, "Tipo:", file.type);
    
    // Validar o tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, escolha uma imagem com menos de 5MB",
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
      
      console.log("Iniciando upload para usuário:", user.uid);
      
      // Referência para o storage do Firebase
      const storageRef = ref(storage, `avatars/${user.uid}`);
      
      // Upload do arquivo
      console.log("Enviando arquivo para Firebase Storage...");
      await uploadBytes(storageRef, file);
      console.log("Upload concluído com sucesso");
      
      // Obter a URL de download
      console.log("Obtendo URL de download...");
      const downloadURL = await getDownloadURL(storageRef);
      console.log("URL de download obtida:", downloadURL);
      
      // Atualizar o perfil do usuário no Authentication
      if (auth.currentUser) {
        console.log("Atualizando perfil do usuário no Authentication...");
        await updateProfile(auth.currentUser, {
          photoURL: downloadURL
        });
        console.log("Perfil do Authentication atualizado");
      }
      
      // Atualizar os dados do usuário no Firestore
      console.log("Atualizando dados do usuário no Firestore...");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: serverTimestamp()
      });
      console.log("Documento do Firestore atualizado");
      
      // Atualizar o estado local
      console.log("Atualizando estado local do usuário...");
      setUser({
        ...user,
        photoURL: downloadURL
      });
      
      // Revogar a URL do objeto criado para evitar vazamento de memória
      URL.revokeObjectURL(fileURL);
      setAvatarFile(null);
      
      // Atualizar a chave para forçar a recarga da imagem (evita cache)
      setAvatarKey(Date.now());
      
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
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Função para remover a foto de perfil
  const handleRemoveAvatar = async () => {
    if (!user?.uid || !user?.photoURL) return;
    
    try {
      setIsRemovingPhoto(true);
      
      // Referência para o storage do Firebase
      const storageRef = ref(storage, `avatars/${user.uid}`);
      
      // Tentar remover a imagem do storage (pode falhar se o caminho não for exato)
      try {
        await deleteObject(storageRef);
      } catch (error) {
        console.warn("Aviso: Não foi possível excluir o arquivo do storage", error);
        // Continuar mesmo se falhar, pois pode ser que a URL não corresponda exatamente
      }
      
      // Atualizar o perfil do usuário no Authentication
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: null
        });
      }
      
      // Atualizar os dados do usuário no Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: null,
        updatedAt: serverTimestamp()
      });
      
      // Atualizar o estado local
      setUser({
        ...user,
        photoURL: null
      });
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil removida com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao remover a foto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover sua foto. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsRemovingPhoto(false);
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
                
                {user?.photoURL && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-8 w-8 border-2 border-white bg-white shadow-md"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading || isRemovingPhoto}
                    title="Remover foto"
                  >
                    {isRemovingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
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