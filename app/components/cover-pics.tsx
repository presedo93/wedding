import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const duration = 8;
const images = [
  "/images/covers/0.jpg",
  "/images/covers/1.jpg",
  "/images/covers/2.jpg",
];

export const CoverPics = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: -100 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 2.5 }}
      className="flex flex-col"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          layoutId="cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-auto w-full rounded-lg shadow shadow-slate-700"
        />
      </AnimatePresence>
      <motion.div
        key={images[currentIndex]}
        className="mt-1 h-0.5 w-full self-center rounded-full bg-slate-700 opacity-75"
        initial={{ width: "0%" }}
        animate={{ width: "90%" }}
        transition={{ duration, ease: "linear" }}
      />
    </motion.div>
  );
};
