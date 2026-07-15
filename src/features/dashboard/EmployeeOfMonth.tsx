import { GlassCard } from "@/components/ui/GlassCard";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { useAppStore } from "@/store/appStore";
import { Crown } from "lucide-react";

export function EmployeeOfMonth() {
  const users = useAppStore((s) => s.users);
  const top = Object.values(users).sort((a, b) => b.monthlyXp - a.monthlyXp)[0];
  if (!top) return null;
  return (
    <GlassCard className="p-5" glow>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Crown size={12} className="text-[color:var(--accent-amber)]" />
        Employee of the month
      </div>
      <div className="mt-3 flex items-center gap-4">
        <InitialsAvatar name={top.name} color={top.avatarColor} size={56} />
        <div>
          <div className="font-display text-xl">{top.name}</div>
          <div className="text-xs text-muted-foreground capitalize">
            {top.role} · {top.branchId} · Lv {top.level}
          </div>
          <div className="mt-1 text-sm">
            <span className="text-gradient font-semibold">
              {top.monthlyXp.toLocaleString()} XP
            </span>
            <span className="text-muted-foreground"> this month</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
