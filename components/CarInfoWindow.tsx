"use client";
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Car } from '../types/car';

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
      <div className="car-info-window">
        <button
          onClick={onClose}
          className="car-info-close-btn"
          title="Close"
        >
          ×
        </button>
        <h4 className="car-info-title">
          🚗 {car.make} {car.model}
        </h4>
        <div className="car-info-details">
          <p className="car-info-item">
            <strong>📋 License Plate:</strong> {car.licensePlate}
          </p>
          <p className="car-info-item">
            <strong>🎨 Color:</strong> {car.color}
          </p>
          <p className="car-info-item">
            <strong>📅 Reported:</strong> {new Date(car.reportedAt).toLocaleDateString()}
          </p>
          <p className="car-info-location">
            <strong>📍 Location:</strong> {car.location.lat.toFixed(4)}, {car.location.lng.toFixed(4)}
          </p>
        </div>
      </div>
    </InfoWindow>
  );
}
