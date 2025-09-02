"use client";
import React from 'react';
import styles from './MapLoading.module.css';

interface MapLoadingProps {
  message: string;
  type?: 'default' | 'error';
}

export function MapLoading({ message, type = 'default' }: MapLoadingProps) {
  return (
    <div className={`${styles.container} ${type === 'error' ? styles.containerError : ''}`}>
      {message}
    </div>
  );
}
