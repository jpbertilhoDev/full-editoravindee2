"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "@/components/ui/use-toast";

// This would typically come from a database fetch
const postsData = [
  {
    id: "1",
    title: "Finding Peace in Scripture: A Daily Practice",
    excerpt: "Discover how establishing a daily scripture reading routine can transform your spiritual life and bring lasting peace.",
    content: `
<p>In today's fast-paced world, finding moments of peace and spiritual connection can seem like an impossible task. Yet, the ancient practice of daily scripture reading offers a timeless solution to this modern problem.</p>

<h2>The Power of Daily Scripture</h2>
<p>When we make time each day to engage with scripture, we create space for divine wisdom to enter our lives. This isn't just about religious obligation—it's about establishing a relationship with the text that sustains and guides us through life's challenges.</p>

<p>Studies have shown that regular engagement with meaningful texts can reduce stress and anxiety, while increasing feelings of hope and purpose. Scripture, with its depth and breadth of human experience, offers particularly rich ground for this kind of engagement.</p>

<h2>Creating a Sustainable Practice</h2>
<p>The key to establishing a lasting scripture practice isn't in marathon reading sessions, but in consistency. Here are some approaches that have helped many establish a sustainable practice:</p>

<ul>
  <li><strong>Start small</strong> - Even just 5-10 minutes each day can be transformative</li>
  <li><strong>Same time, same place</strong> - Creating environmental cues helps establish habits</li>
  <li><strong>Journaling</strong> - Writing responses to scripture helps deepen engagement</li>
  <li><strong>Community</strong> - Sharing insights with others enriches understanding</li>
</ul>
    `,
    date: "2023-06-15",
    author: "Sarah Johnson",
    category: "devotional",
    imageUrl: "/images/blog/featured-1.jpg",
    slug: "finding-peace-in-scripture",
    status: "published",
    metaTitle: "Finding Peace in Scripture: Daily Reading Practices",
    metaDescription: "Learn how establishing a daily scripture reading routine can transform your spiritual life and bring lasting peace in our chaotic world.",
    featured: "yes"
  },
  {
    id: "2",
    title: "Top 10 Christian Books for Spiritual Growth in 2023",
    excerpt: "Explore our curated list of this year's most impactful books to deepen your faith and understanding.",
    content: `<p>With so many new releases each year, finding the right books to nurture your spiritual journey can be overwhelming. We've compiled this carefully curated list of the most impactful Christian books released in 2023 to help you discover your next meaningful read.</p>

<h2>Our Selection Criteria</h2>
<p>These books were selected based on their theological depth, practical wisdom, writing quality, and reader impact. Each offers something unique for believers at different stages of their faith journey.</p>

<h2>The Top 10 List</h2>

<h3>1. "Faithful Presence" by David Thompson</h3>
<p>This thoughtful exploration of Christian community in a digital age offers practical wisdom for maintaining authentic connections in an increasingly fragmented world.</p>
    `,
    date: "2023-05-28",
    author: "Michael Roberts",
    category: "book-reviews",
    imageUrl: "/images/blog/featured-2.jpg",
    slug: "top-christian-books-2023",
    status: "published",
    metaTitle: "Top 10 Christian Books for Spiritual Growth in 2023",
    metaDescription: "Discover our carefully curated list of 2023's most impactful Christian books to deepen your faith journey.",
    featured: "yes"
  },
  {
    id: "3",
    title: "The Power of Community Prayer",
    excerpt: "How gathering together in prayer can strengthen faith and create powerful spiritual connections.",
    content: `<p>Community prayer has been a cornerstone of faith practices across cultures and centuries. When believers gather to pray together, something powerful happens that goes beyond individual spiritual practice.</p>`,
    date: "2023-06-02",
    author: "Daniel Smith",
    category: "faith",
    imageUrl: "/images/blog/post-1.jpg",
    slug: "power-of-community-prayer",
    status: "published",
    metaTitle: "",
    metaDescription: "",
    featured: "no"
  },
  {
    id: "4",
    title: "Prayer Practices for Busy Professionals",
    excerpt: "Finding meaningful ways to connect with God amidst hectic schedules and demanding careers.",
    content: `<p>Draft content for prayer practices article...</p>`,
    date: "",
    author: "Sarah Johnson",
    category: "prayer",
    imageUrl: "",
    slug: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    featured: "no"
  },
  {
    id: "5",
    title: "Understanding the Book of Revelation",
    excerpt: "A thoughtful exploration of one of the Bible's most complex and misunderstood books.",
    content: `<p>The Book of Revelation has fascinated and puzzled readers for centuries...</p>`,
    date: "2023-07-10",
    author: "Thomas Wilson",
    category: "bible-study",
    imageUrl: "/images/blog/post-5.jpg",
    slug: "understanding-revelation",
    status: "scheduled",
    metaTitle: "",
    metaDescription: "",
    featured: "no"
  },
];

