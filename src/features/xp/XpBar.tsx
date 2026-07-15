import { levelProgress } from "@/lib/xpRules";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function XpBar({ xp }: { xp: number }) {
  const p = levelProgress(xp);
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Level {p.level}
          </span>
          <span className="text-xs text-muted-foreground">
            <AnimatedNumber value={p.intoLevel} /> / {p.levelSpan} XP
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          → Lv {p.level + 1}
        </span>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden bg-[oklch(1_0_0/0.06)]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-blue),var(--accent-violet))]"
          initial={{ width: 0 }}
          animate={{ width: `${p.ratio * 100}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 22 }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full opacity-60 blur-md bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-violet))]"
          initial={{ width: 0 }}
          animate={{ width: `${p.ratio * 100}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 22 }}
        />
      </div>
    </div>
  );
}
