import { motion } from "framer-motion";
import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";

interface Props {
  isChecked: boolean;
  children: React.ReactNode;
}

export function TodoItem({ isChecked, children }: Props) {
  const [checked, setChecked] = useState(isChecked);

  return (
    <div className="flex flex-row items-center gap-2 font-normal">
      <Checkbox
        className="border-slate-700 data-[state=checked]:bg-slate-950"
        checked={checked}
        onClick={() => setChecked(!checked)}
      />
      <div className="relative">
        <span>{children}</span>
        <motion.div
          className="absolute left-0 top-1/2 h-px rounded-xl bg-black"
          initial={{ width: checked ? 0 : 1 }}
          animate={{ width: checked ? "100%" : "0%" }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
