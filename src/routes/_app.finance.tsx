import { createFileRoute } from "@tanstack/react-router";
import { HeroPanel } from "@/features/dashboard/HeroPanel";
import { StatTile } from "@/features/dashboard/StatTile";
import { DailyChallengeCard } from "@/features/challenge/DailyChallengeCard";
import { LeaderboardList } from "@/features/leaderboard/LeaderboardList";
import { LiveFeed } from "@/features/activity/LiveFeed";
import { BookingCard } from "@/features/booking/BookingCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { financeService } from "@/services/api";
import { useAppStore, useCurrentUser } from "@/store/appStore";
import { AnimatePresence } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { BadgeCheck, ClipboardList, FileWarning, XCircle } from "lucide-react";

export const Route = createFileRoute("/_app/finance")({
  head: () => ({ meta: [{ title: "Finance · CarExpo" }] }),
  component: FinanceDashboard,
});

function FinanceDashboard() {
  const user = useCurrentUser();
  const bookings = useAppStore((s) => s.bookings);
  const stats = useAppStore((s) => (user ? s.stats[user.id] : undefined));
  if (!user) return null;

  const queue = bookings.filter((b) => b.status === "awaiting_finance");
  const approved = stats?.loansApproved ?? 0;
  const rejected = stats?.loansRejected ?? 0;
  const docs = stats?.docsRequested ?? 0;
  const total = approved + rejected + docs;
  const rate = total > 0 ? approved / total : 0;

  return (
    <div className="space-y-6">
      <HeroPanel tagline="Loan control room" />

      <div className="grid gap-4 md:grid-cols-4">
        <StatTile
          label="Pending requests"
          value={queue.length}
          icon={ClipboardList}
          accent="var(--accent-amber)"
          hint="Live loan queue"
        />
        <StatTile
          label="Approved today"
          value={approved}
          icon={BadgeCheck}
          accent="var(--accent-green)"
        />
        <StatTile
          label="Docs requested"
          value={docs}
          icon={FileWarning}
          accent="var(--accent-violet)"
        />
        <StatTile
          label="Rejected"
          value={rejected}
          icon={XCircle}
          accent="var(--accent-red)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <DailyChallengeCard role="finance" />
            <GlassCard className="p-5 flex items-center gap-5">
              <ProgressRing value={rate} size={92}>
                <div className="text-center">
                  <div className="font-display text-xl">
                    {Math.round(rate * 100)}%
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    approval
                  </div>
                </div>
              </ProgressRing>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Approval rate
                </div>
                <div className="font-display text-xl">
                  <AnimatedNumber value={approved} /> approvals
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Fair, fast, on-time.
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Loan queue
                </div>
                <div className="font-display text-lg">
                  {queue.length} awaiting your call
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {queue.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    role="finance"
                    onAction={(id) => financeService.approve(id, user.id)}
                    onReject={(id) => financeService.reject(id, user.id)}
                    onDocs={(id) => financeService.requestDocs(id, user.id)}
                  />
                ))}
                {queue.length === 0 && (
                  <div className="col-span-full text-sm text-muted-foreground text-center py-10">
                    Queue clear. Waiting on Sales to send the next deal.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <LeaderboardList compact />
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}
