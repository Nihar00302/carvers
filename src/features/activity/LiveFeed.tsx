import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/store/appStore";
import { formatRelativeTime } from "@/lib/format";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  FileWarning,
  Sparkles,
  Trophy,
  Truck,
  XCircle,
  PlusCircle,
  Send,
  Zap,
} from "lucide-react";
import type { ActivityEvent } from "@/lib/types";

function iconFor(kind: ActivityEvent["kind"]) {
  switch (kind) {
    case "booking_created":
      return <PlusCircle size={14} className="text-[color:var(--accent-cyan)]" />;
    case "booking_sent":
      return <Send size={14} className="text-[color:var(--accent-blue)]" />;
    case "loan_approved":
      return <BadgeCheck size={14} className="text-[color:var(--accent-green)]" />;
    case "loan_rejected":
      return <XCircle size={14} className="text-[color:var(--accent-red)]" />;
    case "docs_requested":
      return <FileWarning size={14} className="text-[color:var(--accent-amber)]" />;
    case "delivery_completed":
      return <Truck size={14} className="text-[color:var(--accent-green)]" />;
    case "badge_unlocked":
      return <Sparkles size={14} className="text-[color:var(--accent-violet)]" />;
    case "branch_promoted":
      return <Trophy size={14} className="text-[color:var(--accent-amber)]" />;
    case "challenge_completed":
      return <Zap size={14} className="text-[color:var(--accent-cyan)]" />;
    default:
      return <Zap size={14} />;
  }
}

export function LiveFeed() {
  const activity = useAppStore((s) => s.activity);
  return (
    <GlassCard className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Live floor
          </div>
          <div className="font-display text-lg">Activity feed</div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-[color:var(--accent-green)] animate-pulse" />
          Live
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activity.map((a) => (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                className="flex items-start gap-3 rounded-xl border border-[var(--hairline)] bg-[oklch(1_0_0/0.02)] px-3 py-2"
              >
                <div className="mt-0.5">{iconFor(a.kind)}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm leading-snug">
                    {a.actorName ? (
                      <span className="font-medium">{a.actorName} </span>
                    ) : null}
                    <span className="text-muted-foreground">{a.message}</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    {formatRelativeTime(a.timestamp)}
                    {a.xp ? ` • +${a.xp} XP` : ""}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </GlassCard>
  );
}
