import {
  fetchCalloutBannerProps,
  fetchGreetingCardProps,
  fetchHomeProps,
} from "./componentData";
import type { AppState, ComponentsPayload, RouteKey } from "@shared/types/appState";

const buildState = (
  route: RouteKey,
  components: ComponentsPayload
): AppState => ({
  route,
  components,
});

export const buildHomeState = (): AppState =>
  buildState("home", fetchHomeProps());

export const buildGreetingState = (name?: string): AppState =>
  buildState("greeting", fetchGreetingCardProps(name));

export const buildCalloutState = (): AppState =>
  buildState("callout", fetchCalloutBannerProps());

export const buildNotFoundState = (): AppState =>
  buildState("not-found", {
    greetingCard: undefined,
    calloutBanner: undefined,
  });
