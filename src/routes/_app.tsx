import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAppStore } from "@/store/appStore";
import { TopNav } from "@/features/nav/TopNav";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = useAppStore.getState();
    if (!s.currentUserId) throw redirect({ to: "/" });
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1500px] px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
