import "./GreetingCard.scss";

type GreetingCardProps = {
  name?: string;
};

const GreetingCard = ({ name = "Guest" }: GreetingCardProps) => {
  return (
    <section className="greeting-card">
      <p className="greeting-card__headline">Hello {name}</p>
      <p className="greeting-card__body">
        This view is rendered on the server and hydrated on the client.
      </p>
      <button
        className="greeting-card__cta"
        type="button"
        onClick={() => console.log("Hello from the GreetingCard component!")}
      >
        Trigger Console Log
      </button>
    </section>
  );
};

export default GreetingCard;
