import type { AppBootstrapData } from "../src/shared/types/appData";

export {};

declare global {
  interface Window {
    INITIAL_DATA?: AppBootstrapData;
  }
}
