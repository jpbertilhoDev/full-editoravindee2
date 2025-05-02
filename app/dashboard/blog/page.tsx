import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash, 
  Eye, 
  Calendar, 
  User, 
  Tag,
  ArrowUpDown,
  ChevronDown 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Manage Blog | Dashboard",
  description: "Manage your blog posts and articles",
};

// This would typically come from a CMS or database
const posts = [
  {
    id: "1",
    title: "Finding Peace in Scripture: A Daily Practice",
    excerpt: "Discover how establishing a daily scripture reading routine can transform your spiritual life and bring lasting peace.",
    date: "June 15, 2023",
    author: "Sarah Johnson",
    category: "Devotional",
    imageUrl: "/images/blog/featured-1.jpg",
    slug: "finding-peace-in-scripture",
    status: "published",
  },
  {
    id: "2",
    title: "Top 10 Christian Books for Spiritual Growth in 2023",
    excerpt: "Explore our curated list of this year's most impactful books to deepen your faith and understanding.",
    date: "May 28, 2023",
    author: "Michael Roberts",
    category: "Book Reviews",
    imageUrl: "/images/blog/featured-2.jpg",
    slug: "top-christian-books-2023",
    status: "published",
  },
  {
    id: "3",
    title: "The Power of Community Prayer",
    excerpt: "How gathering together in prayer can strengthen faith and create powerful spiritual connections.",
    date: "June 2, 2023",
    author: "Daniel Smith",
    category: "Faith",
    imageUrl: "/images/blog/post-1.jpg",
    slug: "power-of-community-prayer",
    status: "published",
  },
  {
    id: "4",
    title: "Prayer Practices for Busy Professionals",
    excerpt: "Finding meaningful ways to connect with God amidst hectic schedules and demanding careers.",
    date: "Draft",
    author: "Sarah Johnson",
    category: "Prayer",
    imageUrl: "",
    slug: "",
    status: "draft",
  },
  {
    id: "5",
    title: "Understanding the Book of Revelation",
    excerpt: "A thoughtful exploration of one of the Bible's most complex and misunderstood books.",
    date: "Scheduled for July 10, 2023",
    author: "Thomas Wilson",
    category: "Bible Study",
    imageUrl: "/images/blog/post-5.jpg",
    slug: "understanding-revelation",
    status: "scheduled",
  },
];

export default function BlogManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
          <p className="text-gray-500">
            Create and manage your blog posts
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            Manage your published, scheduled, and draft blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search posts..." 
                className="pl-9 border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Tag className="h-4 w-4" />
                    <span>Category</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Categories</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Devotional</DropdownMenuItem>
                  <DropdownMenuItem>Book Reviews</DropdownMenuItem>
                  <DropdownMenuItem>Faith</DropdownMenuItem>
                  <DropdownMenuItem>Bible Study</DropdownMenuItem>
                  <DropdownMenuItem>Prayer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Status</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Status</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Published</DropdownMenuItem>
                  <DropdownMenuItem>Draft</DropdownMenuItem>
                  <DropdownMenuItem>Scheduled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Blog post table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[440px]">
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          {post.imageUrl ? (
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-gray-100">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="line-clamp-1 font-medium">{post.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {post.status === 'published' && (
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/blog/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <DeletePostDialog id={post.id} title={post.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-24">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No blog posts yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first blog post.</p>
              <Button asChild>
                <Link href="/dashboard/blog/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Post
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Blog Stats</CardTitle>
          <CardDescription>
            Overview of your blog performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#08a4a7]/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#08a4a7] mb-1">Total Posts</h3>
              <p className="text-3xl font-bold">{posts.length}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-1">Published</h3>
              <p className="text-3xl font-bold">{posts.filter(post => post.status === 'published').length}</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">Drafts</h3>
              <p className="text-3xl font-bold">{posts.filter(post => post.status === 'draft').length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Published</Badge>;
    case 'draft':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Draft</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Scheduled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function DeletePostDialog({ id, title }: { id: string, title: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
          <DialogDescription>
            This will permanently delete the post "{title}" and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 