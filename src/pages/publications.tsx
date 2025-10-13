import { useState } from "react";
import { useContent } from "@/hooks/use-content";
import { FileText, Github, Quote, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;
  pdf?: string;
  code?: string;
  bibtex?: string;
}

export default function PublicationsPage() {
  const { data: publications, isLoading } = useContent<Publication[]>('publications');
  const [filter, setFilter] = useState('all');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-uw-gray">Loading publications...</div>
        </div>
      </div>
    );
  }

  const papers = publications || [];
  const years = ['all', ...Array.from(new Set(papers.map(p => p.year))).sort().reverse()];
  
  const filteredPapers = filter === 'all' 
    ? papers 
    : papers.filter(paper => paper.year === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/#publications" className="inline-flex items-center text-uw-purple hover:text-uw-gold mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-uw-slate mb-4">Publications</h1>
          <p className="text-uw-gray text-lg">
            Our research contributions to the field of AI infrastructure and systems design, 
            published in top-tier conferences and journals.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex space-x-4">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setFilter(year)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === year
                    ? 'bg-uw-purple text-white'
                    : 'bg-white text-uw-gray hover:bg-slate-100'
                }`}
              >
                {year === 'all' ? 'All Years' : year}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredPapers.map((paper) => (
            <div key={paper.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link href={`/publications/${paper.id}`}>
                    <h2 className="text-xl font-semibold text-uw-slate mb-3 hover:text-uw-purple cursor-pointer transition-colors">
                      {paper.title}
                    </h2>
                  </Link>
                  <p className="text-uw-gray mb-2" dangerouslySetInnerHTML={{ __html: paper.authors }} />
                  <p className="text-uw-gray mb-4">
                    <em dangerouslySetInnerHTML={{ __html: paper.venue }} />
                  </p>
                  {paper.abstract && (
                    <p className="text-uw-gray mb-6 leading-relaxed">{paper.abstract}</p>
                  )}
                  <div className="flex space-x-4">
                    {paper.pdf && (
                      <a
                        href={paper.pdf}
                        className="text-uw-purple hover:text-uw-gold text-sm font-medium flex items-center px-3 py-1 border border-uw-purple rounded hover:bg-uw-purple hover:text-white transition-colors"
                      >
                        <FileText size={16} className="mr-1" />
                        PDF
                      </a>
                    )}
                    {paper.code && (
                      <a
                        href={paper.code}
                        className="text-uw-purple hover:text-uw-gold text-sm font-medium flex items-center px-3 py-1 border border-uw-purple rounded hover:bg-uw-purple hover:text-white transition-colors"
                      >
                        <Github size={16} className="mr-1" />
                        Code
                      </a>
                    )}
                    {paper.bibtex && (
                      <a
                        href={paper.bibtex}
                        className="text-uw-purple hover:text-uw-gold text-sm font-medium flex items-center px-3 py-1 border border-uw-purple rounded hover:bg-uw-purple hover:text-white transition-colors"
                      >
                        <Quote size={16} className="mr-1" />
                        BibTeX
                      </a>
                    )}
                  </div>
                </div>
                <div className="ml-6">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    paper.year === '2024' ? 'bg-uw-purple text-white' : 'bg-uw-gray text-white'
                  }`}>
                    {paper.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-uw-gray text-lg">No publications found for the selected year.</p>
            <p className="text-uw-gray">Try selecting a different year or "All Years".</p>
          </div>
        )}

        {papers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-uw-gray text-lg">No publications available at the moment.</p>
            <p className="text-uw-gray">Check back soon for our latest research!</p>
          </div>
        )}
      </div>
    </div>
  );
}