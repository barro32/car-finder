"use client";
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import ReportCarForm from './ReportCarForm';

interface FormMarkerProps {
  position: { lat: number; lng: number };
  onCurrentLocation?: (location: { lat: number; lng: number }) => void;
  onClose?: () => void;
}

export function FormMarker({ position, onCurrentLocation, onClose }: FormMarkerProps) {
  return (
    <InfoWindow
      position={position}
      onCloseClick={onClose}
      options={{
        pixelOffset: new google.maps.Size(0, -10),
        disableAutoPan: false,
        maxWidth: 500,
        headerDisabled: true
      }}
    >
      <div style={{
        padding: '0',
        margin: '0',
        minWidth: '400px',
        maxWidth: '500px'
      }}>
        <ReportCarForm
          selectedLocation={position}
          onCurrentLocation={onCurrentLocation}
          onClose={onClose}
          isInMapMarker={true}
        />
      </div>
    </InfoWindow>
  );
}
