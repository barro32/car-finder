"use client";
import React from 'react';
import styles from './CenterMarkerOverlay.module.css';

interface CenterMarkerOverlayProps {
  mapCenter: { lat: number; lng: number } | null;
  onConfirm?: (location: { lat: number; lng: number }) => void;
}

export function CenterMarkerOverlay({ mapCenter, onConfirm }: CenterMarkerOverlayProps) {
  return (
    <>
      {/* Center pin */}
      <div className={styles.centerPin}>
        <div className={styles.pinIcon}>📍</div>
      </div>

      {/* Confirmation button */}
      <div className={styles.confirmButtonContainer}>
        <button
          onClick={() => {
            if (mapCenter && onConfirm) {
              onConfirm(mapCenter);
            }
          }}
          className={styles.confirmButton}
        >
          📍 Confirm Location
        </button>
      </div>

      {/* Instruction overlay */}
      <div className={styles.instructionContainer}>
        <div className={styles.instruction}>
          <h3>Position the Pin</h3>
          <p>Move the map to position the pin exactly where the car was seen</p>
        </div>
      </div>
    </>
  );
}
