import { useState, useEffect } from 'react';
import { GEOLOCATION_OPTIONS } from '../utils/constants';

export function useCurrentLocation() {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation || locationPermissionAsked) {
      return;
    }

    setLocationPermissionAsked(true);
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setMapCenter(currentLocation);
        setIsGettingLocation(false);
        console.log('Current location set:', currentLocation);
      },
      (error) => {
        console.log('Location access denied or unavailable, using default location');
        setIsGettingLocation(false);
        // Silently fall back to default location (London) if user denies or location unavailable
      },
      GEOLOCATION_OPTIONS
    );
  }, [locationPermissionAsked]);

  return {
    mapCenter,
    setMapCenter,
    isGettingLocation
  };
}
