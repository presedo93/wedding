import { motion } from 'motion/react'
import { ChurchText, LaToscaText, DateText } from './svg'
import { MapPin } from 'lucide-react'

interface Props {
  church: string
  event: string
}

export const EventTimeline = ({ church, event }: Props) => {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center">
      <h2 className="font-playwrite text-3xl font-bold italic">El evento</h2>
      <DateText className="h-16 w-56" />
      <AnimatedSeparator />
      <div className="relative mt-5 h-32 w-80">
        <a
          href="https://maps.app.goo.gl/hYafEcvGbq22ZGXZ6"
          target="_blank"
          className="absolute -top-3 left-full z-10"
          rel="noreferrer"
        >
          <MapPin className="rotate-12 opacity-50" />
        </a>
        <ChurchText className="w-full" />
      </div>
      <AnimatedSeparator />
      <RoundedImage src={church} />
      <AnimatedSeparator />
      <div className="relative mb-6 h-20 w-72">
        <a
          href="https://maps.app.goo.gl/C7jwasYoN6Tuidn67"
          target="_blank"
          className="absolute -top-3 left-full z-10"
          rel="noreferrer"
        >
          <MapPin className="rotate-12 opacity-50" />
        </a>
        <LaToscaText className="w-full" />
      </div>
      <AnimatedSeparator />
      <RoundedImage src={event} />
    </div>
  )
}

const AnimatedSeparator = () => (
  <div className="h-[60px]">
    <motion.div
      className="h-[60px] w-px self-center rounded-xl bg-black"
      initial={{ height: '0%' }}
      whileInView={{ height: '100%' }}
      transition={{ duration: 3 }}
      viewport={{ once: true }}
    />
  </div>
)

const RoundedImage = ({ src }: { src: string }) => (
  <motion.div className="my-4 rounded-full border border-black">
    <img src={src} alt="" className="size-36 rounded-full p-2" />
  </motion.div>
)
