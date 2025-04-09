import { Form } from 'react-router'
import {
  Bus,
  Check,
  CircleX,
  GripVertical,
  Salad,
  Trash2,
  WheatOff,
} from 'lucide-react'
import { type Guest } from '~/database/schema'
import { useState } from 'react'

interface Props {
  guest: Guest
  showDelete?: boolean
  showConfirm?: boolean
  onChange?: (id: string | number, value: boolean) => void
}

const getBackgroundColor = (isComing: boolean | null) => {
  if (isComing === true) return 'bg-green-300'
  if (isComing === false) return 'bg-red-300'
  return 'bg-slate-300'
}

export function GuestCard({ guest, showDelete, showConfirm, onChange }: Props) {
  const [state, setState] = useState(guest.isComing)
  const bg = getBackgroundColor(state)

  const handleStateChange = (value: boolean) => {
    if (!onChange) return

    setState(value)
    onChange(guest.id, value)
  }

  const rightSide = () => {
    if (showDelete) {
      return (
        <div className="flex w-2/12 items-center justify-center">
          <DeleteGuest id={guest.id} />
        </div>
      )
    } else if (showConfirm) {
      return (
        <div className="flex w-4/12 items-center pr-2">
          <ConfirmGuest handleState={handleStateChange} />
        </div>
      )
    }

    return <div className="flex w-2/12 items-center pr-2" />
  }

  return (
    <div
      className={`my-2 flex w-full flex-row gap-1 rounded-md ${bg} py-1 shadow-sm shadow-slate-400`}
    >
      <div className="flex w-1/12 items-center justify-center">
        <GripVertical className="size-4 text-slate-600" />
      </div>
      <div className={`flex grow flex-col`}>
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
        <div className="mt-2 mb-1 flex flex-row justify-between gap-2">
          {guest.needsTransport && (
            <p className="flex flex-row items-center gap-2 truncate text-sm text-slate-700 italic">
              <Bus className="size-4" />
              Autobús
            </p>
          )}
          {guest.isVegetarian && (
            <p className="flex flex-row items-center gap-2 truncate text-sm text-slate-700 italic">
              <Salad className="size-4" />
              Vegetariano
            </p>
          )}
        </div>
      </div>
      {rightSide()}
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

function ConfirmGuest({
  handleState,
}: {
  handleState: (value: boolean) => void
}) {
  return (
    <div className="flex w-full flex-row justify-end gap-x-4">
      <button
        onClick={() => handleState(true)}
        className="rounded-lg bg-green-600 p-1"
      >
        <Check className="text-white" />
      </button>
      <button
        onClick={() => handleState(false)}
        className="rounded-lg bg-red-500 p-1"
      >
        <CircleX className="text-white" />
      </button>
    </div>
  )
}
