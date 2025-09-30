import { useRoute } from "wouter";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useBasePath } from "@/hooks/use-base-path";
import matter from 'gray-matter';
import { marked } from 'marked';
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  authorLinks?: Array<{ name: string; url: string }>;
  excerpt: string;
  image: string;
  content: string;
  link: string;
}

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const { getAssetPath } = useBasePath();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog', params?.slug],
    queryFn: async () => {
      if (!params?.slug) return null;
      
      // Configure marked for frontend use
      marked.setOptions({
        breaks: true,
        gfm: true
      });
      
      // Try to fetch JSON first (for production/built site)
      try {
        const jsonPath = getAssetPath(`blog/${params.slug}.json`);
        const jsonResponse = await fetch(jsonPath);
        if (jsonResponse.ok) {
          const data = await jsonResponse.json();
          return data;
        }
      } catch (error) {
        console.log('JSON not found, trying markdown...');
      }
      
      // Fallback to fetching and processing markdown (for development)
      try {
        const mdPath = getAssetPath(`blog/${params.slug}.md`);
        const mdResponse = await fetch(mdPath);
        if (!mdResponse.ok) {
          throw new Error('Blog post not found');
        }
        
        const markdownText = await mdResponse.text();
        const { data, content } = matter(markdownText);
        
        // Parse markdown to HTML
        const htmlContent = marked(content) as string;
        
        return {
          slug: params.slug,
          title: data.title || 'Untitled',
          date: data.date || 'No date',
          author: data.author || 'Unknown author',
          authorLinks: data.authorLinks,
          excerpt: data.excerpt || '',
          image: data.image || '',
          content: htmlContent,
          link: `/blog/${params.slug}`
        };
      } catch (error) {
        throw new Error('Blog post not found');
      }
    },
    enabled: !!params?.slug
  });

  if (!match || !params?.slug) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-uw-slate mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <a className="text-uw-blue hover:text-uw-sky">← Back to Blog</a>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uw-blue mx-auto mb-4"></div>
          <p className="text-uw-gray">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-uw-slate mb-4">Blog Post Not Found</h1>
            <p className="text-uw-gray mb-6">
              Sorry, we couldn't find the blog post you're looking for. It may have been moved or removed.
            </p>
            <Link href="/#blogs" className="inline-flex items-center px-6 py-3 bg-uw-purple text-white rounded-md hover:bg-opacity-90 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <Link href="/#blogs" className="inline-flex items-center text-uw-purple hover:text-uw-gold mb-8">
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Link>

            <h1 className="text-5xl font-bold text-uw-slate mb-6">{post.title}</h1>

            <div className="flex items-center space-x-6 text-uw-gray text-lg mb-8">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2" />
                {post.date}
              </div>
              <div className="flex items-center">
                <User size={20} className="mr-2" />
                {post.authorLinks && post.authorLinks.length > 0 ? (
                  <span>
                    {post.authorLinks.map((author: { name: string; url: string }, index: number) => (
                      <span key={index}>
                        <a
                          href={author.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-uw-purple hover:text-uw-gold underline"
                        >
                          {author.name}
                        </a>
                        {index < post.authorLinks!.length - 1 && ', '}
                      </span>
                    ))}
                  </span>
                ) : (
                  post.author
                )}
              </div>
            </div>
          </div>

          <article>
            <div
              className="blog-content prose prose-lg max-w-none text-black leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link href="/#blogs" className="inline-flex items-center px-6 py-3 border border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to All Posts
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}