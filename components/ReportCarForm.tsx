type Location = { lat: number; lng: number } | null;

import React, { useState } from 'react';

function ReportCarForm({ selectedLocation, onLocationRequest, onClose }: { 
  selectedLocation: Location, 
  onLocationRequest: () => void,
  onClose?: () => void 
}) {
  const [form, setForm] = useState({
    make: '',
    model: '',
    color: '',
    licensePlate: '',
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0, marginBottom: 12, fontSize: '1.25rem', color: '#2d3748' }}>Report Stolen Car</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <input name="make" placeholder="Make" value={form.make} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
        <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <input name="color" placeholder="Color" value={form.color} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
        <input name="licensePlate" placeholder="License Plate" value={form.licensePlate} onChange={handleChange} required style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
      </div>
      <button type="button" onClick={onLocationRequest} style={{ marginTop: 0, marginBottom: 0, padding: '8px 0', borderRadius: 6, background: '#e2e8f0', color: '#2d3748', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>
        {selectedLocation ? `Location: (${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)})` : 'Select location on map'}
      </button>
      <button type="submit" style={{ marginTop: 12, padding: '10px 0', borderRadius: 6, background: '#3182ce', color: '#fff', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}>Report</button>
      {status && <div style={{ marginTop: 8, color: status === 'Car reported!' ? 'green' : 'red' }}>{status}</div>}
    </form>
  );
}

export default ReportCarForm;
