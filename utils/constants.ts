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

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
