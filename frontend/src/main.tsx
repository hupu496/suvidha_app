
import React from 'react';
import { createRoot } from 'react-dom/client';

import './global.css';
import WebApp from './WebApp';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Check that index.html contains <div id="root"></div>.',
  );
}

createRoot(rootElement).render(
  <React.StrictMode>
    <WebApp />
  </React.StrictMode>,
);
