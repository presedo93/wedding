import { Form } from 'react-router'
import { Bus, GripVertical, Salad, Trash2, WheatOff } from 'lucide-react'
import { Reorder, useMotionValue } from 'motion/react'
import { type Guest } from '~/database/schema'

interface Props {
  guest: Guest
}

export function GuestCardMotion({ guest }: Props) {
  const y = useMotionValue(0)

  return (
    <Reorder.Item value={guest} id={guest.id.toString()} style={{ y }}>
      <GuestCard guest={guest} isReorder canDelete />
    </Reorder.Item>
  )
}

export function GuestCard({
  guest,
  isReorder,
  canDelete,
}: {
  guest: Guest
  isReorder?: boolean
  canDelete?: boolean
}) {
  return (
    <div className="my-2 flex w-full flex-row gap-1 rounded-md bg-slate-300 py-1 shadow-sm shadow-slate-400">
      <div className="flex w-1/12 items-center justify-center">
        {isReorder && <GripVertical className="size-4 text-slate-500" />}
      </div>
      <div className="flex w-9/12 flex-col">
        <h2 className="truncate font-medium">{guest.name}</h2>
        {guest.phone && (
          <p className="flex flex-row items-center gap-1 text-xs font-medium text-slate-700">
            ({guest.phone})
          </p>
        )}
        {guest.allergies?.length > 0 && (
          <p className="mt-2 flex flex-row items-center gap-2 text-sm text-slate-700 italic">
            <WheatOff className="size-4" />
            {guest.allergies.join(', ')}
          </p>
        )}
        <div className="mt-2 flex flex-row justify-between gap-2">
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
        {canDelete && <DeleteGuest id={guest.id} />}
      </div>
    </div>
  )
}

function DeleteGuest({ id }: { id: number }) {
  return (
    <Form action={`/profile/delete-guest`} method="delete">
      <input type="hidden" name="id" value={id} />
      <button type="submit">
        <Trash2 className="size-5 stroke-red-700 stroke-[1.5px]" />
      </button>
    </Form>
  )
}
