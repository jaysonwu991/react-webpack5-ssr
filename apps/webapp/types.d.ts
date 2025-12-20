import type { AppState } from "@shared";

export {};

declare global {
  interface Window {
    __APP_STATE__?: AppState;
  }
}
