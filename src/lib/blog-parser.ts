import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configure marked for synchronous operation
marked.setOptions({
  async: false,
  breaks: true,
  gfm: true
});

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  content: string;
  link: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  link: string;
}

const BLOG_POSTS_DIR = path.join(process.cwd(), 'public/blog');

export function getAllBlogPosts(): BlogPostMeta[] {
  try {
    if (!fs.existsSync(BLOG_POSTS_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BLOG_POSTS_DIR);
    const posts = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace('.md', '');
        const filePath = path.join(BLOG_POSTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        
        return {
          slug,
          title: data.title || 'Untitled',
          date: data.date || 'No date',
          author: data.author || 'Unknown author',
          excerpt: data.excerpt || '',
          image: data.image || '',
          link: `/blog/${slug}`
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_POSTS_DIR, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Parse markdown to HTML
    const htmlContent = String(marked(content));
    
    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || 'No date',
      author: data.author || 'Unknown author',
      excerpt: data.excerpt || '',
      image: data.image || '',
      content: htmlContent,
      link: `/blog/${slug}`
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}