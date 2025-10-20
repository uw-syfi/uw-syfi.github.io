import { useEffect } from "react";
import { useContent } from "@/hooks/use-content";
import { ArrowRight, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { BlogPost } from "@/lib/blog-parser";

export default function BlogsPage() {
  const { data: blogPosts, isLoading } = useContent<BlogPost[]>('blogs');

  // Ensure page starts at top on route mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-uw-gray">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  const posts = blogPosts || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-uw-purple hover:text-uw-gold mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-uw-slate mb-4">Lab Blog</h1>
          <p className="text-uw-gray text-lg">
            Insights, updates, and perspectives from the SYFI Lab team on the latest developments 
            in AI infrastructure and systems research.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center text-sm text-uw-gray mb-3">
                  <Calendar size={16} className="mr-2" />
                  {post.date}
                </div>
                <h2 className="text-xl font-semibold text-uw-slate mb-3">{post.title}</h2>
                <p className="text-uw-gray mb-4 leading-relaxed">{post.excerpt}</p>
                <a
                  href={post.link}
                  className="text-uw-blue hover:text-uw-sky font-medium flex items-center"
                >
                  Read Full Article <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-uw-gray text-lg">No blog posts available at the moment.</p>
            <p className="text-uw-gray">Check back soon for updates from our team!</p>
          </div>
        )}
      </div>
    </div>
  );
}