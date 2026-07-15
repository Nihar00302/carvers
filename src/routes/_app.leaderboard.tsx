import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardList } from "@/features/leaderboard/LeaderboardList";
import { BranchChampionship } from "@/features/leaderboard/BranchChampionship";
import { LiveFeed } from "@/features/activity/LiveFeed";

export const Route = createFileRoute("/_app/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard · CarExpo" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Standings
        </div>
        <h1 className="font-display text-4xl">Championship board</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Every booking, approval and delivery moves the numbers. Ranking is
          live.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <LeaderboardList />
          <BranchChampionship />
        </div>
        <div>
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}