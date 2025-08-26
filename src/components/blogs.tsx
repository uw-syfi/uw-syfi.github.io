
import { useLocation } from "wouter";
import { useContent } from "@/hooks/use-content";
import { ArrowRight } from "lucide-react";

interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
}

export default function Blogs() {
  const [location, navigate] = useLocation();
  const { data: blogPosts, isLoading } = useContent<BlogPostMeta[]>('blogs');

  if (isLoading) {
    return (
      <section id="blogs" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Lab Blog</h2>
          <div className="text-center text-uw-gray">Loading blog posts...</div>
        </div>
      </section>
    );
  }

  const posts = blogPosts || [];

  return (
    <section id="blogs" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Lab Blog</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-slate-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-uw-gray mb-2">{post.date}</div>
                <h3 className="text-xl font-semibold text-uw-slate mb-3">{post.title}</h3>
                <p className="text-uw-gray mb-4">{post.excerpt}</p>
                <a 
                  href={post.link} 
                  className="text-uw-blue hover:text-uw-sky font-medium flex items-center"
                >
                  Read More <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate("/blog")}
            className="inline-flex items-center px-6 py-3 border border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors"
          >
            View All Posts
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
