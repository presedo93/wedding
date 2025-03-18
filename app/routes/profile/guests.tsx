import { Link, redirect } from 'react-router'
import { eq } from 'drizzle-orm'
import { Reorder } from 'motion/react'
import { useState } from 'react'

import { GuestCardMotion } from '~/components'
import { Button } from '~/components/ui'
import { logto } from '~/auth.server'

import type { Route } from './+types/guests'
import { database } from '~/database/context'
import { type Guest, guestsTable } from '~/database/schema'

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  const db = database()
  const userId = context.claims!.sub ?? ''

  const guests = await db.query.guestsTable.findMany({
    where: eq(guestsTable.userId, userId),
  })

  return { guests }
}

export default function GuestsInfo({ loaderData }: Route.ComponentProps) {
  const { guests } = loaderData
  const hasGuests = guests.length > 0

  return (
    <>
      <h3 className="font-playwrite mt-6 text-xl font-light underline decoration-1 underline-offset-4">
        Miembros
      </h3>
      <div className="my-2 flex flex-col items-center justify-center">
        {hasGuests ? <GuestsList guests={guests} /> : <NoGuests />}
      </div>
      <Link className="flex w-full justify-center" to={'/profile/new-guest'}>
        <Button className="w-2/3 min-w-min md:w-1/3">Nuevo miembro</Button>
      </Link>
    </>
  )
}

const GuestsList = ({ guests }: { guests: Guest[] }) => {
  const [items, setItems] = useState(guests)

  return (
    <div className="w-full">
      <Reorder.Group axis="y" values={items} onReorder={setItems}>
        {items.map((g) => (
          <GuestCardMotion guest={g} key={g.id} />
        ))}
      </Reorder.Group>
      <p className="text-center text-xs font-medium text-slate-500">
        <span className="font-semibold">P.D:</span> Recuerda estar también en la
        lista!
      </p>
    </div>
  )
}

const NoGuests = () => (
  <div className="my-6 text-center text-sm">
    <p>No has añadido ningun acompañante aún!</p>
    <p className="text-slate-500">(Recuerda añadirte a ti también)</p>
  </div>
)
