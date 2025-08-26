import { Building, Code, MapPin, Mail, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#people', label: 'People' },
    { href: '#research', label: 'Research' },
    { href: '#publications', label: 'Publications' },
    { href: '#blogs', label: 'Blogs' },
    { href: '#talks', label: 'Talks' }
  ];

  return (
    <footer className="bg-uw-slate text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SyFI Lab</h3>
            <p className="text-gray-300 mb-4">Systems for Future Intelligence</p>
            <p className="text-gray-300 text-sm">
              Reimagining AI infrastructure through full-stack co-design and disaggregated systems.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="text-gray-300 space-y-2">
              <p className="flex items-center">
                <Building size={16} className="mr-2" />
                Paul G. Allen School, University of Washington
              </p>
              <p className="flex items-center">
                <Code size={16} className="mr-2" />
                University of Washington
              </p>
              <p className="flex items-center">
                <Mail size={16} className="mr-2" />
                syfi@cs.washington.edu
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); alert('Stay tuned!'); }}>
                <Twitter size={20} />
              </a>
              <a href="https://github.com/uw-syfi" className="text-gray-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SYFI Lab, University of Washington. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
