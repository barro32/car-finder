
"use client";

import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import ReportCarForm from '../components/ReportCarForm';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationRequest, setLocationRequest] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [waitingForLocation, setWaitingForLocation] = useState(false);
  const [showCenterMarker, setShowCenterMarker] = useState(false);

  // Request current location on page load
  useEffect(() => {
    if (!navigator.geolocation || locationPermissionAsked) {
      return;
    }

    setLocationPermissionAsked(true);
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setMapCenter(currentLocation);
        setIsGettingLocation(false);
        console.log('Current location set:', currentLocation);
      },
      (error) => {
        console.log('Location access denied or unavailable, using default location');
        setIsGettingLocation(false);
        // Silently fall back to default location (London) if user denies or location unavailable
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  }, [locationPermissionAsked]);

  const handleLocationRequest = () => setLocationRequest(true);
  const handleMapClick = (location: { lat: number; lng: number }) => {
    if (locationRequest || waitingForLocation) {
      setSelectedLocation(location);
      setLocationRequest(false);
      setWaitingForLocation(false);
      
      // Add a small delay for smoother transition
      setTimeout(() => {
        // Recenter the map so the modal appears above the pin
        // We'll offset the center slightly south so the pin area is visible below the modal
        const offsetLocation = {
          lat: location.lat - 0.004, // Move center slightly more south for better positioning
          lng: location.lng
        };
        setMapCenter(offsetLocation);
        
        // Open modal after location is selected with another small delay
        setTimeout(() => {
          setIsModalOpen(true);
        }, 300);
      }, 100);
    }
  };

  const handleCurrentLocation = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    setLocationRequest(false);
    setWaitingForLocation(false);
    
    // Add a small delay for smoother transition
    setTimeout(() => {
      // Recenter the map so the modal appears above the pin
      const offsetLocation = {
        lat: location.lat - 0.004, // Move center slightly more south
        lng: location.lng
      };
      setMapCenter(offsetLocation);
      
      // Open modal after current location is set with delay
      setTimeout(() => {
        setIsModalOpen(true);
      }, 300);
    }, 100);
  };

  const startReportFlow = () => {
    setShowCenterMarker(true);
    setWaitingForLocation(false);
    setSelectedLocation(null); // Reset any previous selection
  };

  const handleCenterMarkerConfirm = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    setShowCenterMarker(false);
    setWaitingForLocation(false);
    setLocationRequest(false);
    
    // Add a small delay for smoother transition
    setTimeout(() => {
      // Recenter the map so the form appears above the location
      const offsetLocation = {
        lat: location.lat - 0.004,
        lng: location.lng
      };
      setMapCenter(offsetLocation);
      
      // Open form after location is confirmed
      setTimeout(() => {
        setIsModalOpen(true);
      }, 300);
    }, 100);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setWaitingForLocation(false);
    setLocationRequest(false);
    setShowCenterMarker(false);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Full screen map */}
      <MapView 
        onMapClick={handleMapClick} 
        selectedLocation={selectedLocation}
        center={mapCenter}
        showLocationRequest={waitingForLocation}
        showFormMarker={isModalOpen}
        onCurrentLocation={handleCurrentLocation}
        onCloseForm={closeModal}
        showCenterMarker={showCenterMarker}
        onCenterMarkerConfirm={handleCenterMarkerConfirm}
      />
      
      {/* Floating header */}
      <header style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a202c', letterSpacing: '1px' }}>Car Finder</h1>
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
        <button 
          onClick={startReportFlow}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            background: showCenterMarker ? '#48bb78' : '#3182ce',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(49, 130, 206, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = showCenterMarker ? '#38a169' : '#2c5aa0'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = showCenterMarker ? '#48bb78' : '#3182ce'}
        >
          {showCenterMarker ? '📍 Position Pin' : 'Report Car'}
        </button>
      </header>
    </div>
  );
}
