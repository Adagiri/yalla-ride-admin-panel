// src/hooks/useGoogleMaps.ts
import { useState, useEffect } from 'react';
import { googleMapsLoader } from '../utils/googleMapsLoader';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadMaps = async () => {
      try {
        await googleMapsLoader.load();
        if (mounted) {
          setIsLoaded(true);
          setLoadError(null);
        }
      } catch (error) {
        if (mounted) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load Google Maps');
          setIsLoaded(false);
        }
      }
    };

    // If already loaded, set state immediately
    if (googleMapsLoader.isMapsLoaded()) {
      setIsLoaded(true);
    } else {
      loadMaps();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { isLoaded, loadError };
};