import path from 'path';
import fs from 'fs';
import express, { Request, Response } from 'express';
import compression from 'compression';
import Handlebars from 'handlebars';

import { getRouteConfig, RouteConfig } from './routes/routeConfig';
import { renderAppToString } from './renderer';

const app = express();
const PORT = process.env.PORT || 3000;

// Gzip compression
app.use(compression());

// Static files
app.use(express.static(path.join(__dirname, '../')));

/**
 * Render template with context data
 */
function renderTemplate(templatePath: string, context: any): string {
  const fullPath = path.join(__dirname, 'templates', templatePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Template not found: ${fullPath}, using default template`);
    return renderDefaultTemplate(context);
  }

  const templateSource = fs.readFileSync(fullPath, 'utf-8');
  const template = Handlebars.compile(templateSource);

  return template(context);
}

/**
 * Default fallback template
 */
function renderDefaultTemplate(context: any): string {
  const defaultTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{meta.title}}</title>
  <meta name="description" content="{{meta.description}}">
  {{{styleTags}}}
</head>
<body>
  <div id="root">{{{appHtml}}}</div>
  <script>window.__APP_STATE__ = {{{appState}}};</script>
  {{{scriptTags}}}
</body>
</html>
  `.trim();

  const template = Handlebars.compile(defaultTemplate);
  return template(context);
}

/**
 * Main route handler with Falcon-like routing
 */
app.get(/^\/.*/, (req: Request, res: Response) => {
  try {
    // Find matching route config
    const routeConfig: RouteConfig | null = getRouteConfig(req);

    if (!routeConfig) {
      // Default 404 handling
      res.status(404).send('Page not found');
      return;
    }

    // Build application state from route config
    const appState = routeConfig.buildState(req);

    // Render React components to HTML string
    const { html: appHtml, styleTags, scriptTags } = renderAppToString(appState);

    // Serialize app state for client hydration
    const serializedState = JSON.stringify(appState)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/\//g, '\\u002f');

    // Prepare template context
    const templateContext = {
      meta: appState.meta || {},
      appHtml,
      appState: serializedState,
      styleTags,
      scriptTags,
    };

    // Render template
    let finalHtml: string;
    if (routeConfig.template) {
      finalHtml = renderTemplate(routeConfig.template, templateContext);
    } else {
      finalHtml = renderDefaultTemplate(templateContext);
    }

    // Apply HTML transformations if defined
    if (routeConfig.transformHtml) {
      finalHtml = routeConfig.transformHtml(finalHtml, appState);
    }

    res.send(finalHtml);
  } catch (err) {
    console.error('Error in server-side rendering:', err);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 Mode: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
