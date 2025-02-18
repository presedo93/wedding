import fs from 'fs'
import { createCookieSessionStorage } from 'react-router'
import { makeLogtoRemix } from '@logto/remix'

let appSecret = process.env.LOGTO_APP_SECRET || ''

if (process.env.NODE_ENV === 'production') {
  const path = process.env.LOGTO_SECRET_FILE || '/run/secrets/logto-app'

  try {
    appSecret = fs.readFileSync(path, 'utf8').trim()
  } catch {
    throw new Error('Missing LOGTO_SECRET_FILE secret')
  }
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'logto-session',
    maxAge: 14 * 24 * 60 * 60,
    secrets: ['secr3tSession'], // TODO: in production, use a real secret
    secure: process.env.NODE_ENV === 'production',
  },
})

export const logto = makeLogtoRemix(
  {
    endpoint: process.env.LOGTO_ENDPOINT!,
    appId: process.env.LOGTO_APP_ID!,
    baseUrl: process.env.LOGTO_BASE_URL!,
    appSecret,
  },
  { sessionStorage },
)
