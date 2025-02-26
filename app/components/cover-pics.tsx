import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface Props {
  images: string[]
}

const TIME = 4
const WIDTH = 235

export const CoverPics = ({ images }: Props) => {
  const mid = Math.floor(images.length / 2)
  const [pos, setPos] = useState(mid)

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((pos + 1) % images.length)
    }, TIME * 1000)

    return () => clearInterval(interval)
  }, [pos, images.length])

  return (
    <motion.div
      initial={{ opacity: 0, translateY: -20 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 2 }}
      viewport={{ once: true }}
      className="flex h-96 w-11/12 max-w-96 items-center overflow-hidden rounded-md bg-slate-300"
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="flex size-full w-fit flex-row items-center justify-center"
          animate={{ translateX: `${-(pos - mid) * WIDTH}px` }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          {images.map((src, idx) => (
            <motion.img
              key={src}
              src={src}
              initial={{ scale: idx === pos ? 0.8 : 1 }}
              animate={{ scale: idx === pos ? 1 : 0.8 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-5/6 rounded-lg object-cover"
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
