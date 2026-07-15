import type { BadgeId, Role, User } from "./types";

export const XP = {
  booking_created: 20,
  finance_approved: 40,
  delivery_completed: 100,
  delivery_sales_bonus: 30,
  challenge_bonus: 150,
} as const;

// Level curve: quadratic. Level N requires 50 * N^2 XP.
export function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 50)) + 1);
}

export function xpForLevel(level: number): number {
  return 50 * Math.pow(level - 1, 2);
}

export function levelProgress(xp: number): {
  level: number;
  intoLevel: number;
  levelSpan: number;
  ratio: number;
  nextLevelXp: number;
} {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - base;
  const into = xp - base;
  return {
    level,
    intoLevel: into,
    levelSpan: span,
    ratio: Math.min(1, Math.max(0, into / span)),
    nextLevelXp: next,
  };
}

export interface BadgeCriteria {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  roles: Role[];
  test: (user: User, stats: RoleStats) => boolean;
}

export interface RoleStats {
  bookingsCreated: number;
  loansApproved: number;
  loansRejected: number;
  docsRequested: number;
  deliveriesCompleted: number;
}

export const BADGES: BadgeCriteria[] = [
  {
    id: "fast_seller",
    name: "Fast Seller",
    description: "Create 5 bookings",
    icon: "Zap",
    roles: ["sales"],
    test: (_u, s) => s.bookingsCreated >= 5,
  },
  {
    id: "deal_closer",
    name: "Deal Closer",
    description: "Reach 500 XP",
    icon: "Trophy",
    roles: ["sales", "finance", "delivery"],
    test: (u) => u.xp >= 500,
  },
  {
    id: "loan_master",
    name: "Loan Master",
    description: "Approve 5 loans",
    icon: "BadgeCheck",
    roles: ["finance"],
    test: (_u, s) => s.loansApproved >= 5,
  },
  {
    id: "documentation_expert",
    name: "Documentation Expert",
    description: "Request docs 3 times",
    icon: "FileCheck",
    roles: ["finance"],
    test: (_u, s) => s.docsRequested >= 3,
  },
  {
    id: "customer_hero",
    name: "Customer Hero",
    description: "Deliver 3 vehicles",
    icon: "Sparkles",
    roles: ["delivery"],
    test: (_u, s) => s.deliveriesCompleted >= 3,
  },
];

export function checkBadgeUnlocks(
  user: User,
  stats: RoleStats,
): BadgeId[] {
  const newly: BadgeId[] = [];
  for (const b of BADGES) {
    if (user.badges.includes(b.id)) continue;
    if (!b.roles.includes(user.role)) continue;
    if (b.test(user, stats)) newly.push(b.id);
  }
  return newly;
}

export function badgeById(id: BadgeId): BadgeCriteria | undefined {
  return BADGES.find((b) => b.id === id);
}