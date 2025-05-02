import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Blog | Christian Bookstore",
  description: "Explore our collection of insightful articles, devotionals, and book reviews to enrich your spiritual journey.",
};

// This would typically come from a CMS or database
const featuredPosts = [
  {
    id: "1",
    title: "Finding Peace in Scripture: A Daily Practice",
    excerpt: "Discover how establishing a daily scripture reading routine can transform your spiritual life and bring lasting peace.",
    date: "June 15, 2023",
    author: "Sarah Johnson",
    category: "Devotional",
    imageUrl: "/images/blog/featured-1.jpg",
    slug: "finding-peace-in-scripture",
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
  },
];

const posts = [
  {
    id: "3",
    title: "The Power of Community Prayer",
    excerpt: "How gathering together in prayer can strengthen faith and create powerful spiritual connections.",
    date: "June 2, 2023",
    author: "Daniel Smith",
    category: "Faith",
    imageUrl: "/images/blog/post-1.jpg",
    slug: "power-of-community-prayer",
  },
  {
    id: "4",
    title: "Children's Bible Stories: Age-Appropriate Teaching",
    excerpt: "A guide for parents on how to introduce biblical concepts to children of different ages.",
    date: "May 15, 2023",
    author: "Emma Davis",
    category: "Parenting",
    imageUrl: "/images/blog/post-2.jpg",
    slug: "childrens-bible-stories",
  },
  {
    id: "5",
    title: "Understanding the Psalms: A Modern Perspective",
    excerpt: "How ancient psalms continue to speak to our modern challenges and provide comfort in difficult times.",
    date: "May 10, 2023",
    author: "Thomas Wilson",
    category: "Bible Study",
    imageUrl: "/images/blog/post-3.jpg",
    slug: "understanding-psalms",
  },
  {
    id: "6",
    title: "Christian Fiction: Entertainment with Purpose",
    excerpt: "Exploring how fiction with Christian themes can both entertain and inspire spiritual growth.",
    date: "April 28, 2023",
    author: "Rebecca Andrews",
    category: "Book Reviews",
    imageUrl: "/images/blog/post-4.jpg",
    slug: "christian-fiction",
  },
  {
    id: "7",
    title: "Seasonal Devotionals: Connecting Faith to the Calendar",
    excerpt: "How following seasonal devotionals can add rhythm and meaning to your spiritual practice.",
    date: "April 15, 2023",
    author: "Jennifer Williams",
    category: "Devotional",
    imageUrl: "/images/blog/post-5.jpg",
    slug: "seasonal-devotionals",
  },
  {
    id: "8",
    title: "Biblical Leadership Principles for Today's World",
    excerpt: "Applying timeless biblical leadership teachings to modern personal and professional challenges.",
    date: "April 3, 2023",
    author: "James Anderson",
    category: "Leadership",
    imageUrl: "/images/blog/post-6.jpg",
    slug: "biblical-leadership-principles",
  },
];

// Placeholder image component until real images are added
const PlaceholderImage = ({ category }: { category: string }) => {
  const bgColor = {
    "Devotional": "bg-blue-100",
    "Book Reviews": "bg-green-100",
    "Faith": "bg-purple-100",
    "Parenting": "bg-yellow-100",
    "Bible Study": "bg-red-100",
    "Leadership": "bg-indigo-100",
  }[category] || "bg-gray-100";
  
  return (
    <div className={`relative w-full h-full ${bgColor} flex items-center justify-center overflow-hidden rounded-t-lg`}>
      <span className="text-lg font-medium text-gray-600">{category}</span>
    </div>
  );
};

export default function BlogPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Our Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore insightful articles, devotionals, and book reviews to enrich your spiritual journey.
        </p>
      </div>
      
      {/* Featured Posts */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative aspect-[16/9] w-full">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <PlaceholderImage category={post.category} />
                )}
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                  {post.category}
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl line-clamp-2 hover:text-[#08a4a7] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription>
                  by {post.author} · {post.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      <Separator className="my-8" />
      
      {/* All Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative aspect-[16/9] w-full">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <PlaceholderImage category={post.category} />
                )}
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                  {post.category}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl line-clamp-2 hover:text-[#08a4a7] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription>
                  by {post.author} · {post.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
} 