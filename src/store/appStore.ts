import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  ActivityEvent,
  AppNotification,
  Booking,
  BookingStatus,
  Branch,
  Challenge,
  Role,
  User,
} from "@/lib/types";
import {
  BRANCHES,
  CURRENT_USER_TEMPLATES,
  USERS,
  newBookingId,
  randomCustomer,
  randomVehicle,
  seedActivity,
  seedBookings,
  seedChallenges,
} from "@/lib/seedData";
import {
  BADGES,
  XP,
  checkBadgeUnlocks,
  levelFromXp,
  type RoleStats,
} from "@/lib/xpRules";

interface RoleStatsMap {
  [userId: string]: RoleStats;
}

interface AppState {
  currentUserId: string | null;
  users: Record<string, User>;
  branches: Record<string, Branch>;
  bookings: Booking[];
  activity: ActivityEvent[];
  notifications: AppNotification[];
  challenges: Challenge[];
  stats: RoleStatsMap;
  demoMode: boolean;

  // Auth
  login: (role: Role) => void;
  logout: () => void;

  // Booking transitions
  createBooking: (salesId: string, overrides?: Partial<Booking>) => Booking;
  sendToFinance: (bookingId: string) => void;
  approveLoan: (bookingId: string, financeId: string) => void;
  setBookings: (bookings: Booking[]) => void;
  rejectLoan: (bookingId: string, financeId: string) => void;
  requestDocs: (bookingId: string, financeId: string) => void;
  completeDelivery: (bookingId: string, deliveryId: string) => void;

  // Notifications
  pushNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markAllRead: () => void;

  // Demo
  setDemoMode: (on: boolean) => void;
}

const emptyStats = (): RoleStats => ({
  bookingsCreated: 0,
  loansApproved: 0,
  loansRejected: 0,
  docsRequested: 0,
  deliveriesCompleted: 0,
});

function toRecord<T extends { id: string }>(arr: T[]): Record<string, T> {
  return arr.reduce<Record<string, T>>((acc, u) => {
    acc[u.id] = u;
    return acc;
  }, {});
}

function humanRelBooking(b: Booking): string {
  return `${b.vehicle} ${b.variant} • ${b.customer}`;
}

