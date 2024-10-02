import crypto from 'node:crypto'
import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import helmet from 'helmet'

installGlobals()

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV

const viteDevServer =
  NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      )

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
    : () => import('./build/server/index.js'),
  async getLoadContext(_, res) {
    return {
      cspNonce: res.locals.cspNonce,
    }
  },
})

const app = express()

/**
 * Good practices: Disable x-powered-by.
 * @see http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
 */
app.disable('x-powered-by')

app.use(compression())
app.use(morgan('tiny'))

/**
 * Content Security Policy.
 * Implementation based on github.com/epicweb-dev/epic-stack
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 */
app.use((_, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
  next()
})

app.use(
  helmet({
    contentSecurityPolicy: {
      referrerPolicy: { policy: 'same-origin' },
      crossOriginEmbedderPolicy: false,
      // ❗Important: Remove `reportOnly` to enforce CSP. (Development only).
      reportOnly: true,
      directives: {
        // Controls allowed endpoints for fetch, XHR, WebSockets, etc.
        'connect-src': [NODE_ENV === 'development' ? 'ws:' : null, "'self'"].filter(
          Boolean,
        ),
        // Defines which origins can serve fonts to your site.
        'font-src': ["'self'"],
        // Specifies origins allowed to be embedded as frames.
        'frame-src': ["'self'"],
        // Determines allowed sources for images.
        'img-src': ["'self'", 'data:'],
        // Sets restrictions on sources for <script> elements.
        'script-src': [
          "'strict-dynamic'",
          "'self'",
          (_, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
        // Controls allowed sources for inline JavaScript event handlers.
        'script-src-attr': [(_, res) => `'nonce-${res.locals.cspNonce}'`],
        // Enforces that requests are made over HTTPS.
        'upgrade-insecure-requests': null,
      },
    },
  }),
)

/**
 * Clean route paths. (No ending slashes, Better SEO)
 */
app.use((req, res, next) => {
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safePath = req.path.slice(0, -1).replace(/\/+/g, '/')
    res.redirect(301, safePath + query)
  } else {
    next()
  }
})

// Handle assets requests.
if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
  )
}
// Everything else (like favicon.ico) is cached for an hour.
// You may want to be more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }))

app.get(['/img/*', '/favicons/*'], (req, res) => {
  // If we've gone beyond express.static for these, it means something is missing.
  // In this case, we'll simply send a 404 and skip calling other middleware.
  return res.status(404).send('Not found')
})

// Handle SSR requests.
app.all('*', remixHandler)

app.listen(PORT, () =>
  console.log(`Express server listening at http://localhost:${PORT}`),
)
