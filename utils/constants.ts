// Map configuration constants
export const DEFAULT_MAP_CENTER = { lat: 51.5074, lng: -0.1278 }; // London

export const MAP_STYLES = {
  containerStyle: {
    width: '100%',
    height: '100%',
    flex: 1,
    minHeight: 0,
  }
};

// Location utility functions
export const getOffsetLocation = (location: { lat: number; lng: number }, offsetLat = -0.004) => ({
  lat: location.lat + offsetLat,
  lng: location.lng
});

// Geolocation options
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000 // 5 minutes cache
};
