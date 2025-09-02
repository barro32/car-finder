import React from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';

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
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '1px', cursor: 'pointer' }}>Car Finder</h1>
        </Link>
        <Link href="/lost-cars" style={{ textDecoration: 'none', color: 'var(--text-accent)', fontWeight: 500 }}>
          Lost Cars
        </Link>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeSwitcher />
        <button 
          onClick={onStartReportFlow}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            background: showCenterMarker ? 'var(--button-secondary-bg)' : 'var(--button-bg)',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px var(--shadow-color)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = showCenterMarker ? 'var(--button-secondary-hover)' : 'var(--button-hover)'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = showCenterMarker ? 'var(--button-secondary-bg)' : 'var(--button-bg)'}
        >
          {showCenterMarker ? '📍 Position Pin' : 'Report Car'}
        </button>
      </div>
    </header>
  );
}

export default Header;
