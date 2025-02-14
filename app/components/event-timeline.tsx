import { motion } from "motion/react";
import { ChurchText, LaToscaText, DateText } from "./svg";

const CHURCH =
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//boliches.jpg";
const EVENT =
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//latosca.jpg";

export const EventTimeline = () => {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center">
      <h2 className="font-playwrite text-3xl font-bold italic">El evento</h2>
      <DateText className="h-16 w-56" />
      <AnimatedSeparator />
      <ChurchText className="h-32 w-80" />
      <AnimatedSeparator />
      <RoundedImage src={CHURCH} />
      <AnimatedSeparator />
      <LaToscaText className="mb-2 h-20 w-72" />
      <AnimatedSeparator />
      <RoundedImage src={EVENT} />
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
