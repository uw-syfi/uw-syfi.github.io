import { useContent } from "@/hooks/use-content";

interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary?: string;
  link?: string;
}

export default function News({ limit = 5 }: { limit?: number }) {
  const { data: news, isLoading } = useContent<NewsItem[]>("news");

  if (isLoading) {
    return (
      <section id="news" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">News</h2>
          <div className="text-center text-uw-gray">Loading news...</div>
        </div>
      </section>
    );
  }

  const items = (news || []).slice(0, limit);

  return (
    <section id="news" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-uw-slate mb-6 text-center">News</h2>
        <ul className="space-y-1">
          {items.map((n) => (
            <li key={n.id} className="py-1.5 flex items-baseline gap-4">
              <span className="text-sm text-uw-gray w-28 shrink-0">{n.date}</span>
              {n.link ? (
                <a href={n.link} target="_blank" rel="noopener noreferrer" className="text-uw-slate hover:text-uw-purple truncate text-base">
                  {n.title}
                </a>
              ) : (
                <span className="text-uw-slate truncate text-base">{n.title}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


