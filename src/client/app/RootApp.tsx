import CalloutBanner from "../components/CalloutBanner/CalloutBanner";
import GreetingCard from "../components/GreetingCard/GreetingCard";
import "./RootApp.scss";

type RootAppProps = {
  name: string;
};

const RootApp = ({ name }: RootAppProps) => (
  <main className="app-shell">
    <GreetingCard name={name} />
    <CalloutBanner />
  </main>
);

export default RootApp;
