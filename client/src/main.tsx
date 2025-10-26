import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Use different SW files for dev vs production
      const swPath = import.meta.env.DEV ? '/sw-dev.js' : '/service-worker.js';
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('[SW] Service Worker registered successfully. Scope:', registration.scope);
    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
