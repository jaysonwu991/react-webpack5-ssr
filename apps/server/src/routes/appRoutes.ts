import type { ComponentDataLoaders } from "./componentData";
import type {
  AppState,
  ComponentsPayload,
  RouteKey,
} from "@shared/types/appState";

const buildState = (
  route: RouteKey,
  components: ComponentsPayload
): AppState => ({
  route,
  components,
});

export const createRouteBuilders = (components: ComponentDataLoaders) => {
  const buildHomeState = (): AppState =>
    buildState("home", components.fetchHomeProps());

  const buildGreetingState = (name?: string): AppState =>
    buildState("greeting", components.fetchGreetingCardProps(name));

  const buildCalloutState = (): AppState =>
    buildState("callout", components.fetchCalloutBannerProps());

  const buildNotFoundState = (): AppState =>
    buildState("not-found", {
      greetingCard: undefined,
      calloutBanner: undefined,
    });

  return {
    buildHomeState,
    buildGreetingState,
    buildCalloutState,
    buildNotFoundState,
  };
};

export type RouteBuilders = ReturnType<typeof createRouteBuilders>;
