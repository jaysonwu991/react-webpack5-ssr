export type GreetingCardData = {
  name: string;
};

export type CalloutBannerData = Record<string, never>;

export type AppBootstrapData = {
  components: {
    greetingCard?: GreetingCardData;
    calloutBanner?: CalloutBannerData;
  };
};
