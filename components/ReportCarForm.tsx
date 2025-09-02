import React, { useState } from 'react';
import { Location } from '../types/car';
import { useSubmitCar } from '../hooks/useSubmitCar';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';
import Autocomplete from './Autocomplete';
import { CarDataService } from '../services/carDataService';
import styles from './ReportCarForm.module.css';

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

      <form 
        onSubmit={handleSubmit} 
        className={`${styles.container} ${!isInMapMarker ? styles.containerTransparent : ''}`}
      >
        <h2 className={`${styles.title} ${!isInMapMarker ? styles.titleLarge : ''}`}>
          Report Stolen Car
        </h2>
        
        {/* Make field */}
        <div className={styles.fieldGroup}>
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
        <div className={styles.fieldGroup}>
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
        <div className={`${styles.fieldRow} ${!isInMapMarker ? styles.fieldRowDesktop : ''}`}>
          <div className={styles.fieldGroup}>
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
            className={styles.input}
          />
        </div>
        
        {!isInMapMarker && (
          <div className={styles.buttonRow}>
            <button 
              type="button" 
              onClick={handleCurrentLocation}
              disabled={gettingLocation}
              className={`${styles.button} ${gettingLocation ? styles.buttonDisabled : ''}`}
            >
              {gettingLocation ? '📍 Getting...' : '📍 Use Current Location'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className={`${styles.button} ${styles.buttonCancel}`}
            >
              ✕ Choose Different Location
            </button>
          </div>
        )}
        
        {isInMapMarker && (
          <div className={styles.locationInfo}>
            📍 Location: {selectedLocation?.lat.toFixed(5)}, {selectedLocation?.lng.toFixed(5)}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={submitCarMutation.isPending}
          className={`${styles.button} ${styles.submitButton} ${submitCarMutation.isPending ? styles.buttonDisabled : ''}`}
        >
          {submitCarMutation.isPending ? (
            <>
              <span className={styles.spinner} />
              Submitting...
            </>
          ) : (
            'Report'
          )}
        </button>
        
        {status && (
          <div className={`${styles.status} ${
            status.includes('success') ? styles.statusSuccess :
            status.includes('error') || status.includes('Failed') ? styles.statusError :
            styles.statusInfo
          }`}>
            {status}
          </div>
        )}
      </form>
    </>
  );
}

export default ReportCarForm;
