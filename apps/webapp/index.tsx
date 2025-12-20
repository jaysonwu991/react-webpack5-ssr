import { hydrateRoot } from 'react-dom/client';

import App from './App';

// Import global styles
import './styles/global.scss';

/**
 * Client-side hydration entry point
 * Uses window.__APP_STATE__ for server-rendered data
 */
const renderApp = () => {
  // Get server-rendered state
  const appState = window.__APP_STATE__;

  if (!appState) {
    console.error('No __APP_STATE__ found. SSR may have failed.');
    return;
  }

  const container = document.getElementById('root');
  if (!container) {
    console.error('Root element not found');
    return;
  }

  // Hydrate with the component data from server
  hydrateRoot(container, <App {...appState.components} />);
};

// Hydrate the app
renderApp();
