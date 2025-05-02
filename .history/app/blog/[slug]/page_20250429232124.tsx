import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag, MessageSquare, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Container from "@/components/ui/container";

// This would typically come from a CMS or database
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This would typically come from a CMS or database
const blogPosts = [
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
      
      <h2>Moving Beyond Reading to Relationship</h2>
      <p>The most transformative scripture practices move beyond mere reading into relationship—with the text, with community, and with the Divine. This means approaching scripture not just as information to be processed, but as a living text that can speak to our current circumstances.</p>
      
      <p>Lectio Divina, an ancient practice of sacred reading, offers a structured way to engage scripture in this manner:</p>
      
      <ol>
        <li><strong>Read</strong> (Lectio) - Read a short passage slowly</li>
        <li><strong>Reflect</strong> (Meditatio) - Meditate on the text, considering what word or phrase stands out</li>
        <li><strong>Respond</strong> (Oratio) - Pray in response to the reflection</li>
        <li><strong>Rest</strong> (Contemplatio) - Simply rest in God's presence</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>Establishing a daily scripture practice isn't about adding another task to your to-do list—it's about creating space in your life for peace, wisdom, and connection. In a world that constantly demands our attention, this intentional turning toward sacred text offers a countercultural path to genuine peace.</p>
      
      <p>As you begin or deepen your own practice, remember that consistency matters more than quantity. The goal isn't perfect adherence to a rigid system, but rather the cultivation of a living relationship with scripture that sustains you through all of life's seasons.</p>
    `,
    date: "June 15, 2023",
    author: "Sarah Johnson",
    category: "Devotional",
    imageUrl: "/images/blog/featured-1.jpg",
    slug: "finding-peace-in-scripture",
    comments: [
      {
        id: "comment1",
        author: "David Wilson",
        authorImage: "/images/avatars/david.jpg",
        date: "June 18, 2023",
        content: "This article came at the perfect time for me. I've been trying to establish a consistent scripture reading practice for years but always felt overwhelmed. Starting with just 5-10 minutes as you suggest seems much more manageable. Thank you for the practical wisdom!",
        replies: [
          {
            id: "reply1",
            author: "Sarah Johnson",
            authorImage: "/images/blog/featured-1.jpg",
            date: "June 19, 2023",
            content: "I'm so glad you found it helpful, David! Small, consistent steps really do add up to significant transformation over time."
          }
        ]
      },
      {
        id: "comment2",
        author: "Rachel Thompson",
        authorImage: "",
        date: "June 20, 2023",
        content: "The Lectio Divina practice you described has been transformative in my own spiritual journey. I would add that doing this practice in a group setting once a week, while maintaining individual practice other days, can add wonderful depth and perspective.",
        replies: []
      }
    ]
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
    
    <h3>2. "Prayer in the Modern Age" by Rebecca Chen</h3>
    <p>Chen combines neurological research with spiritual practice to demonstrate how prayer transforms not just our relationship with God, but the very structure of our brains and emotional lives.</p>
    
    <h3>3. "Rediscovering Grace" by Marcus Wilkins</h3>
    <p>Wilkins' approachable writing style makes complex theological concepts accessible without sacrificing depth, offering a fresh perspective on grace for both new believers and seasoned theologians.</p>
    
    <h3>4. "The Wisdom of Waiting" by Sophia Rodriguez</h3>
    <p>In a culture of instant gratification, Rodriguez makes a compelling case for the spiritual discipline of waiting, drawing from biblical examples and contemporary stories.</p>
    
    <h3>5. "Faith in the Wilderness" by James Montgomery</h3>
    <p>Montgomery's raw account of maintaining faith through personal tragedy offers hope without platitudes for anyone navigating difficult seasons.</p>
    
    <h3>6. "The Parables Retold" by Elizabeth Murray</h3>
    <p>This creative work reimagines Jesus' parables in contemporary settings, bringing fresh insight to these familiar teachings.</p>
    
    <h3>7. "Digital Disciples" by Noah Kim</h3>
    <p>Kim addresses the unique challenges and opportunities for Christian witness in online spaces with practical wisdom and theological grounding.</p>
    
    <h3>8. "Ancient Faith, Modern Questions" by Dr. Thomas Allen</h3>
    <p>This accessible introduction to apologetics addresses contemporary objections to faith with intellectual rigor and pastoral sensitivity.</p>
    
    <h3>9. "The Spiritual Practice of Creativity" by Jordan Wilson</h3>
    <p>Wilson explores the theological significance of human creativity and offers exercises to help readers connect their creative pursuits with spiritual growth.</p>
    
    <h3>10. "Rhythms of Rest" by Martha González</h3>
    <p>This practical guide to establishing Sabbath practices in busy modern life has already helped thousands find sustainable patterns of work and rest.</p>
    
    <h2>Finding Your Next Read</h2>
    <p>While all these books offer valuable insights, the "right" book depends on your current spiritual season and interests. Consider what areas of growth you're currently focusing on, and let that guide your selection.</p>
    
    <p>Remember that reading is just one avenue for spiritual growth. The true value of these books comes not just from consuming their content, but from prayerfully integrating their insights into your daily life and faith practice.</p>`,
    date: "May 28, 2023",
    author: "Michael Roberts",
    category: "Book Reviews",
    imageUrl: "/images/blog/featured-2.jpg",
    slug: "top-christian-books-2023",
    comments: [
      {
        id: "comment1",
        author: "Jennifer Adams",
        authorImage: "",
        date: "May 30, 2023",
        content: "I just finished 'Rhythms of Rest' and can't recommend it enough! It completely transformed my approach to the Sabbath. Has anyone read 'The Wisdom of Waiting'? That's next on my list.",
        replies: []
      }
    ]
  },
  // Additional blog posts would be listed here
];

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found."
    };
  }
  
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

