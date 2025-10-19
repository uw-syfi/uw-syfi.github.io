import { useState, useEffect } from 'react';
import { useBasePath } from '@/hooks/use-base-path';
import { useContent } from '@/hooks/use-content';

interface RollingGalleryProps {
  className?: string;
}

export default function RollingGallery({ className = '' }: RollingGalleryProps) {
  const { getAssetPath } = useBasePath();
  const { data: galleryImages, isLoading } = useContent<string[]>('gallery');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    // Initialize loaded state when gallery images are loaded
    if (galleryImages && galleryImages.length > 0) {
      setImagesLoaded(new Array(galleryImages.length).fill(false));
    }
  }, [galleryImages]);

  useEffect(() => {
    if (!galleryImages || galleryImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [galleryImages]);

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

  if (isLoading) {
    return (
      <div className={`w-full h-full ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-purple-800/30 to-purple-900/60" />
      </div>
    );
  }

  const images = galleryImages || [];

  return (
    <div className={`w-full h-full ${className}`}>
      {images.length > 0 && images.map((image, index) => (
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
      
      {/* Overlay for better text readability - split left/right intensities */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left 70%: slightly lighter purple overlay */}
        <div className="absolute inset-y-0 left-0 w-[68%] bg-gradient-to-b from-purple-900/45 via-purple-800/30 to-purple-900/55" />
        {/* Right 30%: darker purple overlay with slight blur for text contrast */}
        <div className="absolute inset-y-0 right-0 w-[32%] backdrop-blur-[2px] bg-gradient-to-b from-purple-900/75 via-purple-800/55 to-purple-900/85" />
      </div>
    </div>
  );
}