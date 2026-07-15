export type Role = "sales" | "finance" | "delivery";

export type BookingStatus =
  | "booking_created"
  | "awaiting_finance"
  | "docs_requested"
  | "rejected"
  | "finance_approved"
  | "invoice_ready"
  | "in_delivery"
  | "completed";

export type BranchId = "bangalore" | "mysore" | "hubli" | "mangalore";

export interface User {
  id: string;
  name: string;
  role: Role;
  branchId: BranchId;
  level: number;
  xp: number;
  streak: number;
  badges: BadgeId[];
  avatarColor: string;
  weeklyXp: number;
  monthlyXp: number;
  dailyXp: number;
}

export interface Branch {
  id: BranchId;
  name: string;
  xp: number;
  deliveries: number;
}

export type BadgeId =
  | "fast_seller"
  | "loan_master"
  | "deal_closer"
  | "customer_hero"
  | "documentation_expert";

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
}

export interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  variant: string;
  amount: number;
  status: BookingStatus;
  salesId: string;
  financeId?: string;
  deliveryId?: string;
  createdAt: number;
  updatedAt: number;
  branchId: BranchId;
  timeline: StatusEvent[];
}

export interface StatusEvent {
  at: number;
  status: BookingStatus;
  actorId?: string;
  note?: string;
}

export type ActivityKind =
  | "booking_created"
  | "booking_sent"
  | "loan_approved"
  | "loan_rejected"
  | "docs_requested"
  | "delivery_completed"
  | "badge_unlocked"
  | "challenge_completed"
  | "branch_promoted";

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  actorId?: string;
  actorName?: string;
  message: string;
  timestamp: number;
  branchId?: BranchId;
  xp?: number;
}

export interface Challenge {
  id: string;
  role: Role;
  title: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
}

export type NotificationKind =
  | "booking_sent"
  | "loan_approved"
  | "loan_rejected"
  | "docs_requested"
  | "xp_earned"
  | "badge_unlocked"
  | "challenge_completed"
  | "delivery_ready"
  | "delivered";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  timestamp: number;
  read: boolean;
}