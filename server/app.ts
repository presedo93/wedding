import { createRequestHandler } from '@react-router/express'
import { drizzle } from 'drizzle-orm/postgres-js'

import fs from 'fs'
import express from 'express'
import postgres from 'postgres'
import 'react-router'

import { DatabaseContext } from '~/database/context'
import * as schema from '~/database/schema'

export const app = express()

if (!process.env.DB_URL || !process.env.DB_PASS) {
  throw new Error('DB_URL and DB_PASS are required')
}

const client = postgres(process.env.DB_URL, {
  pass:
    process.env.NODE_ENV === 'production'
      ? fs.readFileSync(process.env.DB_PASS!, 'utf8').trim()
      : process.env.DB_PASS,
})
const db = drizzle(client, { schema, casing: 'snake_case' })

app.use((_, __, next) => DatabaseContext.run(db, next))
app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import('virtual:react-router/server-build'),
  }),
)
