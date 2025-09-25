import { useState, useEffect } from 'react';
import { useBasePath } from '@/hooks/use-base-path';

interface RollingGalleryProps {
  className?: string;
}

export default function RollingGallery({ className = '' }: RollingGalleryProps) {
  const { getAssetPath } = useBasePath();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // Dynamically scan all images from the gallery directory
  useEffect(() => {
    const scanGalleryImages = async () => {
      // Fetch the gallery directory listing
      const response = await fetch('/img/gallery/');
      if (!response.ok) {
        throw new Error('Failed to fetch gallery directory');
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract image file names from the directory listing
      const links = doc.querySelectorAll('a[href]');
      const imageFiles: string[] = [];
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && /\.(jpg|jpeg|png|gif|webp)$/i.test(href)) {
          imageFiles.push(`/img/gallery/${href}`);
        }
      });
      
      setGalleryImages(imageFiles);
    };
    
    scanGalleryImages().catch(error => {
      console.error('Failed to scan gallery images:', error);
    });
  }, []);

  useEffect(() => {
    // Initialize loaded state when gallery images are loaded
    if (galleryImages.length > 0) {
      setImagesLoaded(new Array(galleryImages.length).fill(false));
    }
  }, [galleryImages]);

  useEffect(() => {
    if (galleryImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleImageError = (image: string, index: number) => {
    console.error(`Failed to load image: ${image}`);
  };

  // Show purple background if no images are loaded yet
  const showFallback = imagesLoaded.length === 0 || !imagesLoaded.some(loaded => loaded);

  return (
    <div className={`w-full h-full ${className}`}>
      {galleryImages.length > 0 && galleryImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex && imagesLoaded[index] ? 'opacity-80' : 'opacity-0'
          }`}
        >
          <img
            src={getAssetPath(image)}
            alt={`Lab photo ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index < 2 ? 'eager' : 'lazy'}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(image, index)}
          />
        </div>
      ))}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-purple-800/30 to-purple-900/60" />
    </div>
  );
}