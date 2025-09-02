"use client";
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Car } from '../types/car';
import styles from './CarInfoWindow.module.css';

interface CarInfoWindowProps {
  car: Car;
  onClose: () => void;
}

export function CarInfoWindow({ car, onClose }: CarInfoWindowProps) {
  return (
    <InfoWindow
      position={car.location}
      onCloseClick={onClose}
      options={{
        pixelOffset: new google.maps.Size(0, -10),
        disableAutoPan: false,
        maxWidth: 300
      }}
    >
      <div className={styles.infoWindow}>
        <button
          onClick={onClose}
          className={styles.closeBtn}
          title="Close"
        >
          ×
        </button>
        <h4 className={styles.title}>
          🚗 {car.make} {car.model}
        </h4>
        <div className={styles.details}>
          <p className={styles.item}>
            <strong>📋 License Plate:</strong> {car.licensePlate}
          </p>
          <p className={styles.item}>
            <strong>🎨 Color:</strong> {car.color}
          </p>
          <p className={styles.item}>
            <strong>📅 Reported:</strong> {new Date(car.reportedAt).toLocaleDateString()}
          </p>
          <p className={styles.location}>
            <strong>📍 Location:</strong> {car.location.lat.toFixed(4)}, {car.location.lng.toFixed(4)}
          </p>
        </div>
      </div>
    </InfoWindow>
  );
}
