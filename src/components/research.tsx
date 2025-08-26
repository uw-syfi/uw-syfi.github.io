import { useContent } from "@/hooks/use-content";
import { Box, Network, Cpu, Code, Leaf, Layers } from "lucide-react";

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const iconMap = {
  cube: Box,
  network: Network,
  cpu: Cpu,
  code: Code,
  leaf: Leaf,
  layers: Layers
};

export default function Research() {
  const { data: researchAreas, isLoading } = useContent<ResearchArea[]>('research');

  if (isLoading) {
    return (
      <section id="research" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Research Areas</h2>
          <div className="text-center text-uw-gray">Loading research areas...</div>
        </div>
      </section>
    );
  }

  const areas = researchAreas || [];

  return (
    <section id="research" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-uw-slate mb-8 text-center">Research Areas</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area) => {
            const IconComponent = iconMap[area.icon as keyof typeof iconMap] || Box;
            return (
              <div key={area.id} className="bg-white rounded-lg p-6 hover:bg-slate-100 transition-colors shadow-md hover:shadow-lg">
                <div className="text-uw-blue mb-4">
                  <IconComponent size={48} />
                </div>
                <h3 className="text-xl font-semibold text-uw-slate mb-3">{area.title}</h3>
                <p className="text-uw-gray">{area.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
