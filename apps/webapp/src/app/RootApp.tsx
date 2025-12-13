import type { ReactNode } from "react";

import type { RouteKey } from "@shared/types/appState";

import "./RootApp.scss";

type RootAppProps = {
  activeRoute: RouteKey;
  children: ReactNode;
};

const navLinks: Array<{ href: string; label: string; route: RouteKey }> = [
  { href: "/", label: "Home", route: "home" },
  { href: "/hello/Visitor", label: "Greeting only", route: "greeting" },
  { href: "/callout", label: "Callout only", route: "callout" },
];

const RootApp = ({ activeRoute, children }: RootAppProps) => (
  <main className="app-shell">
    <header className="app-shell__header">
      <p className="app-shell__eyebrow">Express SSR</p>
      <h1 className="app-shell__title">Route-driven component control</h1>
      <p className="app-shell__lede">
        Express handles each page and preloads the component props it needs, so
        the UI hydrates with the right data.
      </p>
      <nav className="app-shell__nav">
        {navLinks.map(({ href, label, route }) => (
          <a
            key={href}
            className={`pill-link${route === activeRoute ? " active" : ""}`}
            href={href}
            aria-current={route === activeRoute ? "page" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
    <section className="app-shell__content">
      {children}
    </section>
  </main>
);

export default RootApp;
