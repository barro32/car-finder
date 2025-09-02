"use client";
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import ReportCarForm from './ReportCarForm';
import styles from './FormMarker.module.css';

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
      <div className={styles.container}>
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
