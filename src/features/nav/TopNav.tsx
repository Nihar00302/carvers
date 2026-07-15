import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { StreakFlame } from "@/features/xp/StreakFlame";
import { DemoModeToggle } from "@/features/demo/DemoModeToggle";
import { useAppStore, useCurrentUser } from "@/store/appStore";
import { authService } from "@/services/api";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Bell, Gauge, Trophy, User2 } from "lucide-react";
import { levelProgress } from "@/lib/xpRules";
import { motion } from "framer-motion";

export function TopNav() {
  const user = useCurrentUser();
  const unread = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;
  const p = levelProgress(user.xp);
  const dashPath =
    user.role === "sales"
      ? "/sales"
      : user.role === "finance"
        ? "/finance"
        : "/delivery";

  const links: { to: string; label: string; icon: typeof Gauge }[] = [
    { to: dashPath, label: "Dashboard", icon: Gauge },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-[var(--hairline)] bg-[oklch(0.14_0.02_260/0.6)]">
      <div className="mx-auto max-w-[1500px] px-6 h-16 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5">
          <motion.div
            className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,var(--accent-cyan),var(--accent-blue),var(--accent-violet))]"
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          />
          <div className="font-display text-lg tracking-tight">
            Car<span className="text-gradient">Expo</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`inline-flex items-center gap-1.5 rounded-full text-xs px-3 py-1.5 border transition-colors ${
                  active
                    ? "border-[color:var(--accent-blue)] bg-[color-mix(in_oklab,var(--accent-blue)_15%,transparent)]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <l.icon size={12} /> {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <DemoModeToggle />

          <div className="hidden lg:flex items-center gap-3 rounded-full border border-[var(--hairline)] bg-[oklch(1_0_0/0.03)] pl-2 pr-3 py-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Lv {p.level}
            </div>
            <div className="relative w-28 h-1.5 rounded-full overflow-hidden bg-[oklch(1_0_0/0.06)]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-blue),var(--accent-violet))]"
                animate={{ width: `${p.ratio * 100}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 22 }}
              />
            </div>
            <div className="text-xs font-medium text-gradient">
              <AnimatedNumber value={user.xp} /> XP
            </div>
          </div>

          <StreakFlame streak={user.streak} />

          <button className="relative rounded-full border border-[var(--hairline)] bg-[oklch(1_0_0/0.03)] w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full text-[10px] flex items-center justify-center bg-[color:var(--accent-red)] text-white px-1">
                {unread}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[oklch(1_0_0/0.03)] pl-1 pr-3 py-1">
            <InitialsAvatar name={user.name} color={user.avatarColor} size={28} />
            <div className="leading-tight">
              <div className="text-xs font-medium">{user.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground capitalize">
                {user.role}
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              await authService.logout();
              navigate({ to: "/" });
            }}
            className="rounded-full border border-[var(--hairline)] bg-[oklch(1_0_0/0.03)] w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground"
            title="Switch role"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function BackgroundFx() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <motion.div
        className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 245 / 0.35), transparent 60%)",
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.19 300 / 0.28), transparent 60%)",
        }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.14 200 / 0.22), transparent 60%)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
