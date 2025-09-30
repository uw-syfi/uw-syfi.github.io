import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { useBasePath } from "@/hooks/use-base-path";

export default function Navigation() {
  const { basePath, getAssetPath } = useBasePath();
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const updateActiveNav = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 200) {
          current = section.getAttribute('id') || 'home';
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);
    
    return () => {
      window.removeEventListener('scroll', updateActiveNav);
      window.removeEventListener('load', updateActiveNav);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', route: '/' },
    { id: 'research', label: 'Research', hash: '#research' },
    { id: 'people', label: 'People', hash: '#people' },
    { id: 'publications', label: 'Publications', hash: '/publications' },
    { id: 'blogs', label: 'Blogs', route: '/blog' },
    { id: 'talks', label: 'Talks', hash: '/talks' }
  ];

  const handleNavClick = (item: any) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.hash) {
      // If we're not on the home page, navigate there first
      if (location !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(item.hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        // We're already on home page, just scroll
        const element = document.getElementById(item.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="#home" className="block">
                <img 
                  src={getAssetPath("/img/syfi_logo.png")} 
                  alt="SyFI Lab" 
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors hover:bg-purple-50 ${
                    activeSection === item.id
                      ? 'text-uw-purple font-semibold'
                      : 'text-uw-gray hover:text-uw-purple'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-uw-gray hover:text-uw-purple p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base transition-colors hover:bg-purple-50 ${
                    activeSection === item.id
                      ? 'text-uw-purple font-semibold'
                      : 'text-uw-gray hover:text-uw-purple'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
