import { hydrateRoot } from "react-dom/client";

import RootApp from "./app/RootApp";
import type { AppBootstrapData } from "../shared/types/appData";

const appContainer = document.getElementById("root");
const fallbackData: AppBootstrapData = { appProps: { name: "" } };
const initialData: AppBootstrapData = window.INITIAL_DATA ?? fallbackData;

if (!appContainer) {
  throw new Error("Root container #root was not found in the document.");
}

hydrateRoot(appContainer, <RootApp {...initialData.appProps} />);
