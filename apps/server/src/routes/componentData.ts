import type {
  CalloutBannerData,
  GreetingCardData,
} from "@shared/types/appData";
import type { ComponentsPayload } from "@shared/types/appState";
export type { ComponentsPayload };

const DEFAULT_NAME = "Guest";

export const fetchGreetingCardProps = (
  name: string | undefined
): ComponentsPayload => ({
  greetingCard: buildGreetingCard(name ?? DEFAULT_NAME),
});

export const fetchCalloutBannerProps = (): ComponentsPayload => ({
  calloutBanner: buildCalloutBanner(),
});

export const fetchHomeProps = (): ComponentsPayload => ({
  ...fetchGreetingCardProps("Jayson"),
  ...fetchCalloutBannerProps(),
});

const buildGreetingCard = (name: string): GreetingCardData => ({ name });

const buildCalloutBanner = (): CalloutBannerData => ({});
