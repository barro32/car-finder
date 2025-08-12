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
  height: '500px',
};

const center = { lat: 51.5074, lng: -0.1278 }; // London

const MapView: React.FC = () => {
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
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {data?.cars.map((car) => (
        <Marker
          key={car.id}
          position={car.location}
          label={car.licensePlate}
        />
      ))}
    </GoogleMap>
  );
};

export default MapView;
