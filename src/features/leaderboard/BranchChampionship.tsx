import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useAppStore } from "@/store/appStore";
import { AnimatePresence, motion } from "framer-motion";
import { Flag } from "lucide-react";

export function BranchChampionship() {
  const branches = useAppStore((s) => s.branches);
  const sorted = Object.values(branches).sort((a, b) => b.xp - a.xp);
  const max = Math.max(...sorted.map((b) => b.xp), 1);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flag size={16} className="text-[color:var(--accent-cyan)]" />
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Branch championship
          </div>
          <div className="font-display text-lg">All-India standings</div>
        </div>
      </div>
      <ul className="space-y-3">
        <AnimatePresence initial={false}>
          {sorted.map((b, i) => (
            <motion.li
              key={b.id}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="rounded-xl border border-[var(--hairline)] bg-[oklch(1_0_0/0.02)] px-3 py-2.5"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-semibold ${
                      i === 0
                        ? "bg-[color:var(--accent-amber)] text-black"
                        : "bg-[oklch(1_0_0/0.08)] text-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium">{b.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <AnimatedNumber value={b.deliveries} /> deliveries
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-[oklch(1_0_0/0.06)]">
                <motion.div
                  className="h-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-blue),var(--accent-violet))]"
                  animate={{ width: `${(b.xp / max) * 100}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 22 }}
                />
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                <AnimatedNumber value={b.xp} /> XP
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </GlassCard>
  );
}
