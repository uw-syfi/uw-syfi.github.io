import RollingGallery from './rolling-gallery';

export default function Hero() {
  return (
    <section id="home" className="relative text-white py-16 h-[60vh] flex items-center bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900">
      {/* Rolling Gallery Background */}
      <RollingGallery className="absolute inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl text-white">SyFI Lab</h1>
          <p className="text-2xl md:text-3xl mb-8 opacity-95 drop-shadow-lg text-white">Systems for Future Intelligence</p>
        </div>
      </div>
    </section>
  );
}
