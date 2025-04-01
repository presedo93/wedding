import { redirect } from 'react-router'
import type { Route } from './+types/best-man'
import { getSignedImageUrl } from '~/lib/s3.server'
import { Button, CoverPics } from '~/components'
import { useRef, useState } from 'react'
import { Projector } from 'lucide-react'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (id !== 'ramirez') {
    return redirect('/')
  }

  const paths = Array.from(
    { length: 3 },
    (_, i) => `pictures/best-man/ramirez_${i}.jpg`,
  )

  const images = await Promise.all(paths.map(getSignedImageUrl))
  const video = await getSignedImageUrl('pictures/best-man/ramirez_v.mp4')

  return { images, video }
}

export default function BestMan({ loaderData }: Route.ComponentProps) {
  const { images, video } = loaderData

  const videoRef = useRef<HTMLVideoElement>(null)
  const [shadow, setShadow] = useState(true)

  const handleClick = () => {
    setShadow(false)
    videoRef.current?.play()
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-slate-200 px-8 py-4">
      <h1 className="font-playwrite mt-4 text-xl font-light underline decoration-1 underline-offset-4">
        ...<span className="font-semibold">testigo</span> de nuestra boda?
      </h1>
      <div className="my-4">
        <CoverPics images={images} />
      </div>
      <p className="font-playwrite my-4 text-lg font-light">
        Y hay una cosa más...
      </p>
      <div className="relative flex w-full max-w-md flex-col items-center justify-center">
        {shadow && (
          <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-lg backdrop-blur-3xl">
            <Button
              className="px-8 py-4"
              variant={'secondary'}
              onClick={handleClick}
            >
              <Projector className="size-12" />
              <span className="font-playwrite my-4 px-2 py-4 text-lg font-light">
                Pulsa para verlo
              </span>
            </Button>
          </div>
        )}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} controls className="rounded-lg">
          <source src={video} type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
