import type { ReactNode } from "react";

import type { AppState } from "@shared/types/appState";
import CalloutBanner from "@webapp/components/CalloutBanner/CalloutBanner";
import GreetingCard from "@webapp/components/GreetingCard/GreetingCard";

import RootApp from "./RootApp";

export const renderApp = (state: AppState) => (
  <RootApp activeRoute={state.route}>{renderRouteContent(state)}</RootApp>
);

const renderRouteContent = (state: AppState): ReactNode => {
  const { route, components } = state;

  switch (route) {
    case "home":
      return (
        <div className="page-grid">
          {components.greetingCard ? (
            <GreetingCard name={components.greetingCard.name} />
          ) : null}
          {components.calloutBanner ? <CalloutBanner /> : null}
        </div>
      );
    case "greeting":
      return components.greetingCard ? (
        <div className="page-grid">
          <GreetingCard name={components.greetingCard.name} />
        </div>
      ) : null;
    case "callout":
      return components.calloutBanner ? (
        <div className="page-grid">
          <CalloutBanner />
        </div>
      ) : null;
    case "not-found":
      return (
        <section className="not-found">
          <p className="not-found__eyebrow">Route missing</p>
          <h2 className="not-found__title">404 - Not found</h2>
          <p className="not-found__copy">
            The page you are looking for does not exist. Use the navigation to
            find an available route.
          </p>
          <div className="not-found__actions">
            <a className="pill-link pill-link--secondary" href="/">
              Go home
            </a>
            <a className="pill-link" href="/hello/Visitor">
              Greeting only
            </a>
          </div>
        </section>
      );
    default:
      return null;
  }
};
