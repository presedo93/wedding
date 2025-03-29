import { redirect } from 'react-router'
import type { Route } from './+types/best-man'

// http://localhost:3000/best-man?id=ramirez
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (id !== 'ramirez') {
    return redirect('/')
  }
}

export default function BestMan() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-slate-200 px-8 py-4">
      <h1 className="font-playwrite mt-4 text-2xl font-light underline decoration-1 underline-offset-4">
        Padrino de boda?
      </h1>
    </div>
  )
}