// Simulation of our blog post type
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  slug: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  featured: string;
  [key: string]: any; // For other potential fields
}

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState<BlogPost | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Simulate fetching post data
  useEffect(() => {
    const post = postsData.find(post => post.id === postId);
    
    if (post) {
      setPostData(post);
      setIsLoading(false);
    } else {
      // Post not found
      toast({
        title: "Post not found",
        description: "The requested post could not be found.",
        variant: "destructive",
      });
      router.push("/dashboard/blog");
    }
  }, [postId, router]);
  
  const handleInputChange = (field: string, value: string) => {
    setPostData((prev: BlogPost | null) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
    setUnsavedChanges(true);
  };
  
  const handleSaveDraft = () => {
    // Simulate saving draft
    toast({
      title: "Draft saved",
      description: "Your post has been saved as a draft."
    });
    setUnsavedChanges(false);
  };
  
  const handlePublish = () => {
    // Simulate publishing
    toast({
      title: "Post published",
      description: "Your post has been published successfully."
    });
    setUnsavedChanges(false);
    router.push("/dashboard/blog");
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-[#08a4a7] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/dashboard/blog">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Post</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
          <Button onClick={handlePublish}>
            {postData.status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={postData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter post title" 
                  className="text-lg border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  value={postData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Brief description of the post (displayed in listings)"
                  rows={3}
                  className="resize-none border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="border rounded-md min-h-[400px] p-4 bg-white">
                  <div className="border-b pb-2 mb-4 flex gap-2 flex-wrap">
                    {/* Simple Rich Text Editor Controls - In a real app, use a library like TipTap, CKEditor, etc. */}
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
                    <Button variant="outline" size="sm">List</Button>
                    <Button variant="outline" size="sm">Quote</Button>
                    <Button variant="outline" size="sm">Link</Button>
                    <Button variant="outline" size="sm">Image</Button>
                  </div>
                  <Textarea 
                    id="content" 
                    value={postData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Write your post content here... (In a real app, this would be a rich text editor)"
                    rows={15}
                    className="resize-none border-0 p-0 focus-visible:ring-0 placeholder:text-gray-400"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Write your post using rich text formatting. Add images, links, and formatting to make your content engaging.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input 
                  id="meta-title" 
                  value={postData.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="SEO title (if different from post title)"
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea 
                  id="meta-description" 
                  value={postData.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="Brief description for search engines"
                  rows={3}
                  className="resize-none border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
                <p className="text-sm text-gray-500">
                  Recommended length: 150-160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input 
                  id="slug" 
                  value={postData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="post-url-slug"
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
                <p className="text-xs text-gray-500">
                  Will be auto-generated from title if left empty
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={postData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="devotional">Devotional</SelectItem>
                    <SelectItem value="book-reviews">Book Reviews</SelectItem>
                    <SelectItem value="faith">Faith</SelectItem>
                    <SelectItem value="parenting">Parenting</SelectItem>
                    <SelectItem value="bible-study">Bible Study</SelectItem>
                    <SelectItem value="prayer">Prayer</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Select 
                  value={postData.author === "Sarah Johnson" ? "current-user" : "guest"}
                  onValueChange={(value) => handleInputChange("author", value === "current-user" ? "Sarah Johnson" : "Guest Author")}
                >
                  <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-user">Current User (You)</SelectItem>
                    <SelectItem value="guest">Guest Author</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured">Featured Post</Label>
                <Select 
                  value={postData.featured}
                  onValueChange={(value) => handleInputChange("featured", value)}
                >
                  <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                    <SelectValue placeholder="Featured status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Featured posts appear at the top of the blog
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {postData.imageUrl ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100">
                    <img 
                      src={postData.imageUrl}
                      alt={postData.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">Change Image</Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <Button variant="outline" size="sm">Upload Image</Button>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF up to 2MB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={postData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publish-date">Publish Date</Label>
                <Input 
                  id="publish-date" 
                  type="date"
                  value={postData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/blog">Cancel</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Post</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the post
                        "{postData.title}" and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          toast({
                            title: "Post deleted",
                            description: "The post has been deleted successfully."
                          });
                          router.push("/dashboard/blog");
                        }}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
                <Button onClick={handlePublish}>
                  {postData.status === "published" ? "Update" : "Publish"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 