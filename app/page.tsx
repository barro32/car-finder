
"use client";

import React, { useState } from 'react';
import MapView from '../components/MapView';
import ReportCarForm from '../components/ReportCarForm';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationRequest, setLocationRequest] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationRequest = () => setLocationRequest(true);
  const handleMapClick = (location: { lat: number; lng: number }) => {
    if (locationRequest) {
      setSelectedLocation(location);
      setLocationRequest(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Full screen map */}
      <MapView onMapClick={handleMapClick} selectedLocation={locationRequest ? selectedLocation : null} />
      
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
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a202c', letterSpacing: '1px' }}>Car Finder</h1>
        <button 
          onClick={openModal}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            background: '#3182ce',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(49, 130, 206, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#2c5aa0'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#3182ce'}
        >
          Report Car
        </button>
      </header>

      {/* Modal overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            padding: '2rem',
            maxWidth: 500,
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Close button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#718096',
                padding: '0.5rem',
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#f7fafc'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = 'none'}
            >
              ×
            </button>
            
            <ReportCarForm 
              selectedLocation={selectedLocation} 
              onLocationRequest={handleLocationRequest}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
