
"use client";

import React, { useState } from 'react';
import MapView from '../components/MapView';
import Header from '../components/Header';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { getOffsetLocation } from '../utils/constants';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCenterMarker, setShowCenterMarker] = useState(false);
  
  const { mapCenter, setMapCenter, isGettingLocation } = useCurrentLocation();

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
        center={mapCenter}
        showFormMarker={isModalOpen}
        onCurrentLocation={handleCurrentLocation}
        onCloseForm={closeModal}
        showCenterMarker={showCenterMarker}
        onCenterMarkerConfirm={handleCenterMarkerConfirm}
      />
      
      {/* Floating header */}
      <Header 
        isGettingLocation={isGettingLocation}
        mapCenter={mapCenter}
        showCenterMarker={showCenterMarker}
        onStartReportFlow={startReportFlow}
      />
    </div>
  );
}
