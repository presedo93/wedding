import { Image } from '@nextui-org/react'
import { motion } from 'framer-motion'

export const CoverPicture = () => (
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
)
