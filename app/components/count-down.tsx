import { motion } from "motion/react";
import { useEffect, useState } from "react";

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

const calculateTimeLeft = () => {
  const target = new Date("2025-05-24T17:00:00Z");
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  const seconds = Math.floor((diff % (1000 * MIN)) / 1000);
  const minutes = Math.floor((diff % (1000 * HOUR)) / (1000 * MIN));
  const hours = Math.floor((diff % (1000 * DAY)) / (1000 * HOUR));
  const days = Math.floor((diff % (1000 * MONTH)) / (1000 * DAY));
  const months = Math.floor(diff / (1000 * MONTH));

  return { months, days, hours, minutes, seconds };
};

export const CountDown = () => {
  const [left, setLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: -20 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 2 }}
      viewport={{ once: true }}
      className="flex max-w-96 w-full flex-col items-center font-playwrite text-lg font-thin"
    >
      <p className="mb-2">Quedan</p>
      <div className="my-2 flex h-full w-10/12 flex-row items-center justify-around rounded-md border border-black p-2 shadow-md shadow-slate-500">
        <div className="flex flex-col items-center">
          <span className="font-normal">{left.months}</span>
          <span className="text-sm">meses</span>
        </div>
        <div className="h-8 w-px bg-black" />
        <div className="flex flex-col items-center">
          <span className="font-normal">{left.days}</span>
          <span className="text-sm">días</span>
        </div>
        <div className="h-8 w-px bg-black" />
        <div className="flex flex-col items-center">
          <span className="font-normal">{left.hours}</span>
          <span className="text-sm">horas</span>
        </div>
        <div className="h-8 w-px bg-black" />
        <div className="flex flex-col items-center">
          <span className="font-normal">{left.minutes}</span>
          <span className="text-sm">mins</span>
        </div>
        <div className="h-8 w-px bg-black" />
        <div className="flex flex-col items-center">
          <span className="font-normal">{left.seconds}</span>
          <span className="text-sm">secs</span>
        </div>
      </div>
    </motion.div>
  );
};
