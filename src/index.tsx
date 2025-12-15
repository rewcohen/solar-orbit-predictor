import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { debugLogger } from './debug.ts';
import './index.css';
import App from './App.tsx';

debugLogger.info('React app starting - entry point reached');

const container = document.getElementById('root');

debugLogger.info('Root container element found:', {
  exists: !!container,
  id: container?.id,
  innerHTML: container?.innerHTML?.substring(0, 50) + '...'
});

if (!container) {
  debugLogger.error('CRITICAL ERROR: Failed to find the root element!');
  throw new Error('Failed to find the root element');
}

debugLogger.info('Creating React root...');

const root = createRoot(container);

debugLogger.info('React root created, starting render...');

// Handle any unhandled errors during rendering
window.addEventListener('error', (event) => {
  debugLogger.error('Unhandled error during app execution:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  debugLogger.error('Unhandled promise rejection:', {
    reason: event.reason,
    promise: event.promise
  });
});

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  debugLogger.info('React app render initiated successfully');
} catch (error) {
  debugLogger.error('CRITICAL ERROR during React render:', error);
  throw error;
}
