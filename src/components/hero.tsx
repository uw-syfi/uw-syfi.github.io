import RollingGallery from './rolling-gallery';
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Hero() {
  const [location, navigate] = useLocation();
  
  return (
    <section id="home" className="relative text-white h-[48vh] flex items-center bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900">
      {/* Rolling Gallery Background */}
      <RollingGallery className="absolute inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center py-8">
        <div className="w-full md:flex md:items-center md:gap-8">
          {/* Left side - removed title */}
          <div className="hidden md:block md:w-[70%]" />
          
          {/* Right side - Mission text directly on overlay */
          }
          <div className="p-2 h-full flex flex-col justify-between text-white md:w-[30%]">
            <div>
              <h2 className="font-bold text-white mb-4 text-[26px]">SyFI Lab</h2>
              <div className="prose prose-sm text-white leading-relaxed mb-4">
                <p className="text-[16px]">
                  Welcome to the SyFI Lab (Systems for Future Intelligence), a research group within the Paul G. Allen School of Computer Science & Engineering at the University of Washington. Our research focuses on disaggregated, task-aware AI systems, with the goal of achieving scalable and resilient AI-native infrastructure.
                </p>
              </div>

              {/* Affiliation removed per request */}
            </div>

            <button 
              onClick={() => navigate("/about")}
              className="inline-flex items-center px-5 py-2.5 text-white hover:bg-white/10 rounded-md font-medium transition-colors text-[16px]"
            >
              View More
              <ArrowRight size={17} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
