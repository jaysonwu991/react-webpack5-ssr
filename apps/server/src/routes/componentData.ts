import type {
  CalloutBannerData,
  GreetingCardData,
} from "@shared/types/appData";
import type { ComponentsPayload } from "@shared/types/appState";
export type { ComponentsPayload };

export type ComponentDataConfig = {
  greetingCard: {
    defaultName: string;
    homeName: string;
  };
  calloutBanner?: Record<string, never>;
};

const defaultComponentConfig: ComponentDataConfig = {
  greetingCard: {
    defaultName: "Guest",
    homeName: "Jayson",
  },
  calloutBanner: {},
};

export const createComponentData = (
  config: ComponentDataConfig = defaultComponentConfig
) => {
  const buildGreetingCard = (name: string): GreetingCardData => ({ name });
  const buildCalloutBanner = (): CalloutBannerData => ({});

  const fetchGreetingCardProps = (
    name: string | undefined
  ): ComponentsPayload => ({
    greetingCard: buildGreetingCard(name ?? config.greetingCard.defaultName),
  });

  const fetchCalloutBannerProps = (): ComponentsPayload => ({
    calloutBanner: buildCalloutBanner(),
  });

  const fetchHomeProps = (): ComponentsPayload => ({
    ...fetchGreetingCardProps(config.greetingCard.homeName),
    ...fetchCalloutBannerProps(),
  });

  return {
    fetchGreetingCardProps,
    fetchCalloutBannerProps,
    fetchHomeProps,
  };
};

export type ComponentDataLoaders = ReturnType<typeof createComponentData>;

export const componentData = createComponentData();
