
# CarExpo — Premium Dealership Gamification Platform

A production-quality, backend-ready SPA where dealership employees earn XP by completing real work as bookings flow Sales → Finance → Delivery. Feels like Linear × F1 Race Control × Mercedes AMG.

Note: The project already uses **TanStack Router + TanStack Start (v1, React 19)**, not plain React Router. I'll use TanStack Router for routing (superior file-based routing, type-safe navigation, SSR-ready) and keep the rest of the requested stack: TypeScript, Vite, Tailwind v4, Framer Motion, Zustand, Lucide. This is strictly better than React Router DOM for this template and preserves backend-ready architecture. If you specifically need React Router DOM, tell me and I'll swap.

## Visual Direction

- Dark AMG-inspired canvas (near-black `oklch(0.14 0.02 260)`) with electric blue → cyan gradient accents, subtle silver text, and racing-red for alerts/streaks.
- Glassmorphism cards, soft neon glows, animated grid + orb background, large display typography (Space Grotesk) + refined body (Inter).
- Every state change animates via Framer Motion: XP counters tick up, leaderboard rows reorder with `layout`, booking cards fly out on completion, toasts slide in.
- Top nav only (logo · role pill · streak · XP bar · level · notifications · demo-mode toggle · avatar). No sidebars, no tables.

## Architecture

```text
src/
  routes/
    __root.tsx                 shell, providers, top nav, toaster, bg fx
    index.tsx                  role-select login (Sales / Finance / Delivery)
    _app.tsx                   auth guard layout (redirects to / if no role)
    _app.sales.tsx             Sales dashboard
    _app.finance.tsx           Finance dashboard
    _app.delivery.tsx          Delivery dashboard
    _app.leaderboard.tsx       full leaderboard + branch championship
    _app.profile.tsx           badges, level, streak history
  stores/                      Zustand slices
    authStore.ts   userStore.ts   bookingStore.ts   xpStore.ts
    leaderboardStore.ts   notificationStore.ts   branchStore.ts
    challengeStore.ts   activityStore.ts   demoStore.ts
  services/                    mock APIs (Promise-based, swap for fetch later)
    authService.ts   userService.ts   bookingService.ts
    financeService.ts   deliveryService.ts   leaderboardService.ts
    notificationService.ts   challengeService.ts   activityService.ts
  features/
    booking/ (BookingCard, BookingList, StatusPill, ProgressTrack)
    xp/      (XpBar, LevelBadge, XpGainToast, StreakFlame)
    leaderboard/ (LeaderboardList, RankRow, BranchChampionship)
    activity/ (LiveFeed, ActivityItem)
    challenge/ (DailyChallengeCard, ChallengeProgress)
    dashboard/ (HeroPanel, StatTile, MotivationCard, EmployeeOfMonth)
    demo/    (DemoModeToggle, demoEngine.ts)
  components/ui/               reusable primitives (GlassCard, GradientButton, Pill, AnimatedNumber, ProgressRing)
  lib/                         types.ts, xpRules.ts, formatters.ts, seedData.ts
  hooks/                       useDemoEngine, useXpAnimation, useToastBridge
  styles.css                   tokens + @theme
```

Rules:
- Components **never** hardcode data — they call stores; stores call services; services return typed Promises from in-memory seed data.
- Swapping to a real API = replace service bodies only. No component edits needed.
- All XP rules live in `lib/xpRules.ts` (single source of truth).

## Data Model

```ts
type Role = 'sales' | 'finance' | 'delivery';
type BookingStatus =
  | 'booking_created' | 'awaiting_finance' | 'finance_approved'
  | 'docs_requested' | 'rejected' | 'invoice_ready'
  | 'in_delivery' | 'completed';

interface Booking {
  id; customer; vehicle; salesId; financeId?; deliveryId?;
  status; createdAt; updatedAt; timeline: StatusEvent[];
}
interface User { id; name; role; branch; level; xp; streak; badges[]; avatarColor }
interface Branch { id; name; xp; deliveries; rank }
interface ActivityEvent { id; type; actorId; message; timestamp }
```

## Workflow (the core loop)

1. Sales creates / owns bookings in `booking_created` → clicks **Send to Finance** → status `awaiting_finance`, +20 XP, notification, feed event, leaderboard tick.
2. Finance sees it in Loan Queue → **Approve** (+40 XP, → `finance_approved` → auto `invoice_ready`), **Reject**, or **Request Docs** (→ `docs_requested`, back to Sales).
3. Delivery sees `invoice_ready` items → **Complete Delivery** → `completed`, +100 XP delivery, +bonus XP to originating sales, branch stats update.

All transitions dispatch to `bookingStore.transition()` which calls the correct service, updates XP/streak/leaderboard/activity/notifications atomically, and returns animated diffs.

