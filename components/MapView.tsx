"use client";
import React, { useRef, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';

type Car = {
  id: number;
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  location: { lat: number; lng: number };
  reportedAt: string;
};

const containerStyle = {
  width: '100%',
  height: '100%',
  flex: 1,
  minHeight: 0,
};

const center = { lat: 51.5074, lng: -0.1278 }; // London


type MapViewProps = {
  onMapClick?: (location: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  center?: { lat: number; lng: number } | null;
  showLocationRequest?: boolean;
};


function MapView({ onMapClick, selectedLocation, center: propCenter, showLocationRequest }: MapViewProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Center the map when propCenter changes
  useEffect(() => {
    if (mapRef.current && propCenter) {
      mapRef.current.panTo(propCenter);
      mapRef.current.setZoom(15); // Zoom in when centering on current location
    }
  }, [propCenter]);

  const { data, error, isLoading } = useQuery<{ cars: Car[] }, Error>({
    queryKey: ['cars'],
    queryFn: async () => {
      const res = await fetch('/api/cars');
      if (!res.ok) {
        const text = await res.text();
        console.error('API error:', res.status, text);
        throw new Error(`API error: ${res.status}`);
      }
      try {
        return await res.json();
      } catch (err) {
        const text = await res.text();
        console.error('JSON parse error. Response text:', text);
        throw err;
      }
    },
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (onMapClick && e.latLng) {
      onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) {
    return <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      fontSize: '1.2rem', 
      color: '#666' 
    }}>Loading map...</div>;
  }
  if (isLoading) {
    return <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      fontSize: '1.2rem', 
      color: '#666' 
    }}>Loading cars...</div>;
  }
  if (error) {
    return <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      fontSize: '1.2rem', 
      color: '#e53e3e' 
    }}>Error loading cars: {error.message}</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={propCenter || center}
        zoom={propCenter ? 15 : 13}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
      >
        {data?.cars.map((car) => (
          <Marker
            key={car.id}
            position={car.location}
            label={car.licensePlate}
          />
        ))}
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            label="New"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
          />
        )}
      </GoogleMap>
      
      {/* Location selection overlay */}
      {showLocationRequest && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            padding: '1.5rem 2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            maxWidth: 300
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#1a202c' }}>Select Car Location</h3>
            <p style={{ margin: 0, color: '#4a5568', fontSize: '0.9rem' }}>
              Click anywhere on the map to mark where the car was seen
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