let notifSeq = 0;
let actSeq = 0;

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    currentUserId: null,
    users: toRecord(USERS),
    branches: toRecord(BRANCHES),
    bookings: [],
    activity: seedActivity(),
    notifications: [],
    challenges: seedChallenges(),
    stats: {},
    demoMode: false,

    login(role) {
      const template = { ...CURRENT_USER_TEMPLATES[role] };
      const users = { ...get().users, [template.id]: template };
      const stats = { ...get().stats, [template.id]: emptyStats() };
      // seed a few bookings owned by the sales user so the workflow has content
      const salesId =
        role === "sales"
          ? template.id
          : Object.values(users).find((u) => u.role === "sales")?.id ?? "u1";
      const bookings = get().bookings.length
        ? get().bookings
        : seedBookings(salesId);
      set({
        currentUserId: template.id,
        users,
        stats,
        bookings,
      });
    },

    logout() {
      set({ currentUserId: null });
    },

    createBooking(salesId, overrides) {
      const [make, variant] = randomVehicle();
      const b: Booking = {
        id: newBookingId(),
        customer: randomCustomer(),
        vehicle: make,
        variant,
        amount: 3_500_000 + Math.floor(Math.random() * 4_000_000),
        status: "booking_created",
        salesId,
        branchId: get().users[salesId]?.branchId ?? "bangalore",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        timeline: [{ at: Date.now(), status: "booking_created", actorId: salesId }],
        ...overrides,
      };
      set((s) => ({ bookings: [b, ...s.bookings] }));
      pushActivity({
        kind: "booking_created",
        actorId: salesId,
        actorName: get().users[salesId]?.name,
        message: `created a booking for ${humanRelBooking(b)}`,
        branchId: b.branchId,
      });
      return b;
    },

    sendToFinance(bookingId) {
      const b = get().bookings.find((x) => x.id === bookingId);
      if (!b) return;
      updateBooking(bookingId, "awaiting_finance", b.salesId);
      awardXp(b.salesId, XP.booking_created, "booking_created");
      bumpChallenge("sales");
      pushActivity({
        kind: "booking_sent",
        actorId: b.salesId,
        actorName: get().users[b.salesId]?.name,
        message: `sent ${humanRelBooking(b)} to Finance`,
        branchId: b.branchId,
        xp: XP.booking_created,
      });
      pushNotif({
        kind: "booking_sent",
        title: "Booking sent to Finance",
        body: humanRelBooking(b),
      });
      bumpStat(b.salesId, "bookingsCreated");
      maybeUnlockBadges(b.salesId);
    },

    approveLoan(bookingId, financeId) {
      const b = get().bookings.find((x) => x.id === bookingId);
      if (!b) return;
      set((s) => ({
        bookings: s.bookings.map((x) =>
          x.id === bookingId ? { ...x, financeId } : x,
        ),
      }));
      updateBooking(bookingId, "invoice_ready", financeId, "Loan approved");
      awardXp(financeId, XP.finance_approved, "finance_approved");
      bumpChallenge("finance");
      pushActivity({
        kind: "loan_approved",
        actorId: financeId,
        actorName: get().users[financeId]?.name,
        message: `approved loan for ${humanRelBooking(b)}`,
        branchId: b.branchId,
        xp: XP.finance_approved,
      });
      pushNotif({
        kind: "loan_approved",
        title: "Loan approved",
        body: humanRelBooking(b),
      });
      bumpStat(financeId, "loansApproved");
      maybeUnlockBadges(financeId);
    },

    rejectLoan(bookingId, financeId) {
      const b = get().bookings.find((x) => x.id === bookingId);
      if (!b) return;
      updateBooking(bookingId, "rejected", financeId, "Loan rejected");
      pushActivity({
        kind: "loan_rejected",
        actorId: financeId,
        actorName: get().users[financeId]?.name,
        message: `rejected loan for ${humanRelBooking(b)}`,
        branchId: b.branchId,
      });
      pushNotif({
        kind: "loan_rejected",
        title: "Loan rejected",
        body: humanRelBooking(b),
      });
      bumpStat(financeId, "loansRejected");
    },

    requestDocs(bookingId, financeId) {
      const b = get().bookings.find((x) => x.id === bookingId);
      if (!b) return;
      updateBooking(bookingId, "docs_requested", financeId, "Docs requested");
      pushActivity({
        kind: "docs_requested",
        actorId: financeId,
        actorName: get().users[financeId]?.name,
        message: `requested more docs for ${humanRelBooking(b)}`,
        branchId: b.branchId,
      });
      pushNotif({
        kind: "docs_requested",
        title: "Documents requested",
        body: humanRelBooking(b),
      });
      bumpStat(financeId, "docsRequested");
      maybeUnlockBadges(financeId);
    },

    completeDelivery(bookingId, deliveryId) {
      const b = get().bookings.find((x) => x.id === bookingId);
      if (!b) return;
      set((s) => ({
        bookings: s.bookings.map((x) =>
          x.id === bookingId ? { ...x, deliveryId } : x,
        ),
      }));
      updateBooking(bookingId, "completed", deliveryId, "Delivered");
      awardXp(deliveryId, XP.delivery_completed, "delivery_completed");
      awardXp(b.salesId, XP.delivery_sales_bonus, "delivery_completed");
      bumpChallenge("delivery");
      pushActivity({
        kind: "delivery_completed",
        actorId: deliveryId,
        actorName: get().users[deliveryId]?.name,
        message: `delivered ${humanRelBooking(b)}`,
        branchId: b.branchId,
        xp: XP.delivery_completed,
      });
      pushNotif({
        kind: "delivered",
        title: "Vehicle delivered",
        body: humanRelBooking(b),
      });
      // branch stats update
      set((s) => {
        const branch = s.branches[b.branchId];
        if (!branch) return {};
        return {
          branches: {
            ...s.branches,
            [b.branchId]: {
              ...branch,
              xp: branch.xp + XP.delivery_completed,
              deliveries: branch.deliveries + 1,
            },
          },
        };
      });
      bumpStat(deliveryId, "deliveriesCompleted");
      maybeUnlockBadges(deliveryId);
    },

    pushNotification(n) {
      pushNotif(n);
    },

    markAllRead() {
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      }));
    },
    setBookings(bookings) {
      set({ bookings });
    },

    setDemoMode(on) {
      set({ demoMode: on });
    },
  })),
);

// ----- helpers (close over store) -----
function updateBooking(
  id: string,
  status: BookingStatus,
  actorId?: string,
  note?: string,
) {
  const s = useAppStore.getState();
  useAppStore.setState({
    bookings: s.bookings.map((b) =>
      b.id === id
        ? {
            ...b,
            status,
            updatedAt: Date.now(),
            timeline: [...b.timeline, { at: Date.now(), status, actorId, note }],
          }
        : b,
    ),
  });
}

