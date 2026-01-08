import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;

