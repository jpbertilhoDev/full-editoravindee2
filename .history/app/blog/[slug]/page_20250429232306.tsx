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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      images: post.image ? [post.image] : [],
    },
  };
}

async function getBlogPost(slug: string) {
  try {
    const docRef = doc(db, "blogPosts", slug);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as any;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
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

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const date = post.date?.toDate ? post.date.toDate() : new Date(post.date);
  const formattedDate = formatDistanceToNow(date, { addSuffix: true });
  
  return (
    <Container className="py-8 max-w-4xl mx-auto">
      <article className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{post.title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author?.avatar || ''} alt={post.author?.name || 'Author'} />
                <AvatarFallback>{post.author?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{post.author?.name || 'Unknown Author'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            
            {post.readTime && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{post.readTime} min read</span>
              </div>
            )}
          </div>
          
          {post.category && (
            <Badge variant="outline" className="capitalize">
              {post.category}
            </Badge>
          )}
        </div>
        
        {post.image && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}
        
        {post.excerpt && (
          <div className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
            {post.excerpt}
          </div>
        )}
        
        <Separator />
        
        <div className="prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.avatar || ''} alt={post.author?.name || 'Author'} />
              <AvatarFallback>{post.author?.name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Written by</p>
              <p className="text-sm text-muted-foreground">{post.author?.name || 'Unknown Author'}</p>
            </div>
          </div>
        </div>
      </article>
    </Container>
  );
} 