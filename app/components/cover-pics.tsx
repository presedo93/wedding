import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const IMAGE_URLS = [
  "/images/covers/0.jpg",
  "/images/covers/1.jpg",
  "/images/covers/2.jpg",
];

const TIME = 4;
const OFFSET = 70;
const MID = Math.floor(IMAGE_URLS.length / 2);

export const CoverPics = () => {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((pos + 1) % IMAGE_URLS.length);
    }, TIME * 1000);

    return () => clearInterval(interval);
  }, [pos]);

  return (
    <div className="flex h-96 w-11/12 items-center overflow-hidden rounded-md bg-slate-300">
      <AnimatePresence>
        <motion.div
          className="flex size-full flex-row items-center justify-center"
          initial={{ x: `${OFFSET}%` }}
          animate={{ x: `${-(pos - MID) * OFFSET}%` }}
          transition={{ duration: 2, ease: "easeInOut" }}
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
    </div>
  );
};
