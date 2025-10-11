// src/utils/googleMapsLoader.ts
class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private loadPromise: Promise<boolean> | null = null;
  private isLoaded = false;

  private constructor() {}

  public static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  public load(): Promise<boolean> {
    if (this.isLoaded) {
      return Promise.resolve(true);
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        resolve(true);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        reject(new Error('Google Maps API key is not defined'));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry,places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait a bit to ensure google.maps is fully initialized
        setTimeout(() => {
          this.isLoaded = true;
          resolve(true);
        }, 100);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  public isMapsLoaded(): boolean {
    return this.isLoaded && !!(window.google && window.google.maps);
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();