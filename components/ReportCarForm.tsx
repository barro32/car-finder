"use client";
import React, { useState } from 'react';

export default function ReportCarForm() {
  const [form, setForm] = useState({
    make: '',
    model: '',
    color: '',
    licensePlate: '',
    lat: '',
    lng: '',
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        make: form.make,
        model: form.model,
        color: form.color,
        licensePlate: form.licensePlate,
        location: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
        },
      }),
    });
    if (res.ok) {
      setStatus('Car reported!');
      setForm({ make: '', model: '', color: '', licensePlate: '', lat: '', lng: '' });
    } else {
      setStatus('Failed to report car.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h2>Report Stolen Car</h2>
      <input name="make" placeholder="Make" value={form.make} onChange={handleChange} required />{' '}
      <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required />{' '}
      <input name="color" placeholder="Color" value={form.color} onChange={handleChange} required />{' '}
      <input name="licensePlate" placeholder="License Plate" value={form.licensePlate} onChange={handleChange} required />{' '}
      <input name="lat" placeholder="Latitude" value={form.lat} onChange={handleChange} required type="number" step="any" />{' '}
      <input name="lng" placeholder="Longitude" value={form.lng} onChange={handleChange} required type="number" step="any" />{' '}
      <button type="submit">Report</button>
      {status && <div>{status}</div>}
    </form>
  );
}
