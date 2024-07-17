import type { MetaFunction } from '@remix-run/node'

import { CoverPicture } from '~/components'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export default function Index() {
  return (
    <div className="flex flex-col items-center">
      <CoverPicture />
      <h1>Home</h1>
    </div>
  )
}
