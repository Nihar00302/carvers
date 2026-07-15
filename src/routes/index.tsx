import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Landmark,
  Truck,
  Flame,
  Trophy,
  Zap,
} from "lucide-react";
import type { Role } from "@/lib/types";
import { authService } from "@/services/api";
import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

const ROLES: {
  id: Role;
  title: string;
  tagline: string;
  bullets: string[];
  Icon: typeof Briefcase;
  gradient: string;
  next: string;
}[] = [
  {
    id: "sales",
    title: "Sales Executive",
    tagline: "Book it. Ship it. Level up.",
    bullets: [
      "Create bookings, hit daily targets",
      "Send deals to Finance in one tap",
      "Earn XP on every closed customer",
    ],
    Icon: Briefcase,
    gradient:
      "linear-gradient(135deg, oklch(0.72 0.17 245), oklch(0.82 0.14 200))",
    next: "/sales",
  },
  {
    id: "finance",
    title: "Finance Officer",
    tagline: "Approve fast. Approve fair.",
    bullets: [
      "Live loan queue with SLA timers",
      "Approve, reject or request docs",
      "Compete on approval rate and speed",
    ],
    Icon: Landmark,
    gradient:
      "linear-gradient(135deg, oklch(0.68 0.19 300), oklch(0.72 0.17 245))",
    next: "/finance",
  },
  {
    id: "delivery",
    title: "Delivery Specialist",
    tagline: "Handoff heroes wear the crown.",
    bullets: [
      "Track ready vehicles in real time",
      "One-tap delivery completion",
      "Boost your branch on the podium",
    ],
    Icon: Truck,
    gradient:
      "linear-gradient(135deg, oklch(0.86 0.16 150), oklch(0.72 0.17 170))",
    next: "/delivery",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);
  useEffect(() => {
    // Ensure a clean session view when returning to /
    logout();
  }, [logout]);

  const choose = async (role: Role, next: string) => {
    await authService.login(role);
    navigate({ to: next });
  };

  return (
    <div className="min-h-screen relative">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,var(--accent-cyan),var(--accent-blue),var(--accent-violet))]"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
            <div className="font-display text-2xl tracking-tight">
              Car<span className="text-gradient">Expo</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-[color:var(--accent-green)] animate-pulse" />
            Live dealership performance OS
          </div>
        </motion.div>

        <div className="mt-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            Dealership Performance OS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-3 font-display text-5xl md:text-7xl leading-[1.02] tracking-tighter"
          >
            Employees are already{" "}
            <span className="text-gradient">competing</span>
            <br /> while they work.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-5 text-lg text-muted-foreground max-w-xl"
          >
            Sales → Finance → Delivery. One live workflow. XP for real work,
            streaks that carry momentum, and a branch championship that never
            sleeps.
          </motion.p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--hairline)] px-2.5 py-1">
              <Zap size={12} className="text-[color:var(--accent-cyan)]" /> +20/40/100 XP per real action
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--hairline)] px-2.5 py-1">
              <Flame size={12} className="text-[color:var(--accent-red)]" /> Daily streaks
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--hairline)] px-2.5 py-1">
              <Trophy size={12} className="text-[color:var(--accent-amber)]" /> Branch championship
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ROLES.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => choose(r.id, r.next)}
              className="relative text-left glass rounded-3xl p-6 overflow-hidden group"
            >
              <motion.div
                className="absolute -top-24 -right-16 w-64 h-64 rounded-full blur-3xl opacity-70"
                style={{ background: r.gradient }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-[oklch(0.14_0.02_260)]"
                  style={{ background: r.gradient }}
                >
                  <r.Icon size={22} />
                </div>
                <div className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Sign in as
                </div>
                <div className="mt-1 font-display text-2xl">{r.title}</div>
                <div className="mt-1 text-sm text-gradient">{r.tagline}</div>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 w-1 h-1 rounded-full bg-[color:var(--accent-cyan)]" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-gradient transition-colors">
                  Enter dashboard <ArrowRight size={14} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-16 text-xs text-muted-foreground">
          Mock authentication — role selection only. Real auth plugs into
          <code className="mx-1 px-1.5 py-0.5 rounded bg-[oklch(1_0_0/0.06)]">
            services/api.ts
          </code>
          later.
        </div>
      </div>
    </div>
  );
}
