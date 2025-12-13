import type { Request } from "express";

import { createComponentData, type ComponentDataConfig } from "./componentData";
import type { AppState, ComponentsPayload, RouteKey } from "@shared/types/appState";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type TemplateTransform = (
  template: string,
  req: Request
) => Promise<string> | string;

type GreetingCardComponent = {
  key: "greetingCard";
  name: string;
  getProps: (req: Request) => NonNullable<ComponentsPayload["greetingCard"]>;
};

type CalloutBannerComponent = {
  key: "calloutBanner";
  name: string;
  getProps: (req: Request) => NonNullable<ComponentsPayload["calloutBanner"]>;
};

export type RouteComponentConfig =
  | GreetingCardComponent
  | CalloutBannerComponent;

type RouteContentConfig = {
  path: string;
  route: RouteKey;
  components: RouteComponentConfig[];
  templatePath?: string;
  templateTransform?: TemplateTransform;
  method?: HttpMethod;
};

export type RouteDefinition = RouteContentConfig & {
  buildState: (req: Request) => AppState;
};

export type RouterConfig = {
  routes: RouteDefinition[];
  notFound: () => AppState;
  componentsConfig: ComponentDataConfig;
};

const componentsConfig: ComponentDataConfig = {
  greetingCard: {
    defaultName: process.env.GREETING_DEFAULT_NAME ?? "Guest",
    homeName: process.env.GREETING_HOME_NAME ?? "Jayson",
  },
  calloutBanner: {},
};

const componentLoaders = createComponentData(componentsConfig);

const titleTagRegex = /<title>.*?<\/title>/i;

const setTitle = (getTitle: (req: Request) => string): TemplateTransform => (
  template,
  req
) => {
  if (titleTagRegex.test(template)) {
    return template.replace(
      titleTagRegex,
      `<title>${getTitle(req)}</title>`
    );
  }

  return `${template}<title>${getTitle(req)}</title>`;
};

const appendHeadContent = (content: string): TemplateTransform => (
  template,
  _req
) => {
  if (template.includes("</head>")) {
    return template.replace("</head>", `${content}</head>`);
  }

  return `${template}${content}`;
};

const combineTransforms =
  (...transforms: TemplateTransform[]): TemplateTransform =>
  async (template, req) => {
    let current = template;
    for (const transform of transforms) {
      current = await transform(current, req);
    }
    return current;
  };

const sharedComponentConfigs = {
  greetingCard:
    (resolveName: (req: Request) => string | undefined): GreetingCardComponent =>
      ({
        key: "greetingCard",
        name: "GREETING_CARD",
        getProps: (req) =>
          componentLoaders.fetchGreetingCardProps(resolveName(req))
            .greetingCard!,
      }),
  calloutBanner: {
    key: "calloutBanner",
    name: "CALLOUT_BANNER",
    getProps: () =>
      componentLoaders.fetchCalloutBannerProps().calloutBanner!,
  } satisfies CalloutBannerComponent,
};

const configuredRoutes: RouteContentConfig[] = [
  {
    path: "/",
    route: "home",
    components: [
      sharedComponentConfigs.greetingCard(
        () => componentsConfig.greetingCard.homeName
      ),
      sharedComponentConfigs.calloutBanner,
    ],
    templatePath: "apps/server/templates/home-page.html",
    templateTransform: combineTransforms(
      setTitle(() => "Home | React Vite SSR"),
      appendHeadContent(
        '<meta name="description" content="Server-rendered home route with greeting and callout components.">'
      )
    ),
  },
  {
    path: "/hello",
    route: "greeting",
    components: [
      sharedComponentConfigs.greetingCard(
        () => componentsConfig.greetingCard.defaultName
      ),
    ],
    templatePath: "apps/server/templates/greeting-page.html",
    templateTransform: setTitle(() => "Greeting | React Vite SSR"),
  },
  {
    path: "/hello/:name",
    route: "greeting",
    components: [
      sharedComponentConfigs.greetingCard(
        (req) => req.params.name ?? componentsConfig.greetingCard.defaultName
      ),
    ],
    templatePath: "apps/server/templates/greeting-page.html",
    templateTransform: setTitle(
      (req) =>
        `${req.params.name ?? componentsConfig.greetingCard.defaultName} says hello | React Vite SSR`
    ),
  },
  {
    path: "/callout",
    route: "callout",
    components: [sharedComponentConfigs.calloutBanner],
    templatePath: "apps/server/templates/callout-landing.html",
    templateTransform: combineTransforms(
      setTitle(() => "Callout | React Vite SSR"),
      appendHeadContent(
        '<meta name="description" content="Callout-only page with a custom template from the server.">'
      )
    ),
  },
];

const emptyComponents = (): ComponentsPayload => ({
  greetingCard: undefined,
  calloutBanner: undefined,
});

const buildStateFromConfig = (
  routeConfig: RouteContentConfig,
  req: Request
): AppState => {
  const components = emptyComponents();

  routeConfig.components.forEach((component) => {
    switch (component.key) {
      case "greetingCard":
        components.greetingCard = component.getProps(req);
        break;
      case "calloutBanner":
        components.calloutBanner = component.getProps(req);
        break;
    }
  });

  return {
    route: routeConfig.route,
    components,
  };
};

export const routerConfig: RouterConfig = {
  routes: configuredRoutes.map((routeConfig) => ({
    ...routeConfig,
    buildState: (req) => buildStateFromConfig(routeConfig, req),
  })),
  notFound: () => ({
    route: "not-found",
    components: emptyComponents(),
  }),
  componentsConfig,
};
