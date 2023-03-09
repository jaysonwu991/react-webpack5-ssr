import React from "react";
import loadable from "@loadable/component";

const App1 = loadable(
  () => import(/* webpackChunkName: "App1" */ "./components/App1/App")
);
const App2 = loadable(
  () => import(/* webpackChunkName: "App2" */ "./components/App2/App")
);

const App = ({ name }: { name: string }) => (
  <>
    <App1 name={name} />
    <App2 />
  </>
);

export default App;
