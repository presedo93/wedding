import './tailwind.css'

import { NextUIProvider } from '@nextui-org/react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'

import { NavBar } from '~/components'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body className="p-safe bg-gray-100">
        <NextUIProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100">
      <NavBar />
      <Outlet />
    </div>
  )
}
