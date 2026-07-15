import { createFileRoute } from "@tanstack/react-router";
import { HeroPanel } from "@/features/dashboard/HeroPanel";
import { StatTile } from "@/features/dashboard/StatTile";
import { DailyChallengeCard } from "@/features/challenge/DailyChallengeCard";
import { LeaderboardList } from "@/features/leaderboard/LeaderboardList";
import { BranchChampionship } from "@/features/leaderboard/BranchChampionship";
import { LiveFeed } from "@/features/activity/LiveFeed";
import { BookingCard } from "@/features/booking/BookingCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { deliveryService } from "@/services/api";
import { useAppStore, useCurrentUser } from "@/store/appStore";
import { AnimatePresence } from "framer-motion";
import { CheckCircle2, Truck, Car } from "lucide-react";

export const Route = createFileRoute("/_app/delivery")({
  head: () => ({ meta: [{ title: "Delivery · CarExpo" }] }),
  component: DeliveryDashboard,
});

function DeliveryDashboard() {
  const user = useCurrentUser();
  const bookings = useAppStore((s) => s.bookings);
  if (!user) return null;
  const ready = bookings.filter((b) => b.status === "invoice_ready");
  const completed = bookings.filter((b) => b.status === "completed");

  return (
    <div className="space-y-6">
      <HeroPanel tagline="Delivery bay" />

      <div className="grid gap-4 md:grid-cols-4">
        <StatTile
          label="Ready vehicles"
          value={ready.length}
          icon={Car}
          accent="var(--accent-blue)"
        />
        <StatTile
          label="Today's deliveries"
          value={completed.length}
          icon={Truck}
          accent="var(--accent-cyan)"
        />
        <StatTile
          label="Completed"
          value={completed.length}
          icon={CheckCircle2}
          accent="var(--accent-green)"
        />
        <StatTile
          label="Streak"
          value={user.streak}
          hint="Days in a row"
          icon={Truck}
          accent="var(--accent-amber)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DailyChallengeCard role="delivery" />
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Handoff queue
                </div>
                <div className="font-display text-lg">
                  Ready to deliver ({ready.length})
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {ready.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    role="delivery"
                    onAction={(id) => deliveryService.complete(id, user.id)}
                  />
                ))}
                {ready.length === 0 && (
                  <div className="col-span-full text-sm text-muted-foreground text-center py-10">
                    No vehicles ready. Waiting on Finance.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
          <BranchChampionship />
        </div>
        <div className="space-y-6">
          <LeaderboardList compact />
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}
