import React, { useState } from 'react';
import { Location } from '../types/car';
import { useSubmitCar } from '../hooks/useSubmitCar';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';
import Autocomplete from './Autocomplete';
import { CarDataService } from '../services/carDataService';

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
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);

  const submitCarMutation = useSubmitCar();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMakeChange = (make: string) => {
    setForm({ ...form, make, model: '' }); // Reset model when make changes
    const makeData = CarDataService.getMakeByName(make);
    setSelectedMakeId(makeData?.id || null);
  };

  const handleModelChange = (model: string) => {
    setForm({ ...form, model });
  };

  const handleColorChange = (color: string) => {
    setForm({ ...form, color });
  };

  const searchMakes = async (query: string): Promise<string[]> => {
    const makes = await CarDataService.searchMakes(query);
    return makes.map(make => make.name);
  };

  const searchModels = async (query: string): Promise<string[]> => {
    if (!selectedMakeId) return [];
    const models = await CarDataService.searchModels(selectedMakeId, query);
    return models.map(model => model.name);
  };

  const searchColors = async (query: string): Promise<string[]> => {
    return CarDataService.searchColors(query);
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

    try {
      await submitCarMutation.mutateAsync({
        make: form.make,
        model: form.model,
        color: form.color,
        licensePlate: form.licensePlate,
        location: selectedLocation,
      });

      setStatus('Car reported successfully!');
      showSuccess('Car reported and added to map! 🚗');
      setForm({ make: '', model: '', color: '', licensePlate: '' });
      
      // Close modal after successful submission
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting car:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Failed to report car: ${errorMessage}`);
      showError(`Failed to report car: ${errorMessage}`);
    }
  };

  return (
    <>
      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <form onSubmit={handleSubmit} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 20, // Increased gap for autocomplete dropdowns
      background: isInMapMarker ? 'var(--bg-secondary)' : 'transparent',
      padding: isInMapMarker ? '1.5rem' : '0',
      borderRadius: isInMapMarker ? '12px' : '0',
      boxShadow: isInMapMarker ? `0 4px 20px var(--shadow-color)` : 'none',
      minWidth: isInMapMarker ? '400px' : 'auto', // Increased width
      position: 'relative',
      color: 'var(--text-primary)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <h2 style={{ 
        margin: 0, 
        marginBottom: 12, 
        fontSize: isInMapMarker ? '1.1rem' : '1.25rem', 
        color: 'var(--text-primary)',
        textAlign: isInMapMarker ? 'center' : 'left'
      }}>Report Stolen Car</h2>
      
      {/* Make field */}
      <div style={{ position: 'relative', zIndex: 4 }}>
        <Autocomplete
          name="make"
          placeholder="Car Make (e.g., Toyota, Honda, BMW)"
          value={form.make}
          onChange={handleMakeChange}
          onSearch={searchMakes}
          required
        />
      </div>

      {/* Model field */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <Autocomplete
          name="model"
          placeholder={selectedMakeId ? "Model (e.g., Camry, Civic)" : "Select make first"}
          value={form.model}
          onChange={handleModelChange}
          onSearch={searchModels}
          required
        />
      </div>

      {/* Color and License plate row */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        position: 'relative', 
        zIndex: 2,
        flexDirection: isInMapMarker ? 'column' : 'row' // Stack vertically in modal for more space
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Autocomplete
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleColorChange}
            onSearch={searchColors}
            required
          />
        </div>
        <input 
          name="licensePlate" 
          placeholder="License Plate" 
          value={form.licensePlate} 
          onChange={handleChange} 
          required 
          style={{ 
            flex: 1, 
            padding: 8, 
            borderRadius: 6, 
            border: `1px solid var(--border-color)`,
            fontSize: '1rem',
            boxSizing: 'border-box',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            transition: 'border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease'
          }} 
        />
      </div>
      
      {!isInMapMarker && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, position: 'relative', zIndex: 1 }}>
          <button 
            type="button" 
            onClick={handleCurrentLocation}
            disabled={gettingLocation}
            style={{ 
              flex: 1,
              padding: '10px 12px', 
              borderRadius: 6, 
              background: gettingLocation ? 'var(--border-color)' : 'var(--button-secondary-bg)', 
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
          background: 'var(--bg-tertiary)', 
          border: `1px solid var(--border-color)`,
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          📍 Location: {selectedLocation?.lat.toFixed(5)}, {selectedLocation?.lng.toFixed(5)}
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={submitCarMutation.isPending}
        style={{ 
          marginTop: 16, 
          padding: '12px 0', 
          borderRadius: 6, 
          background: submitCarMutation.isPending ? 'var(--border-color)' : 'var(--button-bg)', 
          color: '#fff', 
          border: 'none', 
          fontWeight: 600, 
          fontSize: '1rem', 
          cursor: submitCarMutation.isPending ? 'not-allowed' : 'pointer', 
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {submitCarMutation.isPending ? (
          <>
            <span style={{ 
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid #fff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Submitting...
          </>
        ) : (
          'Report'
        )}
      </button>
      {status && <div style={{ marginTop: 8, color: status.includes('success') ? 'green' : 'red', fontSize: '0.9rem', textAlign: 'center' }}>{status}</div>}
    </form>
    </>
  );
}

export default ReportCarForm;
