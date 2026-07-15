import { GlassCard } from "@/components/ui/GlassCard";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useAppStore } from "@/store/appStore";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useState } from "react";
import type { User } from "@/lib/types";

type Scope = "dailyXp" | "weeklyXp" | "monthlyXp";

const TABS: { id: Scope; label: string }[] = [
  { id: "dailyXp", label: "Daily" },
  { id: "weeklyXp", label: "Weekly" },
  { id: "monthlyXp", label: "Monthly" },
];

export function LeaderboardList({ compact = false }: { compact?: boolean }) {
  const users = useAppStore((s) => s.users);
  const currentId = useAppStore((s) => s.currentUserId);
  const [scope, setScope] = useState<Scope>("weeklyXp");
  const sorted: User[] = Object.values(users)
    .slice()
    .sort((a, b) => b[scope] - a[scope])
    .slice(0, compact ? 6 : 10);

  return (
    <GlassCard className="p-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Leaderboard
          </div>
          <div className="font-display text-lg flex items-center gap-2">
            <Trophy size={16} className="text-[color:var(--accent-amber)]" />
            Top performers
          </div>
        </div>
        <div className="flex gap-1 rounded-full border border-[var(--hairline)] bg-[oklch(1_0_0/0.03)] p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setScope(t.id)}
              className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                scope === t.id
                  ? "bg-[oklch(1_0_0/0.1)] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="space-y-2 flex-1">
        <AnimatePresence initial={false}>
          {sorted.map((u, i) => (
            <motion.li
              key={u.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                u.id === currentId
                  ? "border-[color:var(--accent-blue)] bg-[color-mix(in_oklab,var(--accent-blue)_12%,transparent)]"
                  : "border-[var(--hairline)] bg-[oklch(1_0_0/0.02)]"
              }`}
            >
              <div
                className={`w-6 text-center font-display text-lg ${
                  i === 0
                    ? "text-[color:var(--accent-amber)]"
                    : i === 1
                      ? "text-[color:var(--accent-cyan)]"
                      : i === 2
                        ? "text-[color:var(--accent-violet)]"
                        : "text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <InitialsAvatar name={u.name} color={u.avatarColor} size={32} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{u.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {u.role} • Lv {u.level} • {u.branchId}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-base text-gradient">
                  <AnimatedNumber value={u[scope]} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  XP
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </GlassCard>
  );
}
