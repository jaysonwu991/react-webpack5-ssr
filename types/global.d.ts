import type { AppBootstrapData } from "../libs/shared/src/types/appData";

export {};

declare global {
  interface Window {
    INITIAL_DATA?: AppBootstrapData;
  }
}
