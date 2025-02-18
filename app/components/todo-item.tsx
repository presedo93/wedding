import { useSubmit } from 'react-router'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Checkbox } from '~/components/ui/checkbox'
import { type Task } from '~/database/schema'

type UserTasks = Exclude<
  keyof Task,
  'id' | 'updatedAt' | 'createdAt' | 'deletedAt' | 'userId'
>

interface Props {
  name: UserTasks
  done: boolean
}

const TEXTS: { [key in UserTasks]: string } = {
  profile: 'Completa tu perfil.',
  guests: 'Añade a tus acompañantes.',
  songs: 'Elige tus canciones favoritas.',
  messages: 'Deja algún mensaje.',
  photos: 'Sube tus fotos del día!',
}

export function TodoItem({ name, done }: Props) {
  const submit = useSubmit()
  const [checked, setChecked] = useState(done)

  const handleClick = () => {
    submit(
      { [name]: !checked },
      { action: '/profile/edit-tasks', method: 'post' },
    )
    setChecked(!checked)
  }

  return (
    <div className="flex flex-row items-center gap-2 font-normal">
      <Checkbox
        className="border-slate-700 data-[state=checked]:bg-slate-950"
        checked={checked}
        onClick={handleClick}
      />
      <div className="relative">
        <span>{TEXTS[name]}</span>
        <motion.div
          className="absolute top-1/2 left-0 h-px rounded-xl bg-black"
          initial={{ width: checked ? 0 : 1 }}
          animate={{ width: checked ? '100%' : '0%' }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
