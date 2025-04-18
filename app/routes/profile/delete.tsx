import { redirect } from 'react-router'
import { eq } from 'drizzle-orm'
import { logto } from '~/auth.server'

import { database } from '~/database/context'
import { guestsTable } from '~/database/schema'
import type { Route } from './+types/delete'

export async function action({ request }: Route.ActionArgs) {
  const context = await logto.getContext({ getAccessToken: false })(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  const form = await request.formData()
  const id = form.get('id') as string

  const db = database()
  await db.delete(guestsTable).where(eq(guestsTable.id, Number(id)))

  return redirect('/profile')
}
