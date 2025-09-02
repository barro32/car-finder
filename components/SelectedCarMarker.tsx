"use client";
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { Car } from '../types/car';

interface SelectedCarMarkerProps {
  car: Car;
  onClick: (car: Car) => void;
}

export function SelectedCarMarker({ car, onClick }: SelectedCarMarkerProps) {
  return (
    <Marker
      position={car.location}
      onClick={() => onClick(car)}
      icon={{
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#ff4444" stroke="#ffffff" stroke-width="3"/>
            <text x="20" y="25" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="12" font-weight="bold">!</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40)
      }}
      options={{
        optimized: false,
        clickable: true,
        zIndex: 2
      }}
      title={`${car.make} ${car.model} - ${car.licensePlate}`}
    />
  );
}
