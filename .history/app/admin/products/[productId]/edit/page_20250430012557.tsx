"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Plus, X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc, deleteField, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Definir esquema de validação
const productSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  price: z.coerce.number().positive({ message: "O preço deve ser maior que zero" }),
  discountedPrice: z.coerce.number().positive().optional(),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  author: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().nonnegative({ message: "O estoque não pode ser negativo" }),
  featured: z.boolean().default(false),
  status: z.enum(["active", "draft", "out_of_stock"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Tipo estendido para incluir a propriedade images que é adicionada durante o update
interface ProductData extends ProductFormValues {
  updatedAt: Date;
  images?: string[];
}

export default function EditProductPage({ params }: { params: { productId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { productId } = params;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Configurar formulário
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      featured: false,
      status: "active",
    },
  });

  // Carregar dados do produto
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Obter dados do produto
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
        
        if (!productSnap.exists()) {
          toast({
            title: "Erro",
            description: "Produto não encontrado",
            variant: "destructive",
          });
          router.push("/admin/products");
          return;
        }
        
        const productData = productSnap.data();
        
        // Carregar valores no formulário
        form.reset({
          title: productData.title || "",
          description: productData.description || "",
          price: productData.price || 0,
          discountedPrice: productData.discountedPrice || undefined,
          category: productData.category || "",
          author: productData.author || "",
          publisher: productData.publisher || "",
          isbn: productData.isbn || "",
          sku: productData.sku || "",
          stock: productData.stock || 0,
          featured: productData.featured || false,
          status: productData.status || "active",
        });
        
        // Carregar imagens
        if (productData.images && Array.isArray(productData.images)) {
          setImages(productData.images);
        }
        
        // Buscar categorias disponíveis
        const categoriesRef = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().name);
        setCategories(categoriesList);
        
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do produto",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId, router, toast, form]);

  // Manipular upload de imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const files = Array.from(event.target.files);
    setNewImages(prev => [...prev, ...files]);
    
    // Criar previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Limpar input
    event.target.value = '';
  };

  // Remover imagem
  const handleRemoveImage = (index: number) => {
    // Se for uma imagem nova (ainda não salva)
    if (index >= images.length - newImages.length) {
      const newImageIndex = index - (images.length - newImages.length);
      setNewImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Enviar formulário
  const onSubmit = async (data: ProductFormValues) => {
    setSaving(true);
    try {
      // Preparar dados
      const productData = {
        ...data,
        updatedAt: new Date(),
      };
      
      // Remover campos vazios opcionais
      if (!productData.discountedPrice) delete productData.discountedPrice;
      if (!productData.author) delete productData.author;
      if (!productData.publisher) delete productData.publisher;
      if (!productData.isbn) delete productData.isbn;
      if (!productData.sku) delete productData.sku;
      
      // Upload de novas imagens
      if (newImages.length > 0) {
        setUploading(true);
        const imageUrls = [...images.slice(0, images.length - newImages.length)];
        
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          const imageName = `products/${productId}/${Date.now()}-${file.name}`;
          const imageRef = ref(storage, imageName);
          
          await uploadBytes(imageRef, file);
          const downloadUrl = await getDownloadURL(imageRef);
          imageUrls.push(downloadUrl);
          
          // Atualizar progresso
          setUploadProgress(Math.round(((i + 1) / newImages.length) * 100));
        }
        
        productData.images = imageUrls;
        setUploading(false);
      } else if (images.length > 0) {
        productData.images = images;
      } else {
        // Se não houver imagens, remover o campo
        productData.images = deleteField() as any;
      }
      
      // Atualizar produto
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, productData);
      
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      });
      
      // Limpar novas imagens
      setNewImages([]);
      setUploadProgress(0);
      
      // Redirecionar para lista de produtos
      router.push("/admin/products");
      
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Editar Produto</h1>
          <p className="text-muted-foreground">Modifique os detalhes do produto</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList>
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
            </TabsList>
            
            {/* Informações Básicas */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Informações essenciais sobre o produto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do produto" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Descreva o produto em detalhes" 
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5">R$</span>
                              <Input 
                                {...field} 
                                type="number" 
                                step="0.01"
                                min="0"
                                className="pl-9" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="discountedPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço com Desconto (opcional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5">R$</span>
                              <Input 
                                {...field} 
                                type="number" 
                                step="0.01"
                                min="0"
                                className="pl-9" 
                                value={field.value || ''}
                                onChange={(e) => {
                                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                  field.onChange(value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category, index) => (
                                <SelectItem key={index} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estoque</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="0"
                              step="1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="draft">Rascunho</SelectItem>
                              <SelectItem value="out_of_stock">Sem Estoque</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Destaque</FormLabel>
                            <FormDescription>
                              Mostrar este produto em destaque na página inicial
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Detalhes */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes Adicionais</CardTitle>
                  <CardDescription>
                    Informações específicas para livros e controle de estoque
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autor</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome do autor" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="publisher"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Editora</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome da editora" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isbn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISBN</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Código ISBN" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Código SKU" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Imagens */}
            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Imagens do Produto</CardTitle>
                  <CardDescription>
                    Adicione ou remova imagens do produto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Visualização de imagens */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Produto ${index + 1}`} 
                          className="aspect-square w-full rounded-md object-cover border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Imagem+Inválida';
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {/* Botão de upload */}
                    <div className="flex items-center justify-center aspect-square border border-dashed rounded-md">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                      >
                        <Plus className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground mt-2">
                          Adicionar Imagem
                        </span>
                        <input
                          type="file"
                          id="image-upload"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* Barra de progresso */}
                  {uploading && (
                    <div className="mt-4">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Enviando imagens: {uploadProgress}%
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Produto
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 