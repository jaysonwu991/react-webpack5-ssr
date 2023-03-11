import { hydrateRoot } from "react-dom/client";
import { loadableReady } from "@loadable/component";

import App from "./App";

const renderApp = () => {
  let initialData;
  if (typeof window !== undefined) {
    initialData = window.INITIAL_DATA;
  }
  const { appProps } = initialData;
  const container = document.getElementById("root");

  hydrateRoot(container!, <App {...appProps} />);
};

loadableReady(() => {
  renderApp();
});

// Have to add @types/webpack-env
if (module.hot) {
  module.hot.accept();
}
