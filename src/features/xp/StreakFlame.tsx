import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export function StreakFlame({ streak }: { streak: number }) {
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 border border-[var(--hairline)] bg-[color-mix(in_oklab,var(--accent-red)_10%,transparent)]"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <Flame size={14} className="text-[color:var(--accent-red)]" />
      <span className="text-xs font-semibold">{streak}</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
        streak
      </span>
    </motion.div>
  );
}
