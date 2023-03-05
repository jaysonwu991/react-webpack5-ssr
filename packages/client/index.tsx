import React from "react";
import { hydrate, render } from "react-dom";
import loadable, { loadableReady } from "@loadable/component";

const App1 = loadable(
  () => import(/* webpackChunkName: "App1" */ "./components/App1/App")
);
const App2 = loadable(
  () => import(/* webpackChunkName: "App2" */ "./components/App2/App")
);

const renderApp = () => {
  let initialData;
  if (typeof window !== undefined) {
    initialData = window.INITIAL_DATA;
  }
  const { app1Props } = initialData;
  const app1Content = document.getElementById("App1");
  const app2Content = document.getElementById("App2");
  const renderMethod = module.hot ? render : hydrate;

  renderMethod(<App1 name={app1Props?.name} />, app1Content);
  renderMethod(<App2 />, app2Content);
};

loadableReady(() => {
  renderApp();
});

export default {
  App1,
  App2,
};

if (module.hot) {
  module.hot.accept();
}
