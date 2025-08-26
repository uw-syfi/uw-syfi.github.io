import { Building, Code, MapPin, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Mission() {
  const [location, navigate] = useLocation();
  
  return (
    <section id="mission" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-uw-slate mb-6">Our Mission</h2>
            <div className="prose prose-lg text-uw-gray leading-relaxed">
              <p>
                Welcome to SyFI Lab! Our research focuses on disaggregated, task-aware AI systems, with the goal of achieving scalable and resilient AI-native infrastructure. Current foundation models are hitting limits in scalability, cost, and efficiency, prompting a need for new architectures that can better leverage heterogeneous hardware and handle communication bottlenecks, data scarcity, and synchronous execution inefficiencies. The SyFI Lab addresses this by rethinking AI infrastructure through full-stack co-design, targeting adaptability, modularity, and sustainability across algorithms, runtimes, and hardware.
              </p>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate("/about")}
                className="inline-flex items-center px-6 py-3 border border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white rounded-md font-medium transition-colors"
              >
                View More
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-uw-slate mb-4">Affiliation</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Building className="text-uw-blue mr-3" size={20} />
                <span className="text-uw-gray">University of Washington</span>
              </div>
              <div className="flex items-center">
                <Code className="text-uw-blue mr-3" size={20} />
                <span className="text-uw-gray">Paul G. Allen School of CSE</span>
              </div>
              <div className="flex items-center">
                <MapPin className="text-uw-blue mr-3" size={20} />
                <span className="text-uw-gray">Seattle, Washington</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
