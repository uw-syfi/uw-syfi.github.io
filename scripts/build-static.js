#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configure marked
marked.setOptions({
  async: false,
  breaks: true,
  gfm: true
});

const BLOG_POSTS_DIR = path.join(process.cwd(), 'public/blog');

function getAllBlogPosts() {
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

function getBlogPost(slug) {
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
      authorLinks: data.authorLinks,
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

console.log('🌟 SyFI Lab Static Site Generator');
console.log('==================================');

// Configuration
const OUTPUT_DIR = 'dist';
const DATA_DIR = 'public/data';

// Clean and create output directory
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Step 1: Build the React application
console.log('📦 Building React application...');
try {
  execSync('NODE_ENV=production npm run build-vite', { stdio: 'inherit' });
  console.log('✅ React build completed');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Process blog posts
console.log('📝 Processing blog posts...');
try {
  const blogPosts = getAllBlogPosts();
  console.log(`Found ${blogPosts.length} blog posts`);
  
  // Create blog output directory
  const blogOutputDir = path.join(OUTPUT_DIR, 'blog');
  fs.mkdirSync(blogOutputDir, { recursive: true });
  
 // Generate individual blog post JSON files and directories
  blogPosts.forEach(post => {
    const fullPost = getBlogPost(post.slug);
    if (fullPost) {
      // Create JSON file in blog directory
      const outputPath = path.join(blogOutputDir, `${post.slug}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(fullPost, null, 2));
      console.log(`✅ Generated ${post.slug}.json`);
      
      // Create individual blog post directory with index.html for static serving
      const postDir = path.join(blogOutputDir, post.slug);
      fs.mkdirSync(postDir, { recursive: true });
      
      // Copy the main index.html to the blog post directory
      const indexPath = path.join(OUTPUT_DIR, 'index.html');
      const postIndexPath = path.join(postDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, postIndexPath);
        console.log(`✅ Created ${post.slug}/index.html`);
      }
    }
  });
  
  console.log('✅ Blog posts processed successfully');
} catch (error) {
  console.error('❌ Blog processing failed:', error.message);
  // Don't exit, continue with other files
}

// Step 3: Copy data files
console.log('📊 Copying data files...');
const dataOutputDir = path.join(OUTPUT_DIR, 'data');
fs.mkdirSync(dataOutputDir, { recursive: true });

// Copy JSON data files
const jsonFiles = ['people.json', 'research.json', 'publications.json', 'talks.json', 'blogs.json'];
jsonFiles.forEach(file => {
  const srcPath = path.join(DATA_DIR, file);
  const destPath = path.join(dataOutputDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${file}`);
  } else {
    console.log(`⚠️  ${file} not found, skipping`);
  }
});

// Step 4: Create static HTML pages for all routes (SPA routing support)
console.log('📄 Creating static pages for all routes...');
const indexPath = path.join(OUTPUT_DIR, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

const routes = ['about', 'publications', 'talks', 'blog'];
routes.forEach(route => {
  // Create directory for the route
  const routeDir = path.join(OUTPUT_DIR, route);
  fs.mkdirSync(routeDir, { recursive: true });
  
  // Copy index.html to each route directory for SPA routing
  const routeIndexPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(routeIndexPath, indexContent);
  console.log(`✅ Created ${route}/index.html`);
});

console.log('✅ Static site built successfully!');
console.log(`📂 Output directory: ${OUTPUT_DIR}`);
console.log('\n🚀 Ready for deployment!');
console.log(`   • Test locally: cd ${OUTPUT_DIR} && python3 -m http.server 8000`);
console.log(`   • Deploy to GitHub Pages: Push to main branch`);
console.log(`   • Deploy to other hosts: Upload contents of ${OUTPUT_DIR}/ directory`);
