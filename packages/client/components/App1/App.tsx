import "./App.scss";

type Props = {
  name?: string;
};

const App = (props: Props) => {
  return (
    <div className="App1">
      <span>Hello {props.name} from App 1</span>
      <br />
      <span onClick={() => console.log("Hello World!")}>Click Me!</span>
    </div>
  );
};

export default App;