function CommentAvatar({ author, authorImage }: { author: string, authorImage: string }) {
  return (
    <Avatar className="h-10 w-10">
      {authorImage ? (
        <AvatarImage src={authorImage} alt={author} />
      ) : (
        <AvatarFallback className="bg-[#08a4a7] text-white">
          {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }
  
  // Placeholder image component if the image URL is not available
  const PlaceholderImage = () => {
    const bgColor = {
      "Devotional": "bg-blue-100",
      "Book Reviews": "bg-green-100",
      "Faith": "bg-purple-100",
      "Parenting": "bg-yellow-100",
      "Bible Study": "bg-red-100",
      "Leadership": "bg-indigo-100",
    }[post.category] || "bg-gray-100";
    
    return (
      <div className={`w-full aspect-[21/9] ${bgColor} flex items-center justify-center rounded-lg`}>
        <span className="text-2xl font-medium text-gray-600">{post.category}</span>
      </div>
    );
  };
  
  return (
    <article className="container max-w-4xl mx-auto px-4 py-12">
      {/* Back button */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="p-0 h-auto">
          <Link href="/blog" className="flex items-center text-[#08a4a7] hover:text-[#078385] font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
      
      {/* Article header */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            <Link 
              href={`/blog/category/${post.category.toLowerCase().replace(/ /g, '-')}`}
              className="hover:text-[#08a4a7] transition-colors"
            >
              {post.category}
            </Link>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{post.comments?.length || 0} comments</span>
          </div>
        </div>
      </header>
      
      {/* Featured image */}
      <div className="mb-10">
        {post.imageUrl ? (
          <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <PlaceholderImage />
        )}
      </div>
      
      {/* Article content */}
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#08a4a7] prose-a:no-underline hover:prose-a:text-[#078385]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <Separator className="my-12" />
      
      {/* Author bio */}
      <div className="bg-gray-50 rounded-lg p-6 flex items-start gap-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {/* Replace with actual author image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">About {post.author}</h3>
          <p className="text-gray-600">
            {post.author} is a passionate writer with expertise in Christian literature and spiritual growth.
            {/* This would be a longer bio pulled from a database in a real application */}
          </p>
        </div>
      </div>
      
      {/* Comments section */}
      <section className="mt-12" id="comments">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Comments ({post.comments?.length || 0})
        </h2>
        
        {/* Comment form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input 
                  id="name" 
                  placeholder="Your name" 
                  required
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Your email (not published)" 
                  required
                  className="border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
              <Textarea 
                id="comment" 
                placeholder="Share your thoughts..." 
                rows={4}
                required
                className="resize-none border-[#08a4a7]/20 focus-visible:ring-[#0bdbb6]"
              />
            </div>
            <Button type="submit" className="bg-[#08a4a7] hover:bg-[#078385]">
              Post Comment
            </Button>
          </form>
        </div>
        
        {/* Existing comments */}
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-6">
            {post.comments.map(comment => (
              <div key={comment.id} className="border-b pb-6 last:border-0">
                <div className="flex gap-4">
                  <CommentAvatar author={comment.author} authorImage={comment.authorImage} />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                      <h4 className="font-bold">{comment.author}</h4>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{comment.content}</p>
                    <Button variant="ghost" size="sm" className="text-[#08a4a7] hover:text-[#078385] hover:bg-[#08a4a7]/5">
                      Reply
                    </Button>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-6 pl-6 border-l-2 border-gray-100 space-y-6">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-4">
                            <CommentAvatar author={reply.author} authorImage={reply.authorImage} />
                            <div>
                              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                                <h4 className="font-bold">{reply.author}</h4>
                                <span className="text-sm text-gray-500">{reply.date}</span>
                              </div>
                              <p className="text-gray-700">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-2">No comments yet</p>
            <p className="text-gray-700">Be the first to share your thoughts on this article!</p>
          </div>
        )}
      </section>
      
      {/* Related posts - would be dynamically generated in a real app */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You might also enjoy</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts
            .filter(relatedPost => relatedPost.id !== post.id)
            .slice(0, 3)
            .map(relatedPost => (
              <Link 
                key={relatedPost.id} 
                href={`/blog/${relatedPost.slug}`}
                className="block group"
              >
                <div className="relative aspect-[16/9] mb-3 rounded overflow-hidden">
                  {relatedPost.imageUrl ? (
                    <Image
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">{relatedPost.category}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#08a4a7] line-clamp-2 transition-colors">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{relatedPost.date}</p>
              </Link>
            ))}
        </div>
      </section>
    </article>
  );
} 