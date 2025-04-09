import { Link, redirect, useSubmit } from 'react-router'
import { eq } from 'drizzle-orm'
import { useEffect, useState } from 'react'

import { Button, GuestCard } from '~/components'
import { logto } from '~/auth.server'

import type { Route } from './+types/guests'
import { database } from '~/database/context'
import { type Guest, guestsTable } from '~/database/schema'
import { CircleX, Save } from 'lucide-react'
import { Reorder } from 'motion/react'

type States = Record<string | number, boolean>

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
  const submit = useSubmit()
  const { guests } = loaderData
  const [states, setStates] = useState<States>({})

  const handleSubmit = () => {
    const confirmations = JSON.stringify(states)
    submit({ confirmations }, { method: 'post' })
  }

  const onStateChange = (id: string | number, value: boolean) => {
    setStates((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <>
      <h3 className="font-playwrite mt-6 text-xl font-light underline decoration-1 underline-offset-4">
        Miembros
      </h3>
      <div className="my-2 flex flex-col items-center justify-center">
        <GuestsList guests={guests} onChange={onStateChange} />
      </div>
      <div className="flex flex-row justify-center space-x-3">
        <Link className="w-1/2" to={'/profile'}>
          <Button variant={'destructive'} className="w-full min-w-min">
            <CircleX />
            Cancelar
          </Button>
        </Link>
        <Button onClick={handleSubmit} className="w-1/2 min-w-min bg-green-600">
          <Save />
          Guardar
        </Button>
      </div>
    </>
  )
}

const GuestsList = ({
  guests,
  onChange,
}: {
  guests: Guest[]
  onChange?: (id: string | number, value: boolean) => void
}) => {
  const [items, setItems] = useState(guests)

  useEffect(() => {
    setItems(guests)
  }, [guests])

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className="w-full"
    >
      {items.map((g) => (
        <Reorder.Item key={g.id} value={g}>
          <GuestCard guest={g} key={g.id} showConfirm onChange={onChange} />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}

export const action = async ({ request }: Route.ActionArgs) => {
  const context = await logto.getContext({ getAccessToken: false })(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  if (request.method === 'POST') {
    const form = await request.formData()
    const confirmations: States = JSON.parse(
      form.get('confirmations') as string,
    )

    const db = database()
    for (const [id, status] of Object.entries(confirmations)) {
      await db
        .update(guestsTable)
        .set({ isComing: status })
        .where(eq(guestsTable.id, Number(id)))
    }
  }

  return redirect('/profile')
}
