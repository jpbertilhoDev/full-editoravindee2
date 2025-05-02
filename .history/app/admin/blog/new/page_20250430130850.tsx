"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

// Importações Firebase
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/AuthContext";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [publishDate, setPublishDate] = useState("");
  const [author, setAuthor] = useState(user?.displayName || "");
  const [imageUrl, setImageUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [featured, setFeatured] = useState("no");
  
  // Gerar slug automaticamente a partir do título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Só atualiza o slug automaticamente se o usuário ainda não tiver modificado manualmente
    if (!slug || slug === createSlug(title)) {
      setSlug(createSlug(newTitle));
    }
  };
  
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Verificar o tipo e tamanho
    if (!file.type.includes('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (PNG, JPG ou GIF).",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 2MB.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const storageRef = ref(storage, `blog-images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error("Erro no upload:", error);
          toast({
            title: "Erro no upload",
            description: "Não foi possível fazer o upload da imagem.",
            variant: "destructive",
          });
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          toast({
            title: "Upload concluído",
            description: "A imagem foi carregada com sucesso.",
          });
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error("Erro ao processar upload:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o upload.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl("");
    // Não vamos excluir do storage para evitar complexidade
    // Em uma implementação real, você pode querer excluir a imagem não utilizada
  };
  
  const handleSaveDraft = async () => {
    await savePost("draft");
  };
  
  const handlePublish = async () => {
    if (!title) {
      toast({
        title: "Título obrigatório",
        description: "O post precisa ter um título para ser publicado.",
        variant: "destructive",
      });
      return;
    }
    
    if (!slug) {
      toast({
        title: "URL Slug obrigatório",
        description: "Defina um slug para a URL do post.",
        variant: "destructive",
      });
      return;
    }
    
    if (!publishDate && status === "published") {
      // Se for publicar agora, definir a data como hoje
      setPublishDate(new Date().toISOString().split('T')[0]);
    }
    
    await savePost("published");
  };
  
  const savePost = async (saveStatus: string) => {
    setIsSaving(true);
    
    try {
      const postData = {
        title,
        slug: slug || createSlug(title),
        excerpt,
        content,
        category,
        status: saveStatus,
        date: publishDate || (saveStatus === "published" ? new Date().toISOString().split('T')[0] : ""),
        author: author || user?.displayName || "Admin",
        imageUrl,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        featured,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Usar slug como ID do documento para facilitar consultas e URL amigáveis
      const customId = slug || createSlug(title);
      const docRef = await addDoc(collection(db, "blogPosts"), postData);
      
      toast({
        title: saveStatus === "published" ? "Post publicado" : "Rascunho salvo",
        description: saveStatus === "published" 
          ? "Seu post foi publicado com sucesso." 
          : "Seu rascunho foi salvo com sucesso.",
      });
      
      router.push("/admin/blog");
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o post. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Novo Post</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving && status === "draft" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Salvar Rascunho
          </Button>
          <Button onClick={handlePublish} disabled={isSaving}>
            {isSaving && status === "published" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Publicar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Digite o título do post" 
                  className="text-lg border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea 
                  id="excerpt" 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descrição do post (exibida nas listagens)"
                  rows={3}
                  className="resize-none border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <div className="border rounded-md min-h-[400px] p-4 bg-white">
                  <div className="border-b pb-2 mb-4 flex gap-2 flex-wrap">
                    {/* Controles do Editor - Em um app real, use uma biblioteca como TipTap, CKEditor, etc. */}
                    <Button variant="outline" size="sm">
                      <b>B</b>
                    </Button>
                    <Button variant="outline" size="sm">
                      <i>I</i>
                    </Button>
                    <Button variant="outline" size="sm">
                      <u>U</u>
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button variant="outline" size="sm">H1</Button>
                    <Button variant="outline" size="sm">H2</Button>
                    <Button variant="outline" size="sm">H3</Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button variant="outline" size="sm">Lista</Button>
                    <Button variant="outline" size="sm">Citação</Button>
                    <Button variant="outline" size="sm">Link</Button>
                    <Button variant="outline" size="sm">Imagem</Button>
                  </div>
                  <Textarea 
                    id="content" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escreva o conteúdo do seu post aqui... (Em um app real, isto seria um editor de texto rico)"
                    rows={15}
                    className="resize-none border-0 p-0 focus-visible:ring-0 placeholder:text-gray-400"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Escreva seu post usando formatação de texto rico. Adicione imagens, links e formatação para deixar seu conteúdo mais atraente.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configurações SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Título</Label>
                <Input 
                  id="meta-title" 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Título SEO (se diferente do título do post)"
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Descrição</Label>
                <Textarea 
                  id="meta-description" 
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Breve descrição para motores de busca"
                  rows={3}
                  className="resize-none border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
                <p className="text-sm text-gray-500">
                  Tamanho recomendado: 150-160 caracteres
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input 
                  id="slug" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-do-post"
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
                <p className="text-xs text-gray-500">
                  Será gerado automaticamente a partir do título se deixado em branco
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="devotional">Devocional</SelectItem>
                    <SelectItem value="book-reviews">Resenhas de Livros</SelectItem>
                    <SelectItem value="faith">Fé</SelectItem>
                    <SelectItem value="parenting">Parentalidade</SelectItem>
                    <SelectItem value="bible-study">Estudo Bíblico</SelectItem>
                    <SelectItem value="prayer">Oração</SelectItem>
                    <SelectItem value="leadership">Liderança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input 
                  id="author" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nome do autor"
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured">Post em Destaque</Label>
                <Select 
                  value={featured}
                  onValueChange={setFeatured}
                >
                  <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                    <SelectValue placeholder="Status de destaque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Não</SelectItem>
                    <SelectItem value="yes">Sim</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Posts em destaque aparecem no topo do blog
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Imagem Destacada</CardTitle>
            </CardHeader>
            <CardContent>
              {imageUrl ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100">
                    <img 
                      src={imageUrl}
                      alt="Imagem de destaque"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={handleUploadClick}>Alterar Imagem</Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={handleRemoveImage}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={handleUploadClick}>
                  {isUploading ? (
                    <div className="py-4">
                      <Loader2 className="h-10 w-10 text-[#08a4a7] mx-auto animate-spin mb-2" />
                      <p className="text-sm text-gray-500">Enviando... {uploadProgress}%</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm">Carregar Imagem</Button>
                      <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG, GIF até 2MB
                      </p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Opções de Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publish-date">Data de Publicação</Label>
                <Input 
                  id="publish-date" 
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 