import { Link, redirect } from 'react-router'
import { eq } from 'drizzle-orm'
import { useEffect, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  GuestCard,
} from '~/components'
import { logto } from '~/auth.server'

import type { Route } from './+types/guests'
import { database } from '~/database/context'
import { type Guest, guestsTable } from '~/database/schema'
import { Reorder } from 'motion/react'

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

  const allConfirmed = guests.every((g) => g.isComing !== null)
  return { guests, allConfirmed }
}

export default function GuestsInfo({ loaderData }: Route.ComponentProps) {
  const { guests, allConfirmed } = loaderData
  const hasGuests = guests.length > 0

  return (
    <>
      <h3 className="font-playwrite mt-6 text-xl font-light underline decoration-1 underline-offset-4">
        Miembros
      </h3>
      <div className="my-2 flex flex-col items-center justify-center">
        {hasGuests ? <GuestsList guests={guests} /> : <NoGuests />}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <Link
          className="flex w-2/3 justify-center md:w-1/3"
          to={'/profile/new-guest'}
        >
          <Button className="w-full min-w-min">Nuevo miembro</Button>
        </Link>
        <Link
          className="flex w-2/3 justify-center md:w-1/3"
          to={'/profile/confirm-guests'}
        >
          <Button className="w-full min-w-min bg-green-600">
            Confirmar asistencia
          </Button>
        </Link>
      </div>
      <ConfirmDialog showDialog={allConfirmed !== true} />
    </>
  )
}

const GuestsList = ({ guests }: { guests: Guest[] }) => {
  const [items, setItems] = useState(guests)

  useEffect(() => {
    setItems(guests)
  }, [guests])

  return (
    <>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="w-full"
      >
        {items.map((g) => (
          <Reorder.Item key={g.id} value={g}>
            <GuestCard guest={g} key={g.id} showDelete />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <p className="text-center text-xs font-medium text-slate-500">
        <span className="font-semibold">P.D:</span> Recuerda estar también en la
        lista!
      </p>
    </>
  )
}

const NoGuests = () => (
  <div className="my-6 text-center text-sm">
    <p>No has añadido ningun acompañante aún!</p>
    <p className="text-slate-500">(Recuerda añadirte a ti también)</p>
  </div>
)

const ConfirmDialog = ({ showDialog }: { showDialog: boolean }) => {
  const [open, setOpen] = useState(showDialog)

  useEffect(() => {
    setOpen(showDialog)
  }, [showDialog])

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-9/10 rounded-lg border-black bg-slate-400">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            ¡Aviso importante!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            <p>
              ¡Recuerda <span className="font-bold">registrarte</span> como
              miembro si aún no lo estás! Necesitamos saber si tu también tienes
              alguna alergia o si quieres ir en bus.
            </p>
            <p className="my-4">
              Y <span className="font-bold">confirma</span> tu asistencia y la
              de tus acompañantes al evento!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setOpen(false)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
