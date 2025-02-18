import { logto } from '~/auth.server'
import type { Route } from './+types/handle-message'
import { redirect } from 'react-router'
import { database } from '~/database/context'
import { messagesTable, type MessageInsert } from '~/database/schema'
import { eq } from 'drizzle-orm'

export async function action({ request }: Route.ActionArgs) {
  const context = await logto.getContext({})(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  const userId = context.claims?.sub
  const db = database()

  if (request.method === 'POST') {
    const form = await request.formData()
    const text = form.get('text') as string

    const values: MessageInsert = { text, userId }
    await db.insert(messagesTable).values(values)

    return redirect('/chat')
  } else if (request.method === 'DELETE') {
    const form = await request.formData()

    const id = Number(form.get('id'))
    await db.delete(messagesTable).where(eq(messagesTable.id, id))

    return redirect('/chat')
  }

  return Response.json({ message: 'Not handled message' }, { status: 404 })
}
