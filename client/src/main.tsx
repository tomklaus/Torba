import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // In development, Vite's public folder is served from root
    const swPath = import.meta.env.DEV ? '/service-worker.js' : '/service-worker.js';
    
    navigator.serviceWorker.register(swPath)
      .then((registration) => {
        console.log('[SW] Service Worker registered successfully. Scope:', registration.scope);
      })
      .catch((error) => {
        // In development, SW may fail due to Vite's HMR. This is expected.
        console.warn('[SW] Service Worker registration failed (this is normal in dev mode):', error.message || error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
