import { logto } from '~/auth.server'
import type { Route } from './+types/grant-access'
import { redirect } from 'react-router'
import { database, songsTable, type SongInsert } from '~/database'
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

    const id = form.get('id') as string
    const name = form.get('name') as string

    const values: SongInsert = {
      id,
      userId,
      name,
      pictureUrl: form.get('pictureUrl') as string,
      artistUrl: form.get('artistUrl') as string,
      spotifyUrl: form.get('spotifyUrl') as string,
      popularity: parseInt(form.get('popularity') as string),
      duration: parseInt(form.get('duration') as string),
      artist: form.get('artist') as string,
      album: form.get('album') as string,
    }

    await db.insert(songsTable).values(values).onConflictDoNothing()
    return redirect('/music')
  } else if (request.method === 'DELETE') {
    const form = await request.formData()

    const id = form.get('id') as string
    await db.delete(songsTable).where(eq(songsTable.id, id))
    return redirect('/music')
  }

  return Response.json({ message: 'Not handled song' }, { status: 404 })
}
