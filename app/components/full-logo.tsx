import { motion } from "motion/react";

const SRC =
  "https://hbjwdmibaweonejpklvh.supabase.co/storage/v1/object/public/public_files//logo.png";

export const FullLogo = () => (
  <motion.div
    initial={{ opacity: 0, translateY: -20 }}
    whileInView={{ opacity: 1, translateY: 0 }}
    transition={{ duration: 2 }}
    viewport={{ once: true }}
    className="h-32 flex justify-center items-center rounded-full"
  >
    <motion.img src={SRC} className="h-5/6 rounded-lg object-cover" />
  </motion.div>
);
