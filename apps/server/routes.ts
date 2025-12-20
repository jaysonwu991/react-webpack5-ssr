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
import { AppState } from '@shared';

export interface RouteConfig {
  /** Route path pattern (Express format) */
  path: string;
  /** Function to build component data from request */
  buildState: (req: Request) => AppState;
  /** HTTP method (defaults to 'get') */
  method?: 'get' | 'post' | 'put' | 'delete';
  /** HTML template path (relative to templates/) */
  templatePath?: string;
  /** Transform final HTML (for SEO, meta injection, etc.) */
  templateTransform?: (html: string, req: Request) => string | Promise<string>;
}

export type TemplateTransform = (html: string, req: Request) => string | Promise<string>;

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
const routes: RouteConfig[] = [
  {
    path: '/',
    buildState: buildHomePageState,
    templatePath: 'home-page.html',
  },
  {
    path: '/hello',
    buildState: buildGreetingPageState,
    templatePath: 'greeting-page.html',
  },
  {
    path: '/hello/:name',
    buildState: buildGreetingPageState,
    templatePath: 'greeting-page.html',
  },
  {
    path: '/content',
    buildState: buildContentPageState,
    templatePath: 'content-page.html',
  },
];

/**
 * Build 404 not found state
 */
function notFound(): AppState {
  return {
    route: 'not-found',
    components: {
      Content: {
        message: '404 - Page Not Found',
      },
    },
    meta: {
      title: '404 Not Found',
      description: 'Page not found',
    },
  };
}

export const routerConfig = {
  routes,
  notFound,
};
