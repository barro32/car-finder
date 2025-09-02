"use client";
import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Car } from '../types/car';
import { DEFAULT_MAP_CENTER, MAP_STYLES } from '../utils/constants';
import { useCars } from '../hooks/useCars';
import { CarMarkers } from './CarMarkers';
import { SelectedCarMarker } from './SelectedCarMarker';
import { CarInfoWindow } from './CarInfoWindow';
import { FormMarker } from './FormMarker';
import { CenterMarkerOverlay } from './CenterMarkerOverlay';
import { MapLoading } from './MapLoading';

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
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.panTo(propCenter);
          mapRef.current.setZoom(16);
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

  // Handle center marker positioning
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
      handleCenterChanged(); // Initial center

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

  // Loading states
  if (!isLoaded) {
    return <MapLoading message="Loading map..." />;
  }

  if (isLoading) {
    return <MapLoading message="Loading cars..." />;
  }

  if (error) {
    return <MapLoading message={`Error loading cars: ${error.message}`} type="error" />;
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={propCenter || center}
        zoom={propCenter ? 15 : 13}
        onLoad={handleMapLoad}
      >
        {/* Car markers */}
        {data?.cars && (
          <CarMarkers
            cars={data.cars}
            selectedCar={selectedCar}
            onMarkerClick={setSelectedMarker}
          />
        )}

        {/* Selected car marker */}
        {selectedCar && (
          <SelectedCarMarker
            car={selectedCar}
            onClick={setSelectedMarker}
          />
        )}

        {/* Car info window */}
        {selectedMarker && (
          <CarInfoWindow
            car={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        )}

        {/* Form marker */}
        {selectedLocation && showFormMarker && (
          <FormMarker
            position={selectedLocation}
            onCurrentLocation={onCurrentLocation}
            onClose={onCloseForm}
          />
        )}
      </GoogleMap>

      {/* Center marker overlay */}
      {showCenterMarker && (
        <CenterMarkerOverlay
          mapCenter={mapCenter}
          onConfirm={onCenterMarkerConfirm}
        />
      )}
    </div>
  );
}

export default MapView;
