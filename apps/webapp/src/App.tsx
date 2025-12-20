import React from 'react';
import loadable from '@loadable/component';
import type { RouteComponentData } from '@react-ssr-falcon/shared';

// Lazy-loaded components with code splitting
const GreetingComponent = loadable(
  () => import(/* webpackChunkName: "GreetingComponent" */ './components/Greeting/GreetingComponent')
);
const ContentComponent = loadable(
  () => import(/* webpackChunkName: "ContentComponent" */ './components/Content/ContentComponent')
);

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
