import { logto } from '~/auth.server'
import { Link, redirect } from 'react-router'
import { database } from '~/database/context'
import { eq, sql } from 'drizzle-orm'
import {
  guestsTable,
  usersTable,
  type Guest,
  type User,
} from '~/database/schema'
import type { Route } from './+types/home'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  GuestCard,
} from '~/components'
import { User as UserIcon } from 'lucide-react'

type UserWithGuests = Pick<
  User,
  'id' | 'name' | 'email' | 'pictureUrl' | 'scope'
> & {
  guests: Guest[]
}

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

  return { users }
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-slate-200 px-8 py-4">
      <div className="flex w-full max-w-(--breakpoint-sm) flex-col items-center">
        <h1 className="font-playwrite mt-4 mb-2 text-2xl font-light underline decoration-1 underline-offset-4">
          Admin
        </h1>
        <Stats users={users} />
        <div className="w-full">
          {users.map((user) => (
            <div
              key={user.id}
              className="my-2 flex w-full flex-col items-center justify-between rounded-lg border border-slate-400 p-4 shadow-lg"
            >
              <div className="flex w-full flex-row items-center gap-x-2">
                <Avatar className="size-8">
                  <AvatarImage src={user.pictureUrl!} alt="profile" />
                  <AvatarFallback>L&R</AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-col">
                  <span className="w-9/10 truncate text-lg font-semibold">
                    {user.name}
                  </span>
                  {user.email && (
                    <span className="truncate text-xs font-medium">
                      ({user.email})
                    </span>
                  )}
                </div>
              </div>
              {user?.guests?.map((g) => (
                <div key={g.id} className="w-full px-2">
                  <GuestCard guest={g} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <Link className="mt-4 flex w-full justify-center" to={'/profile'}>
          <Button className="w-2/3 min-w-min md:w-1/3">
            <UserIcon />
            Mi perfil
          </Button>
        </Link>
      </div>
    </div>
  )
}

const Stats = ({ users }: { users: UserWithGuests[] }) => {
  const guests = users.reduce((acc, user) => acc + user.guests.length, 0)

  return (
    <div className="w-full rounded-lg border border-slate-400 p-4 shadow-lg">
      <span>Numero de usuarios registrados: {users.length} </span>
      <span>Numero de invitados anotados: {guests} </span>
    </div>
  )
}
