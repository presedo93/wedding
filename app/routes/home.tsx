import { CoverPics, EventTimeline, FullLogo, SecButtons } from '~/components'
import type { Route } from './+types/home'
import { logto } from '~/auth.server'
import { CountDown } from '~/components/count-down'
import { getSignedImageUrl } from '~/lib/s3.server'

export function meta() {
  return [
    { title: 'Laura & Rene' },
    { name: 'description', content: 'Our wedding!' },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({ getAccessToken: false })(request)

  const coverPaths = Array.from({ length: 11 }, (_, i) => `public/${i}.jpg`)
  const covers = await Promise.all(coverPaths.map(getSignedImageUrl))

  const frontPaths = ['public/boliches.jpg', 'public/latosca.jpg']
  const fronts = await Promise.all(frontPaths.map(getSignedImageUrl))

  const logo = await getSignedImageUrl('public/logo.png')
  return { auth: context.isAuthenticated, covers, fronts, logo }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { auth, covers, fronts, logo } = loaderData

  return (
    <div className="flex flex-col items-center bg-slate-200">
      <div className="h-8 sm:h-12" />
      <SmallCover images={covers} logo={logo} />
      <MediumCover images={covers} logo={logo} />
      <div className="h-8 sm:h-16" />
      <EventTimeline church={fronts[0]} event={fronts[1]} />
      <div className="h-4" />
      <SecButtons isAuth={auth} />
      <div className="h-12" />
    </div>
  )
}

const SmallCover = ({ images, logo }: { images: string[]; logo: string }) => (
  <div className="block px-4 sm:hidden">
    <div className="flex flex-col items-center justify-between">
      <FullLogo image={logo} />
      <div className="h-8" />
      <CoverPics images={images} />
      <div className="h-8" />
      <CountDown />
    </div>
  </div>
)

const MediumCover = ({ images, logo }: { images: string[]; logo: string }) => (
  <div className="hidden w-full max-w-(--breakpoint-lg) px-4 sm:block">
    <div className="flex flex-row items-center justify-around">
      <CoverPics images={images} />
      <div className="flex w-2/5 flex-col items-center justify-between">
        <FullLogo image={logo} />
        <div className="h-8" />
        <CountDown />
      </div>
    </div>
  </div>
)
