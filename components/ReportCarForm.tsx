import React, { useState } from 'react';
import { Location } from '../types/car';

function ReportCarForm({ selectedLocation, onCurrentLocation, onClose, isInMapMarker }: { 
  selectedLocation: Location, 
  onCurrentLocation?: (location: { lat: number; lng: number }) => void,
  onClose?: () => void,
  isInMapMarker?: boolean
}) {
  const [form, setForm] = useState({
    make: '',
    model: '',
    color: '',
    licensePlate: '',
  });
  const [status, setStatus] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by this browser.');
      return;
    }

    setGettingLocation(true);
    setStatus('Getting your current location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if (onCurrentLocation) {
          onCurrentLocation(location);
        }
        setGettingLocation(false);
        setStatus('Current location set! You can adjust it by clicking on the map if needed.');
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatus('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setStatus('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setStatus('Location request timed out.');
            break;
          default:
            setStatus('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!selectedLocation) {
      setStatus('Please select a location on the map.');
      return;
    }
    const res = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        make: form.make,
        model: form.model,
        color: form.color,
        licensePlate: form.licensePlate,
        location: selectedLocation,
      }),
    });
    if (res.ok) {
      setStatus('Car reported successfully!');
      setForm({ make: '', model: '', color: '', licensePlate: '' });
      // Close modal after successful submission if onClose is provided
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } else {
      setStatus('Failed to report car.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 12,
      background: isInMapMarker ? '#fff' : 'transparent',
      padding: isInMapMarker ? '1.5rem' : '0',
      borderRadius: isInMapMarker ? '12px' : '0',
      boxShadow: isInMapMarker ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
      minWidth: isInMapMarker ? '350px' : 'auto'
    }}>
      <h2 style={{ 
        margin: 0, 
        marginBottom: 12, 
        fontSize: isInMapMarker ? '1.1rem' : '1.25rem', 
        color: '#2d3748',
        textAlign: isInMapMarker ? 'center' : 'left'
      }}>Report Stolen Car</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <input name="make" placeholder="Make" value={form.make} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
        <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <input name="color" placeholder="Color" value={form.color} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
        <input name="licensePlate" placeholder="License Plate" value={form.licensePlate} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
      </div>
      
      {!isInMapMarker && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button 
            type="button" 
            onClick={handleCurrentLocation}
            disabled={gettingLocation}
            style={{ 
              flex: 1,
              padding: '10px 12px', 
              borderRadius: 6, 
              background: gettingLocation ? '#cbd5e0' : '#48bb78', 
              color: '#fff', 
              border: 'none', 
              fontWeight: 500, 
              fontSize: '0.9rem', 
              cursor: gettingLocation ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            {gettingLocation ? '📍 Getting...' : '📍 Use Current Location'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ 
              flex: 1,
              padding: '10px 12px', 
              borderRadius: 6, 
              background: '#e53e3e', 
              color: '#fff', 
              border: 'none', 
              fontWeight: 500, 
              fontSize: '0.9rem', 
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            ✕ Choose Different Location
          </button>
        </div>
      )}
      
      {isInMapMarker && (
        <div style={{ 
          padding: '8px 12px', 
          borderRadius: 6, 
          background: '#f0fff4', 
          border: '1px solid #9ae6b4',
          fontSize: '0.85rem',
          color: '#2f855a',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          📍 Location: {selectedLocation?.lat.toFixed(5)}, {selectedLocation?.lng.toFixed(5)}
        </div>
      )}
      
      <button type="submit" style={{ marginTop: 12, padding: '10px 0', borderRadius: 6, background: '#3182ce', color: '#fff', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}>Report</button>
      {status && <div style={{ marginTop: 8, color: status.includes('success') ? 'green' : 'red', fontSize: '0.9rem', textAlign: 'center' }}>{status}</div>}
    </form>
  );
}

export default ReportCarForm;
