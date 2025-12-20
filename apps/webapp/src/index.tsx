import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { loadableReady } from '@loadable/component';

import App from './App';
import type { AppState } from '@react-ssr-falcon/shared';

// Import global styles
import './styles/global.scss';

/**
 * Client-side hydration entry point
 * Uses window.__APP_STATE__ for server-rendered data
 */
const renderApp = () => {
  // Get server-rendered state
  const appState: AppState = window.__APP_STATE__;

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

// Wait for loadable chunks to be ready, then hydrate
loadableReady(() => {
  renderApp();
});

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
