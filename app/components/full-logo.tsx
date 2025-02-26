import { motion } from 'motion/react'

interface Props {
  image: string
}

export const FullLogo = ({ image }: Props) => (
  <motion.div
    initial={{ opacity: 0, translateY: -20 }}
    whileInView={{ opacity: 1, translateY: 0 }}
    transition={{ duration: 2 }}
    viewport={{ once: true }}
    className="flex h-32 items-center justify-center rounded-full"
  >
    <motion.img src={image} className="h-5/6 rounded-lg object-cover" />
  </motion.div>
)
