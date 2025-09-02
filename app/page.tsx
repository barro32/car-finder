
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MapView from '../components/MapView';
import Header from '../components/Header';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useCars } from '../hooks/useCars';
import { getOffsetLocation } from '../utils/constants';
import { Car } from '../types/car';

// Component that uses useSearchParams - needs to be wrapped in Suspense
function HomeContent() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCenterMarker, setShowCenterMarker] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [mapCenterOverride, setMapCenterOverride] = useState<{ lat: number; lng: number } | null>(null);

  const { mapCenter: currentLocation, setMapCenter, isGettingLocation } = useCurrentLocation();
  const { data } = useCars();
  const searchParams = useSearchParams();

  // Handle carId from URL parameters
  useEffect(() => {
    const carId = searchParams.get('carId');
    if (carId && data?.cars) {
      const car = data.cars.find((c: Car) => c.id === parseInt(carId));
      if (car) {
        setSelectedCar(car);
        // Center map on the car's location with offset
        const offsetLocation = getOffsetLocation(car.location);
        setMapCenterOverride(offsetLocation);
        console.log('Centering map on car:', car.id, 'at location:', offsetLocation);

        // Also update the current location hook so it stays in sync
        setMapCenter(offsetLocation);

        // Scroll to top to ensure map is visible
        window.scrollTo(0, 0);
      }
    } else {
      // Clear override when no carId
      setMapCenterOverride(null);
      setSelectedCar(null);
    }
  }, [searchParams, data, setMapCenter]);

  // Use override center if available, otherwise use current location
  const effectiveMapCenter = mapCenterOverride || currentLocation;

  const handleCurrentLocation = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    
    // Add a small delay for smoother transition
    setTimeout(() => {
      // Recenter the map so the modal appears above the pin
      const offsetLocation = getOffsetLocation(location);
      setMapCenter(offsetLocation);
      
      // Open modal after current location is set with delay
      setTimeout(() => {
        setIsModalOpen(true);
      }, 300);
    }, 100);
  };

  const startReportFlow = () => {
    setShowCenterMarker(true);
    setSelectedLocation(null); // Reset any previous selection
    setSelectedCar(null); // Clear selected car when starting report flow
    setMapCenterOverride(null); // Clear map center override
  };

  const handleCenterMarkerConfirm = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    setShowCenterMarker(false);
    
    // Add a small delay for smoother transition
    setTimeout(() => {
      // Recenter the map so the form appears above the location
      const offsetLocation = getOffsetLocation(location);
      setMapCenter(offsetLocation);
      
      // Open form after location is confirmed
      setTimeout(() => {
        setIsModalOpen(true);
      }, 300);
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowCenterMarker(false);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Full screen map */}
      <MapView
        selectedLocation={selectedLocation}
        center={effectiveMapCenter}
        showFormMarker={isModalOpen}
        onCurrentLocation={handleCurrentLocation}
        onCloseForm={closeModal}
        showCenterMarker={showCenterMarker}
        onCenterMarkerConfirm={handleCenterMarkerConfirm}
        selectedCar={selectedCar}
      />

      {/* Floating header */}
      <Header
        isGettingLocation={isGettingLocation}
        mapCenter={effectiveMapCenter}
        showCenterMarker={showCenterMarker}
        onStartReportFlow={startReportFlow}
      />
    </div>
  );
}

// Loading fallback for Suspense
function HomeLoading() {
  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚗</div>
        <div>Loading Car Finder...</div>
      </div>
    </div>
  );
}

// Main export function with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
