import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useContent } from "@/hooks/use-content";
import { FileText, Github, Quote, ArrowRight } from "lucide-react";

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  topics?: string[];
  abstract: string;
  pdf?: string;
  code?: string;
  bibtex?: string;
}

export default function Publications({ limit }: { limit?: number }) {
  const [location, navigate] = useLocation();
  const { data: publications, isLoading } = useContent<Publication[]>('publications');

  if (isLoading) {
    return (
      <section id="publications" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Publications</h2>
          <div className="text-center text-uw-gray">Loading publications...</div>
        </div>
      </section>
    );
  }

  const papers = publications || [];
  const displayedPapers = typeof limit === 'number' && limit > 0
    ? papers.slice(0, limit)
    : papers;

  return (
    <section id="publications" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Recent Publications</h2>

        <div className="space-y-6">
          {displayedPapers.map((paper) => (
            <div key={paper.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link href={`/publications/${paper.id}`}>
                    <h3 className="text-lg font-semibold text-uw-slate mb-2 hover:text-uw-purple cursor-pointer transition-colors">
                      {paper.title}
                    </h3>
                  </Link>
                  <p className="text-uw-gray mb-2" dangerouslySetInnerHTML={{ __html: paper.authors }} />
                  <p className="text-uw-gray mb-3">
                    <em dangerouslySetInnerHTML={{ __html: paper.venue }} />
                  </p>
                  {paper.abstract && (
                    <p className="text-sm text-uw-gray mb-4">{paper.abstract}</p>
                  )}
                  {paper.topics && paper.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {paper.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-blue-50 text-uw-blue text-xs font-medium rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-4">
                    {paper.pdf && (
                      <a href={paper.pdf} className="text-uw-blue hover:text-uw-sky text-sm font-medium flex items-center">
                        <FileText size={16} className="mr-1" />
                        PDF
                      </a>
                    )}
                    {paper.code && (
                      <a href={paper.code} className="text-uw-blue hover:text-uw-sky text-sm font-medium flex items-center">
                        <Github size={16} className="mr-1" />
                        Code
                      </a>
                    )}
                    {paper.bibtex && (
                      <a href={paper.bibtex} className="text-uw-blue hover:text-uw-sky text-sm font-medium flex items-center">
                        <Quote size={16} className="mr-1" />
                        BibTeX
                      </a>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    paper.year === '2024' ? 'bg-uw-purple text-white' : 'bg-uw-gray text-white'
                  }`}>
                    {paper.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate("/publications")}
            className="inline-flex items-center px-6 py-3 border border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors"
          >
            View All Publications
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
