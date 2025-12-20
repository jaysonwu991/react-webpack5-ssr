import "./GreetingComponent.scss";
import type { GreetingProps } from '@shared';

const GreetingComponent = (props: GreetingProps) => {
  return (
    <div className="greeting-component">
      <h1 className="greeting-title">👋 Greeting Page</h1>
      <p className="greeting-text">Hello {props.name}! from Greeting Component</p>
      <button
        className="greeting-button"
        onClick={() => console.log("Hello World!")}
      >
        Click Me!
      </button>
    </div>
  );
};

export default GreetingComponent;
