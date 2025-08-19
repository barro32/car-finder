
"use client";

import React, { useState } from 'react';
import MapView from '../components/MapView';
import ReportCarForm from '../components/ReportCarForm';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationRequest, setLocationRequest] = useState(false);

  const handleLocationRequest = () => setLocationRequest(true);
  const handleMapClick = (location: { lat: number; lng: number }) => {
    if (locationRequest) {
      setSelectedLocation(location);
      setLocationRequest(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f6f8fa' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1rem 2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a202c', letterSpacing: '1px' }}>Car Finder</h1>
      </header>
      <main style={{ padding: '2rem', maxWidth: 600, width: '100%', margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24 }}>
          <ReportCarForm selectedLocation={selectedLocation} onLocationRequest={handleLocationRequest} />
        </div>
      </main>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MapView onMapClick={handleMapClick} selectedLocation={locationRequest ? selectedLocation : null} />
      </div>
    </div>
  );
}
