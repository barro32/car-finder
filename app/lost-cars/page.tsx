"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCars } from '../../hooks/useCars';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { calculateDistance } from '../../utils/constants';
import { Car } from '../../types/car';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';

export default function LostCarsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCars();
  const { mapCenter, isGettingLocation } = useCurrentLocation();

  const handleCarClick = (carId: number) => {
    router.push(`/?carId=${carId}`);
    // Scroll to top to ensure map is visible
    window.scrollTo(0, 0);
  };

  if (isLoading) return <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>Loading cars...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>Error loading cars: {error.message}</div>;
  if (!data?.cars) return <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>No cars found</div>;

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
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <header style={{ 
        background: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px var(--shadow-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '1px', cursor: 'pointer' }}>Car Finder</h1>
          </Link>
          <span style={{ color: 'var(--text-accent)', fontWeight: 500 }}>Lost Cars</span>
          {isGettingLocation && (
            <span style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-accent)', 
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
        <ThemeSwitcher />
      </header>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Lost Cars Near You</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Click on any car to view its location on the map
        </p>
        {!mapCenter && !isGettingLocation && <p style={{ color: 'var(--text-secondary)' }}>Location not available. Showing unsorted list.</p>}
        
        <div style={{ marginTop: '2rem' }}>
          {sortedCars.map((car) => (
            <div 
              key={car.id} 
              onClick={() => handleCarClick(car.id)}
              style={{
                border: `1px solid var(--border-color)`,
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: 'var(--bg-tertiary)',
                boxShadow: `0 2px 4px var(--shadow-color)`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 12px var(--shadow-color)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 4px var(--shadow-color)`;
              }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  color: 'var(--text-accent)',
                  fontSize: '1.2rem'
                }}>
                  📍
                </div>
                <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>{car.make} {car.model}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}><strong>Color:</strong> {car.color}</p>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}><strong>License Plate:</strong> {car.licensePlate}</p>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}><strong>Reported:</strong> {new Date(car.reportedAt).toLocaleDateString()}</p>
                {car.distance !== null && (
                  <p style={{ color: 'var(--text-accent)', margin: '0.25rem 0' }}><strong>Distance:</strong> {car.distance.toFixed(2)} km</p>
                )}
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Location:</strong> {car.location.lat.toFixed(4)}, {car.location.lng.toFixed(4)}</p>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
