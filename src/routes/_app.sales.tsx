import { createFileRoute } from "@tanstack/react-router";
import { HeroPanel } from "@/features/dashboard/HeroPanel";
import { StatTile } from "@/features/dashboard/StatTile";
import { MotivationCard } from "@/features/dashboard/MotivationCard";
import { EmployeeOfMonth } from "@/features/dashboard/EmployeeOfMonth";
import { DailyChallengeCard } from "@/features/challenge/DailyChallengeCard";
import { LeaderboardList } from "@/features/leaderboard/LeaderboardList";
import { LiveFeed } from "@/features/activity/LiveFeed";
import { BookingCard } from "@/features/booking/BookingCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { bookingService } from "@/services/api";
import { useAppStore, useCurrentUser } from "@/store/appStore";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Plus, Target, ClipboardCheck, Truck, Wallet } from "lucide-react";

export const Route = createFileRoute("/_app/sales")({
  head: () => ({ meta: [{ title: "Sales · CarExpo" }] }),
  component: SalesDashboard,
});

function SalesDashboard() {
  const user = useCurrentUser();
  const bookings = useAppStore((s) => s.bookings);
  useEffect(() => {
  const loadBookings = async () => {
    try {
      await bookingService.list();
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  loadBookings();
}, []);
  if (!user) return null;

  const mine = bookings.filter(
    (b) =>
      b.salesId === user.id &&
      ["booking_created", "awaiting_finance", "docs_requested"].includes(
        b.status,
      ),
  );
  const approvedMine = bookings.filter(
    (b) => b.salesId === user.id && b.status === "invoice_ready",
  );
  const deliveredMine = bookings.filter(
    (b) => b.salesId === user.id && b.status === "completed",
  );

  return (
    <div className="space-y-6">
      <HeroPanel tagline="Welcome back" />

      <div className="grid gap-4 md:grid-cols-4">
        <StatTile
          label="Today's target"
          value={5}
          hint={`${Math.min(mine.length, 5)} in progress`}
          icon={Target}
          accent="var(--accent-cyan)"
        />
        <StatTile
          label="My bookings"
          value={mine.length}
          hint="Active pipeline"
          icon={ClipboardCheck}
          accent="var(--accent-blue)"
        />
        <StatTile
          label="Finance approved"
          value={approvedMine.length}
          icon={Wallet}
          accent="var(--accent-violet)"
        />
        <StatTile
          label="Delivered"
          value={deliveredMine.length}
          icon={Truck}
          accent="var(--accent-green)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DailyChallengeCard role="sales" />

          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Active pipeline
                </div>
                <div className="font-display text-lg">Current bookings</div>
              </div>
              <GradientButton
                size="sm"
                onClick={() => bookingService.create(user.id)}
              >
                <Plus size={14} /> New booking
              </GradientButton>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {mine.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    role="sales"
                    onAction={(id) => bookingService.sendToFinance(id)}
                  />
                ))}
                {mine.length === 0 && (
                  <div className="col-span-full text-sm text-muted-foreground text-center py-10">
                    All caught up. Create a new booking to keep the pipeline
                    moving.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-2">
            <MotivationCard />
            <EmployeeOfMonth />
          </div>
        </div>

        <div className="space-y-6">
          <LeaderboardList compact />
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}
