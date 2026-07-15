import { GlassCard } from "@/components/ui/GlassCard";
import { motivationQuote } from "@/lib/seedData";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";

export function MotivationCard() {
  const quote = useMemo(motivationQuote, []);
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Sparkles size={12} className="text-[color:var(--accent-violet)]" />
        Momentum
      </div>
      <div className="mt-2 font-display text-xl leading-snug text-gradient">
        “{quote}”
      </div>
    </GlassCard>
  );
}
