import { Image } from '@nextui-org/react'

export const CoverPicture = () => (
  <div className="absolute left-0 top-0 z-0 object-cover">
    <Image
      className="h-auto w-full"
      alt="Cover Picture"
      src="http://localhost:8090/api/files/8b5bfeqs5ugllg7/tf79p3jgmvrdvbu/cover_7o3pog2n7h.jpg"
    />
  </div>
)
