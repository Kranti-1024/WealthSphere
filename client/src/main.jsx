import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global Fetch Interceptor to handle production API routing
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  const apiBase = import.meta.env.VITE_API_URL || '';
  let finalUrl = url;
  if (typeof url === 'string' && url.startsWith('/api')) {
    finalUrl = `${apiBase}${url}`;
  }
  return originalFetch(finalUrl, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
