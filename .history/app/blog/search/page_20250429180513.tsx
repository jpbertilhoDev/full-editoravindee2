import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Search Blog | Christian Bookstore",
  description: "Search our collection of insightful articles, devotionals, and book reviews.",
};

// This would typically come from a CMS or database
const allPosts = [
  {
    id: "1",
    title: "Finding Peace in Scripture: A Daily Practice",
    excerpt: "Discover how establishing a daily scripture reading routine can transform your spiritual life and bring lasting peace.",
    date: "June 15, 2023",
    author: "Sarah Johnson",
    category: "Devotional",
    imageUrl: "/images/blog/featured-1.jpg",
    slug: "finding-peace-in-scripture",
    content: "In today's fast-paced world, finding moments of peace and spiritual connection can seem like an impossible task. Yet, the ancient practice of daily scripture reading offers a timeless solution to this modern problem. When we make time each day to engage with scripture, we create space for divine wisdom to enter our lives.",
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
    content: "With so many new releases each year, finding the right books to nurture your spiritual journey can be overwhelming. We've compiled this carefully curated list of the most impactful Christian books released in 2023 to help you discover your next meaningful read.",
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
    content: "Community prayer has been a cornerstone of faith practices across cultures and centuries. When believers gather to pray together, something powerful happens that goes beyond individual spiritual practice.",
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
    content: "Introducing children to biblical stories and concepts is a meaningful way to build their spiritual foundation. However, knowing how to present these sometimes complex topics in age-appropriate ways can be challenging for parents and educators.",
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
    content: "The Book of Psalms contains some of the most beautiful and emotionally resonant poetry in scripture. These ancient songs of praise, lament, thanksgiving, and petition continue to speak to modern readers with remarkable relevance.",
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
    content: "Christian fiction has grown from a niche market to a thriving literary category with broad appeal. These books offer more than just clean entertainment—they can inspire readers, provoke thoughtful reflection, and illustrate faith principles in accessible ways.",
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
    content: "Throughout history, faith traditions have connected spiritual practices to the rhythm of seasons. This intentional alignment of devotional life with natural cycles can bring fresh energy and deeper meaning to our spiritual journey.",
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
    content: "Leadership principles found in scripture offer timeless wisdom that remains remarkably relevant to today's complex personal and professional landscapes. From Moses to Jesus, the Bible offers diverse models of effective, ethical leadership.",
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

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || '';
  
  // Filter posts based on search query
  const searchResults = query
    ? allPosts.filter(post => {
        const searchFields = [
          post.title,
          post.excerpt,
          post.author,
          post.category,
          post.content,
        ].map(field => field.toLowerCase());
        
        return searchFields.some(field => field.includes(query.toLowerCase()));
      })
    : [];
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      {/* Back to blog link */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="p-0 h-auto">
          <Link href="/blog" className="flex items-center text-[#08a4a7] hover:text-[#078385] font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
      
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Search Blog
        </h1>
        
        {/* Search form */}
        <div className="max-w-2xl">
          <form action="/blog/search" className="flex gap-2">
            <div className="flex-grow relative">
              <Input
                type="search"
                name="q"
                placeholder="Search for articles..."
                defaultValue={query}
                className="pr-10 py-6 text-lg border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
            <Button type="submit" className="bg-[#08a4a7] hover:bg-[#078385] py-6 px-8">
              Search
            </Button>
          </form>
        </div>
      </div>
      
      {/* Search results */}
      {query ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              {searchResults.length === 0
                ? "No results found"
                : `Found ${searchResults.length} result${searchResults.length === 1 ? "" : "s"} for "${query}"`}
            </h2>
          </div>
          
          {searchResults.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((post) => (
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
          )}
          
          {searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-8">Try adjusting your search terms or browse our categories below.</p>
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-8">
                {['Devotional', 'Book Reviews', 'Faith', 'Parenting', 'Bible Study', 'Leadership'].map(category => (
                  <Link 
                    key={category} 
                    href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}
                  >
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                      {category}
                    </div>
                  </Link>
                ))}
              </div>
              <Button asChild>
                <Link href="/blog">Browse all articles</Link>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-8">Enter a search term above to find relevant articles.</p>
          <p className="text-gray-600 mb-8">Or browse our popular categories:</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-8">
            {['Devotional', 'Book Reviews', 'Faith', 'Parenting', 'Bible Study', 'Leadership'].map(category => (
              <Link 
                key={category} 
                href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}
              >
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  {category}
                </div>
              </Link>
            ))}
          </div>
          <Button asChild>
            <Link href="/blog">Browse all articles</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 