"use client";
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { Car } from '../types/car';

interface CarMarkersProps {
  cars: Car[];
  selectedCar?: Car | null;
  onMarkerClick: (car: Car) => void;
}

export function CarMarkers({ cars, selectedCar, onMarkerClick }: CarMarkersProps) {
  return (
    <>
      {cars
        .filter((car: Car) => !selectedCar || car.id !== selectedCar.id)
        .map((car: Car) => (
        <Marker
          key={car.id}
          position={car.location}
          onClick={() => onMarkerClick(car)}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15" fill="#3182ce" stroke="#ffffff" stroke-width="2"/>
                <rect x="8" y="12" width="16" height="8" rx="2" fill="#2c5aa0"/>
                <circle cx="12" cy="20" r="1.5" fill="#1a365d"/>
                <circle cx="20" cy="20" r="1.5" fill="#1a365d"/>
                <text x="16" y="10" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="8" font-weight="bold">${car.licensePlate.substring(0, 3).toUpperCase()}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32)
          }}
          options={{
            optimized: false,
            clickable: true,
            zIndex: 1
          }}
          title={`${car.make} ${car.model} - ${car.licensePlate}`}
        />
      ))}
    </>
  );
}
