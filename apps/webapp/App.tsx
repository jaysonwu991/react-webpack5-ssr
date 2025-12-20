import type { RouteComponentData } from '@shared';
import GreetingComponent from './components/Greeting/GreetingComponent';
import ContentComponent from './components/Content/ContentComponent';

/**
 * Root App component
 * Renders components based on route configuration
 */
const App = ({ Greeting: greetingProps, Content: contentProps }: RouteComponentData) => (
  <>
    {greetingProps && <GreetingComponent {...greetingProps} />}
    {contentProps && <ContentComponent {...contentProps} />}
  </>
);

export default App;
