import { Form } from 'react-router'
import { Bus, GripVertical, Salad, Trash2, WheatOff } from 'lucide-react'
import { Reorder, useMotionValue } from 'motion/react'
import { type Guest } from '~/database/schema'

interface Props {
  guest: Guest
}

export function GuestCard({ guest }: Props) {
  const y = useMotionValue(0)

  return (
    <Reorder.Item value={guest} id={guest.id.toString()} style={{ y }}>
      <div className="my-2 flex w-full flex-row gap-1 rounded-md bg-slate-300 py-1 shadow-sm shadow-slate-400">
        <div className="flex w-1/12 items-center justify-center">
          <GripVertical className="size-4 text-slate-500" />
        </div>
        <div className="flex w-9/12 flex-col gap-1">
          <div className="flex flex-row items-baseline gap-2">
            <h2 className="text-xl font-normal">{guest.name}</h2>
            {guest.phone && (
              <p className="flex flex-row items-center gap-1 text-sm text-slate-700 italic">
                ({guest.phone})
              </p>
            )}
          </div>
          {guest.allergies?.length > 0 && (
            <p className="flex flex-row items-center gap-2 text-sm text-slate-700 italic">
              <WheatOff className="size-4" />
              {guest.allergies.join(', ')}
            </p>
          )}
          <div className="flex flex-row justify-between gap-2">
            {guest.needsTransport && (
              <p className="flex flex-row items-center gap-2 text-sm text-slate-700 italic">
                <Bus className="size-4" />
                Autobús
              </p>
            )}
            {guest.isVegetarian && (
              <p className="flex flex-row items-center gap-2 text-sm text-slate-700 italic">
                <Salad className="size-4" />
                Vegetariano
              </p>
            )}
          </div>
        </div>
        <div className="flex w-2/12 items-center justify-center">
          <DeleteGuest id={guest.id} />
        </div>
      </div>
    </Reorder.Item>
  )
}

function DeleteGuest({ id }: { id: number }) {
  return (
    <Form action={`/profile/delete/${id}`} method="delete">
      <button type="submit">
        <Trash2 className="size-5 stroke-red-700 stroke-[1.5px]" />
      </button>
    </Form>
  )
}
