import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const IMAGE_URLS = [
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//0.jpg",
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//1.jpg",
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//2.jpg",
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//3.jpg",
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//4.jpg",
];

const TIME = 4;
const WIDTH = 236.5;
const MID = Math.floor(IMAGE_URLS.length / 2);

export const CoverPics = () => {
  const [pos, setPos] = useState(MID);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((pos + 1) % IMAGE_URLS.length);
    }, TIME * 1000);

    return () => clearInterval(interval);
  }, [pos]);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: -20 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 2 }}
      viewport={{ once: true }}
      className="flex max-w-96 h-96 w-11/12 items-center overflow-hidden rounded-md bg-slate-300"
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="w-fit flex size-full flex-row items-center justify-center"
          animate={{ translateX: `${-(pos - MID) * WIDTH}px` }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {IMAGE_URLS.map((src, idx) => (
            <motion.img
              key={src}
              src={src}
              initial={{ scale: idx === pos ? 0.8 : 1 }}
              animate={{ scale: idx === pos ? 1 : 0.8 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-5/6 rounded-lg object-cover"
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
