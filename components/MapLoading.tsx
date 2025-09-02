"use client";
import React from 'react';

interface MapLoadingProps {
  message: string;
  type?: 'default' | 'error';
}

export function MapLoading({ message, type = 'default' }: MapLoadingProps) {
  const color = type === 'error' ? '#e53e3e' : '#666';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontSize: '1.2rem',
      color: color
    }}>
      {message}
    </div>
  );
}
