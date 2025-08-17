"use client";
import React from 'react';
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
};

const MapView: React.FC<MapViewProps> = ({ onMapClick, selectedLocation }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

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

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }
  if (isLoading) {
    return <div>Loading cars...</div>;
  }
  if (error) {
    return <div>Error loading cars: {error.message}</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onClick={handleMapClick}
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
  );
};

export default MapView;
