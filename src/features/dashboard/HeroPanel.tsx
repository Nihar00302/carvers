import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { StreakFlame } from "@/features/xp/StreakFlame";
import { XpBar } from "@/features/xp/XpBar";
import { useAppStore, useCurrentUser } from "@/store/appStore";
import { levelProgress } from "@/lib/xpRules";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export function HeroPanel({ tagline }: { tagline: string }) {
  const user = useCurrentUser();
  const users = useAppStore((s) => s.users);
  const branches = useAppStore((s) => s.branches);
  if (!user) return null;
  const rank =
    Object.values(users)
      .filter((u) => u.role === user.role)
      .sort((a, b) => b.weeklyXp - a.weeklyXp)
      .findIndex((u) => u.id === user.id) + 1;
  const p = levelProgress(user.xp);
  const branch = branches[user.branchId];
  return (
    <GlassCard className="p-6 md:p-8 grid-bg" glow>
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 245 / 0.35), transparent 60%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
        <div className="flex items-center gap-5 min-w-0">
          <InitialsAvatar name={user.name} color={user.avatarColor} size={72} />
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {tagline}
            </div>
            <div className="font-display text-3xl md:text-4xl leading-tight">
              {user.name}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{user.role}</span>
              <span>·</span>
              <span className="capitalize">{branch?.name}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Trophy size={12} /> Rank #{rank}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StreakFlame streak={user.streak} />
          <ProgressRing value={p.ratio} size={104}>
            <div className="text-center">
              <div className="font-display text-2xl">
                <AnimatedNumber value={p.level} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Level
              </div>
            </div>
          </ProgressRing>
        </div>
      </div>
      <div className="relative mt-6">
        <XpBar xp={user.xp} />
      </div>
    </GlassCard>
  );
}