## XP, Levels, Streaks, Badges

- `lib/xpRules.ts` — pure functions: `xpForAction`, `levelFromXp`, `xpToNextLevel`, `checkBadgeUnlocks`.
- Levels: quadratic curve (`level = floor(sqrt(xp / 50))`), animated ring + bar.
- Streak: increments on first meaningful action of the day; flame icon pulses; breaks after 36h inactivity.
- Badges auto-unlock via `checkBadgeUnlocks(user, event)` after every transition: Fast Seller, Loan Master, Deal Closer, Customer Hero, Documentation Expert.

## Leaderboard & Branch Championship

- Employee leaderboard with Daily / Weekly / Monthly tabs, reorders with `motion.div layout` + spring on any XP delta.
- Branch championship: Bangalore, Mysore, Hubli, Mangalore — animated bars, rank badges, delivery counters.

## Daily Challenges

- Seeded per role: "Complete 3 bookings", "Approve 5 loans", "Deliver 2 vehicles" — +150 XP on completion.
- Progress derived from bookingStore selectors; animated ring + confetti-lite pulse on completion.

## Live Activity Feed

- `activityStore` holds a rolling buffer (last 40 events).
- New events slide in from top with stagger; auto-scroll pauses on hover.

## Notifications

- `notificationStore` + Sonner-style toaster in `__root.tsx` (custom styled). Types: booking_sent, loan_approved, xp_earned, badge_unlocked, challenge_completed.

## Demo Mode (critical for judging)

- `demoStore.enabled` toggle in top nav.
- `demoEngine` (interval-based, cleanup-safe) fires realistic events every 2–5s: creates bookings, approves random pending loans, completes deliveries, promotes branches, unlocks badges — routed through the *same* store actions so animations, XP, leaderboard, and feed all react identically to real interaction.
- Turning it off cleanly stops timers.

## Login / Role Select

- Full-bleed animated gradient + subtle grid; 3 large glass cards (Sales / Finance / Delivery) with role-specific icon, tagline, hover tilt, and gradient border sweep. Selecting one seeds a mock user and routes into `_app/<role>`.

## Pages

- **Sales Dashboard**: Hero (name, branch, level ring, XP bar, streak, rank) · Stat tiles (Today's Target, Bookings, Approved, Deliveries) · Daily Challenge · Booking Cards grid · Leaderboard · Live Feed · Motivation card · Employee of the Month.
- **Finance Dashboard**: Hero · Pending Requests count · Loan Queue cards (Approve / Reject / Request Docs) · Approval stats (approval rate ring, avg time) · Top Sales Executive card · Feed.
- **Delivery Dashboard**: Hero · Ready Vehicles queue · Today's Deliveries · Completed Deliveries counter · Complete Delivery cards · Branch standings · Feed.
- **Leaderboard**: full-screen split — employees left, branches right, filters top.
- **Profile**: badge grid, level journey, streak calendar heatmap.

## Head metadata

- `__root.tsx`: title "CarExpo — Dealership Performance OS", description, og:title/description, twitter card.
- Each route sets its own head().

## Technical details

- Framer Motion: `layout`, `AnimatePresence`, `useSpring` for XP counter, `useReducedMotion` guard.
- Animated background: CSS conic-gradient + two `motion.div` blurred orbs + faint SVG grid, all in `__root.tsx`.
- Tailwind v4 tokens defined in `src/styles.css` `@theme`: `--color-bg`, `--color-surface`, `--color-glass`, `--color-accent`, `--color-accent-2`, `--color-danger`, `--font-display`, `--font-body`, `--shadow-glow`, `--gradient-primary`.
- Fonts loaded via `<link>` in `__root.tsx` head (Space Grotesk + Inter) — never `@import` remote URLs in styles.css.
- Zustand stores use `subscribeWithSelector` middleware; selectors memoized to avoid re-renders during demo mode bursts.
- All services return `Promise<T>` with `await sleep(120)` to simulate latency — trivial to replace with `fetch`.
- Strong TS everywhere; no `any`. Shared types in `lib/types.ts`.
- Fully responsive down to tablet (1024px+ primary, graceful ≥768px). Mobile is out-of-scope per spec ("desktop and tablet").

## Out of scope (this build)

- Real auth / backend (mock only, backend-ready).
- Persistence across reload (in-memory; can add localStorage later trivially).
- Mobile-first layout below 768px.

## Deliverable

A single deploy where a judge can: click a role → see a live dashboard → toggle Demo Mode → watch bookings flow, XP tick, leaderboard reorder, badges unlock, toasts fire — all without any manual click. Then click through the workflow manually and see the exact same animations from real actions.
