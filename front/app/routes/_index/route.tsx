import type { MetaFunction } from '@remix-run/node'

import { CoverPicture } from './cover-picture'

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
      <div className="h-[1000px]" />
    </div>
  )
}
