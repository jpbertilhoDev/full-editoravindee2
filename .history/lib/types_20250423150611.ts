export interface Product {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  format: 'Paperback' | 'Hardcover' | 'eBook' | 'Audiobook';
  coverImage: string;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  featured?: boolean;
  bestSeller?: boolean;
  newRelease?: boolean;
  inStock: boolean;
  stockQuantity?: number;
  relatedProducts?: string[];
  publishDate: string;
  publisher: string;
  isbn: string;
  pages: number;
  language: string;
  dimensions?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  helpful: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image?: string;
  books: string[]; // Product IDs
}

export interface TestimonialType {
  id: string;
  name: string;
  role?: string;
  content: string;
  image?: string;
  rating: number;
}