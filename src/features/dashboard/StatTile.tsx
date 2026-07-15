import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { LucideIcon } from "lucide-react";

export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  accent = "var(--accent-blue)",
}: {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: `color-mix(in oklab, ${accent} 20%, transparent)`,
            color: accent,
          }}
        >
          <Icon size={14} />
        </div>
      </div>
      <div className="mt-2 font-display text-3xl">
        <AnimatedNumber value={value} />
      </div>
      {hint && (
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      )}
    </GlassCard>
  );
}
