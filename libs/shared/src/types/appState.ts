import type { AppBootstrapData } from "./appData";

export type ComponentsPayload = AppBootstrapData["components"];

export type RouteKey = "home" | "greeting" | "callout" | "not-found";

export type AppState = {
  route: RouteKey;
  components: ComponentsPayload;
};
