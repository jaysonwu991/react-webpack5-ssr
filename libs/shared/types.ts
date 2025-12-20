/**
 * Shared Types Library
 * Used by both server and client for type safety
 */

/**
 * Component-specific prop types
 */
export interface GreetingProps {
  name: string;
}

export interface ContentProps {
  message?: string;
}

/**
 * Route component data structure
 * Defines which components should render and their props
 */
export interface RouteComponentData {
  Greeting?: GreetingProps;
  Content?: ContentProps;
}

/**
 * Application state passed from server to client
 * Serialized as window.__APP_STATE__
 */
export interface AppState {
  /** Current route identifier */
  route: string;
  /** Component data for this route */
  components: RouteComponentData;
  /** SEO metadata */
  meta?: {
    title?: string;
    description?: string;
  };
}
