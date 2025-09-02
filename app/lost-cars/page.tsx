"use client";

import React from 'react';
import Link from 'next/link';
import { useCars } from '../../hooks/useCars';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { calculateDistance } from '../../utils/constants';
import { Car } from '../../types/car';

export default function LostCarsPage() {
  const { data, isLoading, error } = useCars();
  const { mapCenter, isGettingLocation } = useCurrentLocation();

  if (isLoading) return <div>Loading cars...</div>;
  if (error) return <div>Error loading cars: {error.message}</div>;
  if (!data?.cars) return <div>No cars found</div>;

  const carsWithDistance = data.cars.map((car: Car) => {
    let distance = null;
    if (mapCenter) {
      distance = calculateDistance(
        mapCenter.lat,
        mapCenter.lng,
        car.location.lat,
        car.location.lng
      );
    }
    return { ...car, distance };
  });

  // Sort by distance, closest first
  const sortedCars = carsWithDistance.sort((a, b) => {
    if (a.distance === null && b.distance === null) return 0;
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });

  return (
    <div>
      <header style={{ 
        background: '#fff', 
        borderBottom: '1px solid #ddd',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a202c', letterSpacing: '1px', cursor: 'pointer' }}>Car Finder</h1>
          </Link>
          <span style={{ color: '#3182ce', fontWeight: 500 }}>Lost Cars</span>
          {isGettingLocation && (
            <span style={{ 
              fontSize: '0.9rem', 
              color: '#4299e1', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}>
              📍 Getting your location...
            </span>
          )}
          {mapCenter && !isGettingLocation && (
            <span style={{ 
              fontSize: '0.8rem', 
              color: '#48bb78', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.3rem' 
            }}>
              📍 Located
            </span>
          )}
        </div>
      </header>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Lost Cars Near You</h1>
        {!mapCenter && !isGettingLocation && <p>Location not available. Showing unsorted list.</p>}
        
        <div style={{ marginTop: '2rem' }}>
          {sortedCars.map((car) => (
            <div key={car.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9'
            }}>
              <h3>{car.make} {car.model}</h3>
              <p><strong>Color:</strong> {car.color}</p>
              <p><strong>License Plate:</strong> {car.licensePlate}</p>
              <p><strong>Reported:</strong> {new Date(car.reportedAt).toLocaleDateString()}</p>
              {car.distance !== null && (
                <p><strong>Distance:</strong> {car.distance.toFixed(2)} km</p>
              )}
              <p><strong>Location:</strong> {car.location.lat.toFixed(4)}, {car.location.lng.toFixed(4)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
