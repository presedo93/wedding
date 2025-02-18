import { Button } from '~/components'
import type { Route } from './+types/home'
import { Link, redirect } from 'react-router'
import { logto } from '~/auth.server'
import { House } from 'lucide-react'

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request)

  if (!context.isAuthenticated) {
    return redirect('/auth/sign-in')
  }

  return {}
}

export default function Photo() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center bg-slate-200">
      <div className="flex w-full max-w-(--breakpoint-sm) flex-col px-8 py-4">
        <h1 className="font-playwrite mt-4 text-2xl font-light underline decoration-1 underline-offset-4">
          Fotos y vídeos
        </h1>
        <h3 className="font-playwrite mt-16 text-center text-xl font-extralight">
          Próximamente...
        </h3>
        <Buttons />
      </div>
    </div>
  )
}

const Buttons = () => (
  <div className="flex flex-col justify-around">
    <Link className="mt-16 flex w-full justify-center" to={'/'}>
      <Button className="w-2/3 min-w-min md:w-1/3">
        <House />
        Página principal
      </Button>
    </Link>
  </div>
)
