import { Image } from '@nextui-org/react'
import { motion } from 'framer-motion'

import { Title } from '@/icons'

export const CoverPicture = () => (
  <>
    <Title className="absolute z-20 h-44 w-full stroke-black stroke-[0.1]" />
    <motion.div
      initial={{ opacity: 0, translateY: -100 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 2.5 }}
    >
      <Image
        className="h-auto w-full"
        alt="Cover Picture"
        src="/images/cover.jpg"
      />
    </motion.div>
  </>
)
