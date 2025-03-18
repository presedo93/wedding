import { logto } from '~/auth.server'
import { redirect } from 'react-router'
import { database } from '~/database/context'
import { eq, sql } from 'drizzle-orm'
import { guestsTable, usersTable, type Guest } from '~/database/schema'
import type { Route } from './+types/home'

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  const userId = context.claims?.sub ?? ''
  const db = database()

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  })

  if (!user?.scope.includes('admin')) {
    return redirect('/')
  }

  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      pictureUrl: usersTable.pictureUrl,
      scope: usersTable.scope,
      guests: sql<
        Guest[]
      >`COALESCE(json_agg(guests.*) FILTER (WHERE guests.id IS NOT NULL), '[]')`.as(
        'guests',
      ),
    })
    .from(usersTable)
    .leftJoin(guestsTable, eq(usersTable.id, guestsTable.userId))
    .groupBy(usersTable.id)

  const myself = users.find((u) => u.id === 'nyc1456y8iik')
  console.log(myself)

  return { users }
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData

  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-slate-200 px-8 py-4">
      <h1 className="font-playwrite mt-4 text-2xl font-light underline decoration-1 underline-offset-4">
        Admin
      </h1>
      <div>
        {users.map((user) => (
          <div
            key={user.id}
            className="my-2 flex w-full items-center justify-between rounded-lg bg-slate-300 p-4"
          >
            {user.name}
            <div>
              {user?.guests?.map((guest) => (
                <div key={guest.id}>{guest.name}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
