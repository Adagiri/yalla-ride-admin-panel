export const formatCurrency = (
  amount: number,
  currency: string = 'NGN'
): string => {
  const symbol = currency === 'NGN' ? '₦' : '$';
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    active: 'success',
    approved: 'success',
    completed: 'success',
    pending: 'processing',
    in_progress: 'processing',
    searching: 'warning',
    expired: 'error',
    failed: 'error',
    cancelled: 'error',
    rejected: 'error',
    inactive: 'default',
  };
  return statusColors[status.toLowerCase()] || 'default';
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Map


export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapBoundary {
  type: "Polygon";
  coordinates: [[[number, number]]];
}

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return "Address not found";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Could not fetch address";
  }
};

export const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const formatCoordinates = (coords: [number, number]): string => {
  return `[${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}]`;
};

export const isBoundaryValid = (boundary: [[[number, number]]] | null): boolean => {
  return !!(boundary && boundary[0] && boundary[0].length >= 3);
};