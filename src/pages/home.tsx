import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Mission from "@/components/mission";
import People from "@/components/people";
import Research from "@/components/research";
import News from "@/components/news";
import Publications from "@/components/publications";
import Blogs from "@/components/blogs";
import Talks from "@/components/talks";
import Footer from "@/components/footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        e.preventDefault();
        const id = target.href.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main>
        <Hero />
        <Mission />
        <News limit={5} />
        <Research />
        <People />
        <Publications limit={3} />
        <Blogs />
        <Talks limit={1} />
      </main>
      <Footer />
    </div>
  );
}
