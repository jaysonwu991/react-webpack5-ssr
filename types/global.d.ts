import type { AppState } from "@shared/types/appState";

export {};

declare global {
  interface Window {
    __APP_STATE__?: AppState;
  }
}
