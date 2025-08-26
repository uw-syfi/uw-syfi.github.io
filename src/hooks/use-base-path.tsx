import { createContext, useContext, ReactNode } from 'react';

// Get the base path for the current deployment
function getBasePath() {
  if (typeof window === 'undefined') return '';
  
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  
  // If we're in a subdirectory deployment (like /repo-name/), use that as base
  if (segments.length > 0 && !['about', 'blog', 'blogs', 'talks', 'publications'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  
  return '';
}

interface BasePathContextType {
  basePath: string;
  getAssetPath: (path: string) => string;
}

const BasePathContext = createContext<BasePathContextType>({
  basePath: '',
  getAssetPath: (path: string) => path
});

export function BasePathProvider({ children }: { children: ReactNode }) {
  const basePath = getBasePath();
  
  const getAssetPath = (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
  };

  return (
    <BasePathContext.Provider value={{ basePath, getAssetPath }}>
      {children}
    </BasePathContext.Provider>
  );
}

export function useBasePath() {
  return useContext(BasePathContext);
}
