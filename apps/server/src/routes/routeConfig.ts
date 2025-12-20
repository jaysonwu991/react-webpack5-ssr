/**
 * Route Configuration System
 * Inspired by Falcon's pageTypeConfig architecture
 *
 * This centralizes route definitions with their:
 * - URL patterns
 * - Component data builders
 * - HTML templates
 * - SEO metadata
 */

import { Request } from 'express';
import { AppState } from '@react-ssr-falcon/shared';

export interface RouteConfig {
  /** Route path pattern (Express format) */
  path: string;
  /** Function to build component data from request */
  buildState: (req: Request) => AppState;
  /** HTML template path (relative to templates/) */
  template?: string;
  /** Transform final HTML (for SEO, meta injection, etc.) */
  transformHtml?: (html: string, state: AppState) => string;
}

/**
 * Build component data for home page
 * Shows both Greeting and Content components
 */
function buildHomePageState(_req: Request): AppState {
  return {
    route: 'home',
    components: {
      Greeting: {
        name: 'Welcome to SSR Demo',
      },
      Content: {
        message: 'This is a Falcon-inspired architecture',
      },
    },
    meta: {
      title: 'Home Page | React SSR Demo',
      description: 'Server-side rendered React application with Falcon-like architecture',
    },
  };
}

/**
 * Build component data for greeting page
 * Shows Greeting component with custom name from URL params
 */
function buildGreetingPageState(req: Request): AppState {
  const name = req.params.name || 'Visitor';

  return {
    route: 'greeting',
    components: {
      Greeting: {
        name: `Hello, ${name}!`,
      },
    },
    meta: {
      title: `Greeting ${name} | React SSR Demo`,
      description: `Personalized greeting page for ${name}`,
    },
  };
}

/**
 * Build component data for Content showcase page
 * Shows only Content component
 */
function buildContentPageState(_req: Request): AppState {
  return {
    route: 'content',
    components: {
      Content: {
        message: 'Standalone Content component demo',
      },
    },
    meta: {
      title: 'Content Demo | React SSR Demo',
      description: 'Demonstration of Content component with SSR',
    },
  };
}

/**
 * Centralized route configuration
 * Order matters - first match wins
 */
export const routeConfigs: RouteConfig[] = [
  {
    path: '/',
    buildState: buildHomePageState,
    template: 'home-page.html',
  },
  {
    path: '/hello',
    buildState: buildGreetingPageState,
    template: 'greeting-page.html',
  },
  {
    path: '/hello/:name',
    buildState: buildGreetingPageState,
    template: 'greeting-page.html',
  },
  {
    path: '/content',
    buildState: buildContentPageState,
    template: 'content-page.html',
  },
];

/**
 * Find matching route config for a request
 */
export function getRouteConfig(req: Request): RouteConfig | null {
  const path = req.path;

  for (const config of routeConfigs) {
    if (config.path === path) {
      return config;
    }

    // Handle parameterized routes
    if (config.path.includes(':')) {
      const pattern = config.path.replace(/:[^/]+/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      const match = path.match(regex);

      if (match) {
        // Extract param names from route path
        const paramNames = config.path.match(/:([^/]+)/g)?.map(p => p.substring(1)) || [];

        // Assign params to req.params
        paramNames.forEach((name, i) => {
          req.params[name] = match[i + 1];
        });

        return config;
      }
    }
  }

  return null;
}
