import { useContent } from "@/hooks/use-content";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface Talk {
  id: string;
  title: string;
  event?: string;
  location?: string;
  date?: string;
  abstract?: string;
  type?: string;
  audience?: string;
  slides?: string;
  video?: string;
}

export default function TalksPage() {
  const { data: talks, isLoading } = useContent<Talk[]>('talks');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-uw-gray">Loading talks...</div>
        </div>
      </div>
    );
  }

  const presentations = talks || [];

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/#talks" className="inline-flex items-center text-uw-purple hover:text-uw-gold mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-uw-slate mb-4">Talks & Presentations</h1>
          <p className="text-uw-gray text-lg">
            Our team regularly presents research findings at conferences, workshops, and seminars 
            around the world, sharing insights on AI infrastructure and systems design.
          </p>
        </div>

        <div className="space-y-6">
          {presentations.map((talk) => (
            <div key={talk.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-uw-slate mb-3">{talk.title}</h2>
                  <div className="space-y-2 mb-3">
                    {talk.event && (
                      <p className="text-uw-gray flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {talk.event}
                      </p>
                    )}
                    {talk.location && (
                      <p className="text-uw-gray flex items-center">
                        <MapPin size={16} className="mr-2" />
                        {talk.location}
                      </p>
                    )}
                    {talk.date && (
                      <p className="text-uw-gray flex items-center">
                        <Clock size={16} className="mr-2" />
                        {talk.date}
                      </p>
                    )}
                  </div>
                  {talk.abstract && (
                    <p className="text-uw-gray leading-relaxed mb-4">{talk.abstract}</p>
                  )}
                  {(talk.type || talk.audience) && (
                    <div className="flex items-center mb-4">
                      {talk.type && (
                        <span className={`px-3 py-1 rounded text-sm font-medium mr-3 ${getTypeColor(talk.type)}`}>
                          {talk.type}
                        </span>
                      )}
                      {talk.audience && (
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getAudienceColor(talk.audience)}`}>
                          {talk.audience}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="ml-6 flex space-x-4">
                  {talk.slides && (
                    <a 
                      href={talk.slides} 
                      className="text-uw-purple hover:text-uw-gold text-sm font-medium px-3 py-1 border border-uw-purple rounded hover:bg-uw-purple hover:text-white transition-colors"
                    >
                      Paper
                    </a>
                  )}
                  {talk.video && (
                    <a 
                      href={talk.video} 
                      className="text-uw-purple hover:text-uw-gold text-sm font-medium px-3 py-1 border border-uw-purple rounded hover:bg-uw-purple hover:text-white transition-colors"
                    >
                      Recording
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {presentations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-uw-gray text-lg">No talks available at the moment.</p>
            <p className="text-uw-gray">Check back soon for upcoming presentations!</p>
          </div>
        )}
      </div>
    </div>
  );
}