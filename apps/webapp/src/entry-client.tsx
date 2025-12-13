import { hydrateRoot } from "react-dom/client";

import { renderApp } from "./app/renderApp";
import type { AppState } from "@shared/types/appState";

// Import styles to ensure they're included in the build
import "./app/RootApp.scss";
import "./components/CalloutBanner/CalloutBanner.scss";
import "./components/GreetingCard/GreetingCard.scss";

const appContainer = document.getElementById("root");

if (!appContainer) {
  throw new Error("Root container #root was not found in the document.");
}

const appState: AppState | undefined = window.__APP_STATE__;

if (!appState) {
  throw new Error("App state was missing from the page.");
}

hydrateRoot(appContainer, renderApp(appState));
