import { useRoute, Link } from "wouter";
import { ArrowLeft, FileText, Github, Quote } from "lucide-react";
import { useContent } from "@/hooks/use-content";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBasePath } from "@/hooks/use-base-path";
import { marked } from 'marked';
import { loadAndHydrateTwitterWidgets } from "@/lib/loadTwitterWidgets";

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract?: string;
  pdf?: string;
  code?: string;
  bibtex?: string;
}

interface PublicationContent {
  content: string;
  tldr?: string;
  keywords?: string[];
}

export default function PublicationDetailPage() {
  const [match, params] = useRoute("/publications/:id");
  const { data: publications, isLoading: publicationsLoading } = useContent<Publication[]>('publications');
  const { getAssetPath } = useBasePath();

  // Scroll to top when the page loads or when the publication ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.id]);

  // Load publication content (markdown or JSON)
  const { data: publicationContent, isLoading: contentLoading } = useQuery({
    queryKey: ['publication-content', params?.id],
    queryFn: async () => {
      if (!params?.id) return null;

      // Configure marked for frontend use
      marked.setOptions({
        breaks: true,
        gfm: true
      });

      // Try to fetch JSON first (for production/built site)
      try {
        const jsonPath = getAssetPath(`publications/${params.id}.json`);
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
        const mdPath = getAssetPath(`publications/${params.id}.md`);
        console.log('Fetching markdown from:', mdPath);
        const mdResponse = await fetch(mdPath);
        console.log('Markdown fetch response:', mdResponse.status, mdResponse.ok);
        if (!mdResponse.ok) {
          // No content file found, return null (will show empty page)
          console.log('Markdown file not found');
          return null;
        }

        const markdownText = await mdResponse.text();
        console.log('Markdown text length:', markdownText.length);

        // Parse frontmatter manually for browser compatibility
        let data: any = {};
        let content = markdownText;

        // Check if the markdown starts with frontmatter (---)
        if (markdownText.trim().startsWith('---')) {
          const frontmatterMatch = markdownText.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          if (frontmatterMatch) {
            const frontmatterText = frontmatterMatch[1];
            content = frontmatterMatch[2];

            // Parse YAML-like frontmatter (simple key-value parser)
            const lines = frontmatterText.split('\n');
            let currentKey = '';
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('-')) {
                // Array item
                if (currentKey && Array.isArray(data[currentKey])) {
                  data[currentKey].push(trimmedLine.substring(1).trim());
                }
              } else if (trimmedLine.includes(':')) {
                // Key-value pair
                const colonIndex = trimmedLine.indexOf(':');
                const key = trimmedLine.substring(0, colonIndex).trim();
                const value = trimmedLine.substring(colonIndex + 1).trim();
                currentKey = key;
                if (value) {
                  data[key] = value;
                } else {
                  // Next lines might be array items
                  data[key] = [];
                }
              }
            }
          }
        }

        console.log('Frontmatter data:', data);
        console.log('Content:', content.substring(0, 100));

        // Parse markdown to HTML
        const htmlContent = marked(content) as string;

        const result = {
          content: htmlContent,
          tldr: data.tldr,
          keywords: data.keywords
        };
        console.log('Returning publication content:', result);
        return result;
      } catch (error) {
        // No content file found, return null
        console.error('Error loading markdown:', error);
        return null;
      }
    },
    enabled: !!params?.id
  });

  const contentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (publicationContent) {
      loadAndHydrateTwitterWidgets(contentRef.current);
    }
  }, [publicationContent]);

  if (publicationsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uw-purple mx-auto mb-4"></div>
          <p className="text-uw-gray">Loading publication...</p>
        </div>
      </div>
    );
  }

  const publication = publications?.find(p => p.id === params?.id);

  if (!match || !params?.id || !publication) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-uw-slate mb-4">Publication Not Found</h1>
            <p className="text-uw-gray mb-6">
              Sorry, we couldn't find the publication you're looking for. It may have been moved or removed.
            </p>
            <Link href="/publications" className="inline-flex items-center px-6 py-3 bg-uw-purple text-white rounded-md hover:bg-opacity-90 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Publications
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <Link href="/publications" className="inline-flex items-center text-uw-purple hover:text-uw-gold mb-8">
              <ArrowLeft size={16} className="mr-2" />
              Back to Publications
            </Link>

            {/* Title */}
            <h1 className="text-4xl font-bold text-uw-slate mb-6 leading-tight">
              {publication.title}
            </h1>

            {/* Authors */}
            <div className="mb-4">
              <p
                className="text-lg text-uw-gray"
                dangerouslySetInnerHTML={{ __html: publication.authors }}
              />
            </div>

            {/* Venue and Year */}
            <div className="flex items-center space-x-4 mb-8">
              <p
                className="text-lg text-uw-gray"
                dangerouslySetInnerHTML={{ __html: publication.venue }}
              />
              <span className="px-3 py-1 rounded bg-uw-purple text-white text-sm font-medium">
                {publication.year}
              </span>
            </div>

            {/* Action Links */}
            <div className="flex flex-wrap gap-4">
              {publication.pdf && (
                <a
                  href={publication.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border-2 border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors"
                >
                  <FileText size={20} className="mr-2" />
                  View PDF
                </a>
              )}
              {publication.code && (
                <a
                  href={publication.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border-2 border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors"
                >
                  <Github size={20} className="mr-2" />
                  View Code
                </a>
              )}
              {publication.bibtex && (
                <a
                  href={publication.bibtex}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border-2 border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors"
                >
                  <Quote size={20} className="mr-2" />
                  BibTeX
                </a>
              )}
            </div>
          </div>

          {/* Publication Content */}
          {publicationContent && (
            <article>
              {/* Keywords Section */}
              {publicationContent.keywords && publicationContent.keywords.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-uw-slate mb-2">Keywords</h3>
                  <div className="border-b border-gray-200 mb-4"></div>
                  <div className="flex flex-wrap gap-3">
                    {publicationContent.keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-5 py-2.5 bg-slate-100 text-uw-slate rounded-full text-base font-medium hover:bg-slate-200 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TLDR Section */}
              {publicationContent.tldr && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-uw-slate mb-2">TL;DR</h3>
                  <div className="border-b border-gray-200 mb-4"></div>
                  <div className="p-7 bg-slate-100 rounded-2xl">
                    <p className="text-uw-slate leading-relaxed text-lg">{publicationContent.tldr}</p>
                  </div>
                </div>
              )}

              {/* Main Content */}
              {publicationContent.content && (
                <div
                  ref={contentRef}
                  className="blog-content prose prose-lg max-w-none text-black leading-relaxed [&_img]:border-0 [&_img]:shadow-none"
                  dangerouslySetInnerHTML={{ __html: publicationContent.content }}
                />
              )}
            </article>
          )}

          {/* Back button at bottom */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link href="/publications" className="inline-flex items-center px-6 py-3 border border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to All Publications
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
