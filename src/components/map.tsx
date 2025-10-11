// src/components/MapComponent.tsx


// src/components/MapComponent.tsx
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Spin, Alert, Button, Space, message } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useGoogleMaps } from "../hooks/useGoogleMaps";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const defaultCenter = {
  lat: 8.4799,
  lng: 4.5418,
};

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onBoundaryComplete: (boundary: [[[number, number]]]) => void;
  selectedCoordinates?: { lat: number; lng: number } | null;
  selectedBoundary?: [[[number, number]]] | null;
  existingLocations?: Array<{
    id: string;
    location: { coordinates: [number, number] };
    boundary?: { coordinates: [[[number, number]]] };
    name: string;
  }>;
  enableDrawing?: boolean;
  center?: { lat: number; lng: number };
}

export const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  onBoundaryComplete,
  selectedCoordinates,
  selectedBoundary,
  existingLocations = [],
  enableDrawing = true,
  center = defaultCenter,
}) => {
  const { isLoaded, loadError } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const cleanupMapObjects = () => {
    polygonsRef.current.forEach(polygon => polygon.setMap(null));
    polygonsRef.current = [];
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      cleanupMapObjects();

      const mapInstance = new google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      setMap(mapInstance);

      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          onLocationSelect(lat, lng);
        }
      });

      if (enableDrawing) {
        const drawingManagerInstance = new google.maps.drawing.DrawingManager({
          drawingMode: null,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON],
          },
          polygonOptions: {
            fillColor: "#4285F4",
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: "#4285F4",
            clickable: true,
            editable: true,
            draggable: false,
            zIndex: 1,
          },
        });

        drawingManagerInstance.setMap(mapInstance);
        drawingManagerRef.current = drawingManagerInstance;

        google.maps.event.addListener(
          drawingManagerInstance,
          'polygoncomplete',
          (polygon: google.maps.Polygon) => {
            handlePolygonComplete(polygon);
          }
        );
      }

    } catch (error) {
      console.error("Error initializing map:", error);
      message.error("Failed to initialize map");
    }

    return () => {
      cleanupMapObjects();
    };
  }, [isLoaded, enableDrawing, center, onLocationSelect]);

  const handlePolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    try {
      const paths = polygon.getPath().getArray();
      const coordinates: [number, number][] = paths.map((point) => [
        point.lng(),
        point.lat(),
      ]);
      
      if (coordinates.length >= 3) {
        const firstPoint = coordinates[0];
        const lastPoint = coordinates[coordinates.length - 1];
        
        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
          coordinates.push([firstPoint[0], firstPoint[1]]);
        }

        const boundary: [[[number, number]]] = [coordinates];
        
        console.log("✅ Boundary data:", boundary);
        
        polygonsRef.current.push(polygon);
        
        onBoundaryComplete(boundary);
        
        google.maps.event.addListener(polygon, 'rightclick', () => {
          polygon.setMap(null);
          polygonsRef.current = polygonsRef.current.filter(p => p !== polygon);
          onBoundaryComplete([] as any);
          message.info("Boundary cleared");
        });

        const updateBoundaryFromPolygon = () => {
          const updatedPaths = polygon.getPath().getArray();
          const updatedCoordinates: [number, number][] = updatedPaths.map((point) => [
            point.lng(),
            point.lat(),
          ]);
          
          if (updatedCoordinates.length > 0) {
            const first = updatedCoordinates[0];
            const last = updatedCoordinates[updatedCoordinates.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              updatedCoordinates.push([first[0], first[1]]);
            }
          }
          
          const updatedBoundary: [[[number, number]]] = [updatedCoordinates];
          onBoundaryComplete(updatedBoundary);
        };

        polygon.getPath().addListener('set_at', updateBoundaryFromPolygon);
        polygon.getPath().addListener('insert_at', updateBoundaryFromPolygon);

        message.success(`Boundary created with ${coordinates.length} points`);
      } else {
        polygon.setMap(null);
        message.warning("Please draw a polygon with at least 3 points");
      }
    } catch (error) {
      console.error("Error handling polygon completion:", error);
      message.error("Failed to process polygon");
    }
  }, [onBoundaryComplete]);

  const clearBoundary = () => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
    
    polygonsRef.current.forEach(polygon => polygon.setMap(null));
    polygonsRef.current = [];
    
    onBoundaryComplete([] as any);
    message.info("Boundary cleared");
  };

  useEffect(() => {
    if (map && selectedCoordinates) {
      map.panTo(selectedCoordinates);
      map.setZoom(16);
    }
  }, [map, selectedCoordinates]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    existingLocations.forEach(location => {
      if (location.location?.coordinates) {
        const marker = new google.maps.Marker({
          position: {
            lat: location.location.coordinates[1],
            lng: location.location.coordinates[0],
          },
          map,
          title: location.name,
          icon: {
            url: "data:image/svg+xml;base64," + btoa(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                <circle cx="16" cy="16" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16),
          },
        });
        markersRef.current.push(marker);
      }
    });
  }, [map, isLoaded, existingLocations]);

  useEffect(() => {
    if (!map || !isLoaded || !selectedCoordinates) return;

    const marker = new google.maps.Marker({
      position: selectedCoordinates,
      map,
      icon: {
        url: "data:image/svg+xml;base64," + btoa(`
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="10" fill="#34A853" stroke="white" stroke-width="3"/>
            <circle cx="20" cy="20" r="4" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      },
    });

    markersRef.current.push(marker);

    return () => {
      marker.setMap(null);
      markersRef.current = markersRef.current.filter(m => m !== marker);
    };
  }, [map, isLoaded, selectedCoordinates]);

  useEffect(() => {
    if (!map || !isLoaded || !selectedBoundary || !selectedBoundary[0] || selectedBoundary[0].length < 3) return;

    polygonsRef.current.forEach(polygon => polygon.setMap(null));
    polygonsRef.current = [];

    const polygon = new google.maps.Polygon({
      paths: selectedBoundary[0].map(([lng, lat]) => ({ lat, lng })),
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: "#4285F4",
      fillOpacity: 0.2,
      editable: true,
      draggable: false,
      map,
    });

    polygonsRef.current.push(polygon);

    const updateBoundaryFromPolygon = () => {
      const paths = polygon.getPath().getArray();
      const coordinates: [number, number][] = paths.map((point) => [
        point.lng(),
        point.lat(),
      ]);
      
      if (coordinates.length > 0) {
        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          coordinates.push([first[0], first[1]]);
        }
      }
      
      const boundary: [[[number, number]]] = [coordinates];
      onBoundaryComplete(boundary);
    };

    polygon.getPath().addListener('set_at', updateBoundaryFromPolygon);
    polygon.getPath().addListener('insert_at', updateBoundaryFromPolygon);

    google.maps.event.addListener(polygon, 'rightclick', () => {
      polygon.setMap(null);
      polygonsRef.current = polygonsRef.current.filter(p => p !== polygon);
      onBoundaryComplete([] as any);
      message.info("Boundary cleared");
    });

    return () => {
      polygon.setMap(null);
      polygonsRef.current = polygonsRef.current.filter(p => p !== polygon);
    };
  }, [map, isLoaded, selectedBoundary, onBoundaryComplete]);

  if (loadError) {
    return (
      <Alert
        message="Google Maps Error"
        description={loadError}
        type="error"
        showIcon
      />
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin tip="Loading Google Maps..." size="large" />
      </div>
    );
  }

  const hasValidBoundary = selectedBoundary && selectedBoundary[0] && selectedBoundary[0].length >= 3;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        zIndex: 1000,
        background: 'white',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }}>
        <Space direction="vertical">
          {enableDrawing && hasValidBoundary && (
            <Button 
              size="small" 
              icon={<ClearOutlined />} 
              onClick={clearBoundary}
              danger
            >
              Clear Boundary
            </Button>
          )}
        </Space>
      </div>
      
      <div 
        ref={mapRef} 
        style={mapContainerStyle}
      />
      
      <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
        <strong>Instructions:</strong>
        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
          <li>Click on map to set location</li>
          {enableDrawing && <li>Use polygon tool (top center) to draw boundaries</li>}
          {enableDrawing && <li>Right-click polygon to delete</li>}
          {enableDrawing && <li>Drag polygon vertices to edit shape</li>}
        </ul>
      </div>
    </div>
  );
};