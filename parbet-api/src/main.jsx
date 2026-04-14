import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAuthStore } from './store/useAuthStore';

// CRITICAL UI FIX: Inject Global Tailwind Stylesheet
// Without this import, Vite will not compile the CSS and the UI will remain completely unstyled.
import './index.css';

/**
 * FEATURE 1: Global Security Initialization
 * Arms the Firebase Authentication listener immediately upon application boot.
 * This ensures the AdminGuard intercepts the session state before the DOM settles.
 */
useAuthStore.getState().init();

/**
 * FEATURE 2: React Application Mount
 * Targets the strict <div id="root"></div> defined in index.html.
 */
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);