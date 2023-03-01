import React from "react";
import { hydrate, render } from "react-dom";
import loadable, { loadableReady } from "@loadable/component";

const App1 = loadable(() => import("./components/App1/App"));
const App2 = loadable(() => import("./components/App2/App"));

const renderApp = () => {
  const rootContent = document.getElementById("root");
  const renderMethod = module.hot ? render : hydrate;

  renderMethod(<><App1 /><App2 /></>, rootContent);
};

loadableReady(() => {
  renderApp();
});

if (module.hot) {
  module.hot.accept();
}
