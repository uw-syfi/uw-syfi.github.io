import { useLocation } from "wouter";
import { useContent } from "@/hooks/use-content";
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Talk {
  id: string;
  title: string;
  event?: string;
  location?: string;
  date?: string;
  abstract?: string;
  speakerBio?: string;
  homepage?: string;
  type?: string;
  audience?: string;
  slides?: string;
  video?: string;
}

interface TalksProps {
  limit?: number;
}

export default function Talks({ limit }: TalksProps = {}) {
  const [location, navigate] = useLocation();
  const { data: talks, isLoading } = useContent<Talk[]>('talks');
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(new Set());
  const [expandedBios, setExpandedBios] = useState<Set<string>>(new Set());

  const toggleAbstract = (talkId: string) => {
    setExpandedAbstracts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(talkId)) {
        newSet.delete(talkId);
      } else {
        newSet.add(talkId);
      }
      return newSet;
    });
  };

  const toggleBio = (talkId: string) => {
    setExpandedBios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(talkId)) {
        newSet.delete(talkId);
      } else {
        newSet.add(talkId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 15; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return { truncated: text, needsTruncation: false };
    }
    
    return {
      truncated: words.slice(0, maxWords).join(' ') + '...',
      needsTruncation: true
    };
  };

  if (isLoading) {
    return (
      <section id="talks" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Talks & Presentations</h2>
          <div className="text-center text-uw-gray">Loading talks...</div>
        </div>
      </section>
    );
  }

  const presentations = limit ? (talks || []).slice(0, limit) : (talks || []);

  const getTypeColor = (type?: string) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    switch (type.toLowerCase()) {
      case 'keynote':
        return 'bg-red-100 text-red-800';
      case 'seminar':
        return 'bg-green-100 text-green-800';
      case 'panel':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceColor = (audience?: string) => {
    if (!audience) return 'bg-gray-100 text-gray-800';
    switch (audience.toLowerCase()) {
      case 'international':
        return 'bg-blue-100 text-blue-800';
      case 'local':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="talks" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Talks & Presentations</h2>
        
        <div className="space-y-6">
          {presentations.map((talk) => {
            const isAbstractExpanded = expandedAbstracts.has(talk.id);
            const isBioExpanded = expandedBios.has(talk.id);
            const abstractTruncated = talk.abstract ? truncateText(talk.abstract) : null;
            
            return (
              <div key={talk.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-uw-slate mb-2">{talk.title}</h3>
                    {talk.event && (
                      <p className="text-uw-gray mb-1 flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {talk.event}
                      </p>
                    )}
                    {talk.location && (
                      <p className="text-uw-gray mb-1 flex items-center">
                        <MapPin size={16} className="mr-2" />
                        {talk.location}
                      </p>
                    )}
                    {talk.date && (
                      <p className="text-uw-gray mb-3 flex items-center">
                        <Clock size={16} className="mr-2" />
                        {talk.date}
                      </p>
                    )}
                    
                    {/* Abstract Section */}
                    {talk.abstract && abstractTruncated && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-uw-slate mb-1">Abstract</h4>
                        <p className="text-sm text-uw-gray">
                          {isAbstractExpanded ? talk.abstract : abstractTruncated.truncated}
                        </p>
                        {abstractTruncated.needsTruncation && (
                          <button
                            onClick={() => toggleAbstract(talk.id)}
                            className="text-uw-blue hover:text-uw-sky text-sm font-medium mt-1 flex items-center"
                          >
                            {isAbstractExpanded ? (
                              <>
                                Show less <ChevronUp size={14} className="ml-1" />
                              </>
                            ) : (
                              <>
                                Read more <ChevronDown size={14} className="ml-1" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Speaker Bio Section */}
                    {talk.speakerBio && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-uw-slate mb-1">Speaker Bio</h4>
                          <button
                            onClick={() => toggleBio(talk.id)}
                            className="text-uw-blue hover:text-uw-sky text-sm font-medium flex items-center"
                          >
                            {isBioExpanded ? (
                              <>
                                Hide <ChevronUp size={14} className="ml-1" />
                              </>
                            ) : (
                              <>
                                Show <ChevronDown size={14} className="ml-1" />
                              </>
                            )}
                          </button>
                        </div>
                        {isBioExpanded && (
                          <p className="text-sm text-uw-gray mt-1">{talk.speakerBio}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Right side buttons */}
                  <div className="ml-4 flex flex-col space-y-2 min-w-[100px]">
                    {talk.homepage && (
                      <a 
                        href={talk.homepage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3 py-2 bg-uw-blue text-white rounded-md text-sm font-medium hover:bg-uw-sky transition-colors whitespace-nowrap"
                      >
                        Homepage <ExternalLink size={14} className="ml-1" />
                      </a>
                    )}
                    {talk.slides && (
                      <a 
                        href={talk.slides} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-uw-blue hover:text-uw-sky text-sm font-medium"
                      >
                        Paper
                      </a>
                    )}
                    {talk.video && (
                      <a 
                        href={talk.video} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-uw-purple hover:text-uw-gold text-sm font-medium"
                      >
                        Recording
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Tags */}
                {(talk.type || talk.audience) && (
                  <div className="flex items-center">
                    {talk.type && (
                      <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${getTypeColor(talk.type)}`}>
                        {talk.type}
                      </span>
                    )}
                    {talk.audience && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getAudienceColor(talk.audience)}`}>
                        {talk.audience}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate("/talks")}
            className="inline-flex items-center px-6 py-3 border border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors"
          >
            View All Talks
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
