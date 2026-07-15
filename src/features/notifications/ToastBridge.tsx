import { useAppStore } from "@/store/appStore";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  FileWarning,
  Sparkles,
  Trophy,
  Truck,
  XCircle,
  Send,
  Zap,
} from "lucide-react";

const iconFor = (kind: string) => {
  switch (kind) {
    case "booking_sent":
      return <Send size={16} className="text-[color:var(--accent-blue)]" />;
    case "loan_approved":
      return <BadgeCheck size={16} className="text-[color:var(--accent-green)]" />;
    case "loan_rejected":
      return <XCircle size={16} className="text-[color:var(--accent-red)]" />;
    case "docs_requested":
      return <FileWarning size={16} className="text-[color:var(--accent-amber)]" />;
    case "delivered":
      return <Truck size={16} className="text-[color:var(--accent-green)]" />;
    case "badge_unlocked":
      return <Sparkles size={16} className="text-[color:var(--accent-violet)]" />;
    case "challenge_completed":
      return <Trophy size={16} className="text-[color:var(--accent-amber)]" />;
    case "xp_earned":
      return <Zap size={16} className="text-[color:var(--accent-cyan)]" />;
    default:
      return <Zap size={16} />;
  }
};

export function ToastBridge() {
  const notifications = useAppStore((s) => s.notifications);
  const lastId = useRef<string | null>(null);
  useEffect(() => {
    if (!notifications.length) return;
    const latest = notifications[0];
    if (!latest || latest.id === lastId.current) return;
    lastId.current = latest.id;
    toast.custom(() => (
      <div className="glass-strong rounded-2xl px-4 py-3 flex items-start gap-3 min-w-[280px] shadow-[0_20px_60px_-20px_oklch(0.72_0.17_245/0.5)]">
        <div className="mt-0.5">{iconFor(latest.kind)}</div>
        <div>
          <div className="text-sm font-semibold">{latest.title}</div>
          {latest.body && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {latest.body}
            </div>
          )}
        </div>
      </div>
    ));
  }, [notifications]);
  return null;
}
