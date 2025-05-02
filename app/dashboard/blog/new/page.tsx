import { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Create New Blog Post | Dashboard",
  description: "Create a new blog post for your website",
};

export default function NewBlogPostPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Create New Post</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish</Button>
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
                  placeholder="Enter post title" 
                  className="text-lg border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt" 
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
                  placeholder="SEO title (if different from post title)"
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea 
                  id="meta-description" 
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
                  placeholder="post-url-slug"
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
                <p className="text-xs text-gray-500">
                  Will be auto-generated from title if left empty
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
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
                <Select defaultValue="current-user">
                  <SelectTrigger className="border-[#08a4a7]/20 focus:ring-[#0bdbb6]">
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-user">Current User (You)</SelectItem>
                    <SelectItem value="guest">Guest Author</SelectItem>
                    {/* In a real app, this would list all authorized authors */}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured">Featured Post</Label>
                <Select defaultValue="no">
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="draft">
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
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" asChild>
                <Link href="/dashboard/blog">Cancel</Link>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button>Publish Post</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 