function awardXp(userId: string, amount: number, _reason: string) {
  const s = useAppStore.getState();
  const u = s.users[userId];
  if (!u) return;
  const nextXp = u.xp + amount;
  const nextLevel = levelFromXp(nextXp);
  const branch = s.branches[u.branchId];
  useAppStore.setState({
    users: {
      ...s.users,
      [userId]: {
        ...u,
        xp: nextXp,
        level: nextLevel,
        dailyXp: u.dailyXp + amount,
        weeklyXp: u.weeklyXp + amount,
        monthlyXp: u.monthlyXp + amount,
      },
    },
    branches: branch
      ? {
          ...s.branches,
          [u.branchId]: { ...branch, xp: branch.xp + amount },
        }
      : s.branches,
  });
  // XP toast for current user
  if (s.currentUserId === userId) {
    pushNotif({
      kind: "xp_earned",
      title: `+${amount} XP`,
      body: reasonLabel(_reason),
    });
  }
}

function reasonLabel(r: string): string {
  switch (r) {
    case "booking_created":
      return "Booking sent to Finance";
    case "finance_approved":
      return "Loan approved";
    case "delivery_completed":
      return "Vehicle delivered";
    default:
      return "Great work";
  }
}

function bumpStat(userId: string, key: keyof RoleStats) {
  const s = useAppStore.getState();
  const cur = s.stats[userId] ?? emptyStats();
  useAppStore.setState({
    stats: { ...s.stats, [userId]: { ...cur, [key]: cur[key] + 1 } },
  });
}

function bumpChallenge(role: Role) {
  const s = useAppStore.getState();
  const challenges = s.challenges.map((c) => {
    if (c.role !== role || c.completed) return c;
    const next = Math.min(c.target, c.progress + 1);
    const done = next >= c.target;
    if (done && !c.completed) {
      // reward current user if same role
      const cu = s.currentUserId;
      if (cu && s.users[cu]?.role === role) {
        // schedule after this update by using setTimeout(0)
        setTimeout(() => {
          awardXp(cu, XP.challenge_bonus, "challenge");
          pushNotif({
            kind: "challenge_completed",
            title: "Challenge complete!",
            body: `${c.title} — +${c.reward} XP`,
          });
          pushActivity({
            kind: "challenge_completed",
            actorName: s.users[cu]?.name,
            message: `completed challenge: ${c.title}`,
            xp: c.reward,
          });
        }, 0);
      }
    }
    return { ...c, progress: next, completed: done };
  });
  useAppStore.setState({ challenges });
}

function maybeUnlockBadges(userId: string) {
  const s = useAppStore.getState();
  const u = s.users[userId];
  if (!u) return;
  const stats = s.stats[userId] ?? emptyStats();
  const unlocked = checkBadgeUnlocks(u, stats);
  if (!unlocked.length) return;
  useAppStore.setState({
    users: {
      ...s.users,
      [userId]: { ...u, badges: [...u.badges, ...unlocked] },
    },
  });
  for (const bid of unlocked) {
    const badge = BADGES.find((b) => b.id === bid);
    if (!badge) continue;
    pushActivity({
      kind: "badge_unlocked",
      actorId: userId,
      actorName: u.name,
      message: `unlocked the ${badge.name} badge`,
      branchId: u.branchId,
    });
    if (s.currentUserId === userId) {
      pushNotif({
        kind: "badge_unlocked",
        title: `Badge unlocked: ${badge.name}`,
        body: badge.description,
      });
    }
  }
}

function pushActivity(
  a: Omit<ActivityEvent, "id" | "timestamp"> & { timestamp?: number },
) {
  const ev: ActivityEvent = {
    id: `a-${Date.now().toString(36)}-${actSeq++}`,
    timestamp: a.timestamp ?? Date.now(),
    ...a,
  };
  useAppStore.setState((s) => ({
    activity: [ev, ...s.activity].slice(0, 40),
  }));
}

function pushNotif(n: Omit<AppNotification, "id" | "timestamp" | "read">) {
  const notif: AppNotification = {
    id: `n-${Date.now().toString(36)}-${notifSeq++}`,
    timestamp: Date.now(),
    read: false,
    ...n,
  };
  useAppStore.setState((s) => ({
    notifications: [notif, ...s.notifications].slice(0, 25),
  }));
}

// ---- selectors ----
export function useCurrentUser(): User | null {
  return useAppStore((s) =>
    s.currentUserId ? s.users[s.currentUserId] ?? null : null,
  );
}

export function leaderboardByRole(
  users: Record<string, User>,
  scope: "dailyXp" | "weeklyXp" | "monthlyXp" = "monthlyXp",
): User[] {
  return Object.values(users)
    .filter((u) => !u.id.startsWith("me-") || true)
    .sort((a, b) => b[scope] - a[scope]);
}

export function branchRanking(
  branches: Record<string, Branch>,
): Branch[] {
  return Object.values(branches).sort((a, b) => b.xp - a.xp);
}