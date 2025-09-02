"use client";
import React from 'react';

interface CenterMarkerOverlayProps {
  mapCenter: { lat: number; lng: number } | null;
  onConfirm?: (location: { lat: number; lng: number }) => void;
}

export function CenterMarkerOverlay({ mapCenter, onConfirm }: CenterMarkerOverlayProps) {
  return (
    <>
      {/* Center pin */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -100%)',
        zIndex: 600,
        pointerEvents: 'none'
      }}>
        <div style={{
          fontSize: '2.5rem',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          animation: 'pinBounce 1s ease-out'
        }}>📍</div>
      </div>

      {/* Confirmation button */}
      <div style={{
        position: 'absolute',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 600
      }}>
        <button
          onClick={() => {
            if (mapCenter && onConfirm) {
              onConfirm(mapCenter);
            }
          }}
          className="center-marker-confirm-btn"
        >
          📍 Confirm Location
        </button>
      </div>

      {/* Instruction overlay */}
      <div style={{
        position: 'absolute',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 500,
        pointerEvents: 'none'
      }}>
        <div className="center-marker-instruction">
          <h3>Position the Pin</h3>
          <p>Move the map to position the pin exactly where the car was seen</p>
        </div>
      </div>
    </>
  );
}
