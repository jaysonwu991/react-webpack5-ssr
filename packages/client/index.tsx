import React from "react";
import { hydrate, render } from "react-dom";
import { loadableReady } from "@loadable/component";

import App from "./App";

const renderApp = () => {
  const rootContent = document.getElementById("root");
  const renderMethod = module.hot ? render : hydrate;

  renderMethod(<App />, rootContent);
};

loadableReady(() => {
  renderApp();
});

if (module.hot) {
  module.hot.accept();
}
