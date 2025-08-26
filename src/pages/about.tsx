import { Building, Code, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/#mission" className="inline-flex items-center text-uw-purple hover:text-uw-gold mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-uw-slate mb-4">About SyFI Lab</h1>
          <div className="text-uw-gray text-lg leading-relaxed max-w-4xl">
            <p className="mb-4">
              The SyFI Lab is dedicated to reimagining and future-proofing the foundations of AI infrastructure to meet the evolving demands of intelligent systems. Today's AI systems are rooted in monolithic, static architectures and they struggle to adapt to the increasing complexity, heterogeneity, and scale of modern workloads. At SyFI, we believe that the next frontier of AI innovation lies in full-stack co-design: rearchitecting every layer of the AI system—from algorithms and programming models to distributed runtimes and hardware—with adaptability, modularity, and sustainability at its core.
            </p>
            <p>
              Our research pioneers the development of disaggregated AI models and systems that break from traditional, one-size-fits-all approaches. These systems are designed to dynamically activate only the components needed for a task, intelligently adapt to heterogeneous hardware and workload conditions, and support fluid boundaries between training and inference. We tackle challenges across system scalability, sparsity, and deployment resilience, working toward AI-native infrastructures that are efficient, interactive, and resilient to future demands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}