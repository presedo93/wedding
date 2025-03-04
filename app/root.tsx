import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type MetaFunction,
} from 'react-router'

import type { Route } from './+types/root'
import stylesheet from './app.css?url'
import { Button } from './components'
import { House } from 'lucide-react'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg' },
  { rel: 'stylesheet', href: stylesheet },
]

export const meta: MetaFunction = () => {
  return [{ name: 'theme-color', content: '#64748b' }] // 🌑 Azul oscuro (ajústalo según tu diseño)
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#e2e8f0" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = ':('
  let details = 'Se ha producido un problema en la página'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'Esta página no existe'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="mx-auto h-screen bg-blue-800 p-16 text-white">
      <h1 className="mb-4 text-6xl">{message}</h1>
      <p>{details}</p>

      <Link className="mt-8 flex w-full justify-center" to={'/'}>
        <Button className="w-10/12 min-w-min">
          <House />
          Página principal
        </Button>
      </Link>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
