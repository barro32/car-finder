import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  isGettingLocation: boolean;
  mapCenter: { lat: number; lng: number } | null;
  showCenterMarker: boolean;
  onStartReportFlow: () => void;
}

function Header({ isGettingLocation, mapCenter, showCenterMarker, onStartReportFlow }: HeaderProps) {
  return (
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
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a202c', letterSpacing: '1px', cursor: 'pointer' }}>Car Finder</h1>
        </Link>
        <Link href="/lost-cars" style={{ textDecoration: 'none', color: '#3182ce', fontWeight: 500 }}>
          Lost Cars
        </Link>
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
        onClick={onStartReportFlow}
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
  );
}

export default Header;
