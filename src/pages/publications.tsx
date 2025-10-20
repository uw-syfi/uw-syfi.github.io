import { useState, useEffect } from "react";
import { useContent } from "@/hooks/use-content";
import { FileText, Github, Quote, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

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

export default function PublicationsPage() {
  const { data: publications, isLoading } = useContent<Publication[]>('publications');
  const [location] = useLocation();
  const [yearFilter, setYearFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  // Ensure page starts at top on route mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Handle URL parameters for topic filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const topicParam = urlParams.get('topic');
    if (topicParam) {
      setTopicFilter(topicParam);
    }
  }, [location]);

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
  const allTopics = Array.from(new Set(papers.flatMap(p => p.topics || [])));
  const topics = ['all', ...allTopics.sort()];
  
  let filteredPapers = papers;
  if (yearFilter !== 'all') {
    filteredPapers = filteredPapers.filter(paper => paper.year === yearFilter);
  }
  if (topicFilter !== 'all') {
    filteredPapers = filteredPapers.filter(paper => paper.topics?.includes(topicFilter));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-uw-purple hover:text-uw-gold mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-uw-slate mb-4">Publications</h1>
          <p className="text-uw-gray text-lg">
            Our research contributions to the field of AI infrastructure and systems design, 
            published in top-tier conferences and journals.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm font-semibold text-uw-slate self-center mr-2">Year:</span>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setYearFilter(year)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  yearFilter === year
                    ? 'bg-uw-purple text-white shadow-md'
                    : 'bg-white text-uw-gray hover:bg-purple-50'
                }`}
              >
                {year === 'all' ? 'All Years' : year}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm font-semibold text-uw-slate self-center mr-2">Topic:</span>
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setTopicFilter(topic)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  topicFilter === topic
                    ? 'bg-indigo-100 text-slate-700 shadow-md'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                {topic === 'all' ? 'All Topics' : topic}
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
                  {paper.topics && paper.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1 bg-blue-50 text-uw-blue text-sm font-medium rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
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