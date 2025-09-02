"use client";
import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import ReportCarForm from './ReportCarForm';
import { Car } from '../types/car';
import { DEFAULT_MAP_CENTER, MAP_STYLES } from '../utils/constants';
import { useCars } from '../hooks/useCars';

const containerStyle = MAP_STYLES.containerStyle;
const center = DEFAULT_MAP_CENTER;


type MapViewProps = {
  selectedLocation?: { lat: number; lng: number } | null;
  center?: { lat: number; lng: number } | null;
  showFormMarker?: boolean;
  onCurrentLocation?: (location: { lat: number; lng: number }) => void;
  onCloseForm?: () => void;
  showCenterMarker?: boolean;
  onCenterMarkerConfirm?: (location: { lat: number; lng: number }) => void;
  selectedCar?: Car | null;
};


function MapView({ 
  selectedLocation, 
  center: propCenter, 
  showFormMarker,
  onCurrentLocation,
  onCloseForm,
  showCenterMarker,
  onCenterMarkerConfirm,
  selectedCar
}: MapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<Car | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Center the map when propCenter changes
  useEffect(() => {
    if (mapRef.current && propCenter) {
      // Small delay to ensure map is fully loaded
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.panTo(propCenter);
          mapRef.current.setZoom(16); // Zoom in when centering on current location
          console.log('Map centered on:', propCenter);
        }
      }, 100);
    }
  }, [propCenter]);

  // Handle selectedCar from props - auto-open InfoWindow
  useEffect(() => {
    if (selectedCar) {
      setSelectedMarker(selectedCar);
    }
  }, [selectedCar]);
  useEffect(() => {
    if (mapRef.current && showCenterMarker) {
      const handleCenterChanged = () => {
        const center = mapRef.current?.getCenter();
        if (center) {
          setMapCenter({
            lat: center.lat(),
            lng: center.lng()
          });
        }
      };

      const listener = mapRef.current.addListener('center_changed', handleCenterChanged);
      
      // Initial center
      handleCenterChanged();

      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    }
  }, [showCenterMarker]);

  const { data, error, isLoading } = useCars();

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) {
    return <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      fontSize: '1.2rem', 
      color: '#666' 
    }}>Loading map...</div>;
  }
  if (isLoading) {
    return <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      fontSize: '1.2rem', 
      color: '#666' 
    }}>Loading cars...</div>;
  }
  if (error) {
    return <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      fontSize: '1.2rem', 
      color: '#e53e3e' 
    }}>Error loading cars: {error.message}</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={propCenter || center}
        zoom={propCenter ? 15 : 13}
        onLoad={handleMapLoad}
      >
        {data?.cars
          .filter((car: Car) => !selectedCar || car.id !== selectedCar.id)
          .map((car: Car) => (
          <div key={car.id}>
            <Marker
              position={car.location}
              onClick={() => setSelectedMarker(car)}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15" fill="#3182ce" stroke="#ffffff" stroke-width="2"/>
                    <rect x="8" y="12" width="16" height="8" rx="2" fill="#2c5aa0"/>
                    <circle cx="12" cy="20" r="1.5" fill="#1a365d"/>
                    <circle cx="20" cy="20" r="1.5" fill="#1a365d"/>
                    <text x="16" y="10" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="8" font-weight="bold">${car.licensePlate.substring(0, 3).toUpperCase()}</text>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
              }}
              options={{
                optimized: false,
                clickable: true,
                zIndex: 1
              }}
              title={`${car.make} ${car.model} - ${car.licensePlate}`}
            />
          </div>
        ))}

        {/* InfoWindow for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.location}
            onCloseClick={() => setSelectedMarker(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -10),
              disableAutoPan: false,
              maxWidth: 300
            }}
          >
            <div className="car-info-window">
              <button
                onClick={() => setSelectedMarker(null)}
                className="car-info-close-btn"
                title="Close"
              >
                ×
              </button>
              <h4 className="car-info-title">
                🚗 {selectedMarker.make} {selectedMarker.model}
              </h4>
              <div className="car-info-details">
                <p className="car-info-item">
                  <strong>📋 License Plate:</strong> {selectedMarker.licensePlate}
                </p>
                <p className="car-info-item">
                  <strong>🎨 Color:</strong> {selectedMarker.color}
                </p>
                <p className="car-info-item">
                  <strong>📅 Reported:</strong> {new Date(selectedMarker.reportedAt).toLocaleDateString()}
                </p>
                <p className="car-info-location">
                  <strong>📍 Location:</strong> {selectedMarker.location.lat.toFixed(4)}, {selectedMarker.location.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Selected car marker - highlighted */}
        {selectedCar && (
          <div>
            <Marker
              position={selectedCar.location}
              onClick={() => setSelectedMarker(selectedCar)}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#ff4444" stroke="#ffffff" stroke-width="3"/>
                    <text x="20" y="25" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="12" font-weight="bold">!</text>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
              }}
              options={{
                optimized: false,
                clickable: true,
                zIndex: 2
              }}
              title={`${selectedCar.make} ${selectedCar.model} - ${selectedCar.licensePlate}`}
            />
          </div>
        )}
        
        {/* Custom form marker */}
        {selectedLocation && showFormMarker && (
          <InfoWindow
            position={selectedLocation}
            onCloseClick={onCloseForm}
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
                selectedLocation={selectedLocation} 
                onCurrentLocation={onCurrentLocation}
                onClose={onCloseForm}
                isInMapMarker={true}
              />
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Center marker overlay */}
      {showCenterMarker && (
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
                if (mapCenter && onCenterMarkerConfirm) {
                  onCenterMarkerConfirm(mapCenter);
                }
              }}
              style={{
                padding: '16px 32px',
                borderRadius: 12,
                background: '#48bb78',
                color: '#fff',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(72, 187, 120, 0.4)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.background = '#38a169';
                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.background = '#48bb78';
                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
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
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              padding: '1rem 1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
              maxWidth: 280,
              border: '2px solid #48bb78'
            }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#1a202c', fontSize: '1rem' }}>Position the Pin</h3>
            <p style={{ margin: 0, color: '#4a5568', fontSize: '0.85rem' }}>
              Move the map to position the pin exactly where the car was seen
            </p>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default MapView;
