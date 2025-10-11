// src/utils/locationDataFormatter.ts
import { Location } from '../types/index';


export interface CreateLocationInput {
  name: string;
  description?: string;
  address?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  boundary?: {
    type: "Polygon";
    coordinates: [[[number, number]]];
  };
  locationType: "estate" | "landmark" | "general";
  isActive: boolean;
}

export interface UpdateLocationInput {
  name?: string;
  description?: string;
  address?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  boundary?: {
    type: "Polygon";
    coordinates: [[[number, number]]];
  } | null;
  locationType?: "estate" | "landmark" | "general";
  isActive?: boolean;
}

export const formatCreateLocationData = (
  values: any,
  selectedBoundary: [[[number, number]]] | null
): CreateLocationInput => {
  const data: CreateLocationInput = {
    name: values.name?.trim(),
    description: values.description?.trim() || undefined,
    address: values.address?.trim() || undefined,
    locationType: values.locationType || 'general',
    isActive: values.isActive !== undefined ? values.isActive : true,
    location: {
      type: "Point",
      coordinates: values.location?.coordinates || [0, 0],
    },
  };

  // Only include boundary if it's valid
  if (selectedBoundary && selectedBoundary[0] && selectedBoundary[0].length >= 3) {
    data.boundary = {
      type: "Polygon",
      coordinates: selectedBoundary,
    };
  }

  console.log('📤 Create Location Data:', JSON.stringify(data, null, 2));
  return data;
};

export const formatUpdateLocationData = (
  values: any,
  selectedBoundary: [[[number, number]]] | null,
  existingLocation?: Location
): UpdateLocationInput => {
  const data: UpdateLocationInput = {};

  // Only include fields that have changed
  if (values.name !== undefined) data.name = values.name.trim();
  if (values.description !== undefined) data.description = values.description.trim() || null;
  if (values.address !== undefined) data.address = values.address.trim() || null;
  if (values.locationType !== undefined) data.locationType = values.locationType;
  if (values.isActive !== undefined) data.isActive = values.isActive;
  
  // Handle location coordinates
  if (values.location?.coordinates) {
    data.location = {
      type: "Point",
      coordinates: values.location.coordinates,
    };
  }

  // Handle boundary - explicitly set to null if removed, include if new/updated
  if (selectedBoundary) {
    if (selectedBoundary[0] && selectedBoundary[0].length >= 3) {
      data.boundary = {
        type: "Polygon",
        coordinates: selectedBoundary,
      };
    } else if (existingLocation?.boundary) {
      // Boundary was removed
      data.boundary = null;
    }
  }

  console.log('📤 Update Location Data:', JSON.stringify(data, null, 2));
  return data;
};

export const validateLocationData = (data: any): string[] => {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Location name is required');
  }

  if (!data.location?.coordinates || !Array.isArray(data.location.coordinates)) {
    errors.push('Valid location coordinates are required');
  } else {
    const [lng, lat] = data.location.coordinates;
    if (typeof lng !== 'number' || typeof lat !== 'number') {
      errors.push('Location coordinates must be numbers');
    }
    if (lng < -180 || lng > 180) {
      errors.push('Longitude must be between -180 and 180');
    }
    if (lat < -90 || lat > 90) {
      errors.push('Latitude must be between -90 and 90');
    }
  }

  if (data.boundary && data.boundary.coordinates) {
    const rings = data.boundary.coordinates[0];
    if (!Array.isArray(rings) || rings.length < 3) {
      errors.push('Boundary must have at least 3 points');
    }
  }

  return errors;
};