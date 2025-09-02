import React from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
  isGettingLocation: boolean;
  mapCenter: { lat: number; lng: number } | null;
  showCenterMarker: boolean;
  onStartReportFlow: () => void;
}

function Header({ isGettingLocation, mapCenter, showCenterMarker, onStartReportFlow }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logoLink}>
            <h1 className={styles.logo}>Car Finder</h1>
          </Link>
          <Link href="/lost-cars" className={styles.navLink}>
            Lost Cars
          </Link>
          {isGettingLocation && (
            <span className={styles.locationStatus}>
              📍 Getting your location...
            </span>
          )}
          {mapCenter && !isGettingLocation && (
            <span className={styles.locationInfo}>
              📍 Located
            </span>
          )}
        </div>
        
        <div className={styles.actionsSection}>
          <ThemeSwitcher />
          <button 
            onClick={onStartReportFlow}
            className={`${styles.reportButton} ${showCenterMarker ? styles.reportButtonSecondary : ''}`}
          >
            {showCenterMarker ? '📍 Position Pin' : 'Report Car'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
