import CalloutBanner from "../components/CalloutBanner/CalloutBanner";
import GreetingCard from "../components/GreetingCard/GreetingCard";
import type { AppBootstrapData } from "@shared/types/appData";
import "./RootApp.scss";

type RootAppProps = AppBootstrapData["components"];

const RootApp = ({ greetingCard, calloutBanner }: RootAppProps) => (
  <main className="app-shell">
    {greetingCard ? <GreetingCard {...greetingCard} /> : null}
    {calloutBanner ? <CalloutBanner /> : null}
  </main>
);

export default RootApp;
