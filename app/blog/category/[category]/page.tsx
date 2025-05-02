import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

// All available categories (would typically be fetched from a database)
const categories = [
  "Devotional", 
  "Book Reviews", 
  "Faith", 
  "Parenting", 
  "Bible Study", 
  "Leadership"
];

// Format category string for display (spaces instead of hyphens, capitalized)
const formatCategory = (category: string): string => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Function to get category description
const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    "devotional": "Daily inspirations and reflections to deepen your spiritual journey.",
    "book-reviews": "Thoughtful analyses of Christian literature to guide your reading choices.",
    "faith": "Explorations of faith principles and their application in daily life.",
    "parenting": "Guidance for raising children with strong spiritual foundations.",
    "bible-study": "In-depth examinations of scripture to enhance your understanding.",
    "leadership": "Principles and practices for effective Christian leadership in various contexts."
  };
  
  return descriptions[category.toLowerCase()] || 
    `Articles related to ${formatCategory(category)} to enrich your spiritual journey.`;
};

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

interface PageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const decodedCategory = decodeURIComponent(params.category);
  const formattedCategory = formatCategory(decodedCategory);
  
  return {
    title: `${formattedCategory} Articles | Blog`,
    description: getCategoryDescription(decodedCategory),
  };
}

export default function CategoryPage({ params }: PageProps) {
  const decodedCategory = decodeURIComponent(params.category);
  const formattedCategory = formatCategory(decodedCategory);
  
  // Filter posts by category (case-insensitive matching)
  const categoryPosts = allPosts.filter(
    post => post.category.toLowerCase() === formattedCategory.toLowerCase()
  );
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      {/* Back to blog link */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="p-0 h-auto">
          <Link href="/blog" className="flex items-center text-[#08a4a7] hover:text-[#078385] font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Articles
          </Link>
        </Button>
      </div>
      
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          {formattedCategory}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          {getCategoryDescription(decodedCategory)}
        </p>
      </div>
      
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(category => (
          <Link 
            key={category} 
            href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}
          >
            <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category.toLowerCase() === formattedCategory.toLowerCase()
                ? 'bg-[#08a4a7] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
              {category}
            </div>
          </Link>
        ))}
      </div>
      
      {/* Posts grid */}
      {categoryPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryPosts.map((post) => (
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
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">No articles found</h2>
          <p className="text-gray-600 mb-8">There are currently no articles in this category.</p>
          <Button asChild>
            <Link href="/blog">Browse all articles</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 