import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useAppStore } from "@/store/appStore";
import type { Role } from "@/lib/types";
import { Zap, Check } from "lucide-react";
import { motion } from "framer-motion";

export function DailyChallengeCard({ role }: { role: Role }) {
  const challenge = useAppStore((s) => s.challenges.find((c) => c.role === role));
  if (!challenge) return null;
  const ratio = challenge.progress / challenge.target;
  return (
    <GlassCard className="p-5" glow>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Zap size={12} className="text-[color:var(--accent-amber)]" />
            Daily challenge
          </div>
          <div className="mt-1 font-display text-xl">{challenge.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Reward:{" "}
            <span className="text-foreground font-medium">+{challenge.reward} XP</span>
          </div>
          <motion.div
            className="mt-3 inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border border-[var(--hairline)]"
            animate={
              challenge.completed ? { scale: [1, 1.08, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.5 }}
          >
            {challenge.completed ? (
              <>
                <Check size={12} className="text-[color:var(--accent-green)]" />
                Completed
              </>
            ) : (
              <>
                {challenge.progress} / {challenge.target}
              </>
            )}
          </motion.div>
        </div>
        <ProgressRing value={ratio} size={92}>
          <div className="text-center">
            <div className="font-display text-xl">
              {Math.round(ratio * 100)}%
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              done
            </div>
          </div>
        </ProgressRing>
      </div>
    </GlassCard>
  );
}
