import { motion } from "motion/react";
import { ChurchText, LaToscaText, DateText } from "./svg";

export const EventTimeline = () => {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center">
      <h2 className="font-playwrite text-3xl font-bold italic">El evento</h2>
      <DateText className="h-20 w-56" />
      <AnimatedSeparator />
      <ChurchText className="h-28 w-44" />
      <AnimatedSeparator />
      <RoundedImage src="/images/boliches.jpg" />
      <AnimatedSeparator />
      <LaToscaText className="h-20 w-56" />
      <AnimatedSeparator />
      <RoundedImage src="/images/latosca.jpg" />
    </div>
  );
};

const AnimatedSeparator = () => (
  <div className="h-[60px]">
    <motion.div
      className="h-[60px] w-px self-center rounded-xl bg-black"
      initial={{ height: "0%" }}
      whileInView={{ height: "100%" }}
      transition={{ duration: 3 }}
      viewport={{ once: true }}
    />
  </div>
);

const RoundedImage = ({ src }: { src: string }) => (
  <motion.div className="my-4 rounded-full border border-black">
    <img src={src} alt="" className="size-36 rounded-full p-2" />
  </motion.div>
);
