import type {
  ActivityEvent,
  Booking,
  Branch,
  BranchId,
  Challenge,
  User,
} from "./types";

export const BRANCHES: Branch[] = [
  { id: "bangalore", name: "Bangalore", xp: 12480, deliveries: 42 },
  { id: "mysore", name: "Mysore", xp: 10240, deliveries: 33 },
  { id: "hubli", name: "Hubli", xp: 8890, deliveries: 27 },
  { id: "mangalore", name: "Mangalore", xp: 7650, deliveries: 22 },
];

const AVATARS = [
  "linear-gradient(135deg,#4f8bff,#7c5cff)",
  "linear-gradient(135deg,#22d3ee,#3b82f6)",
  "linear-gradient(135deg,#a855f7,#ec4899)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
  "linear-gradient(135deg,#f472b6,#8b5cf6)",
  "linear-gradient(135deg,#38bdf8,#818cf8)",
  "linear-gradient(135deg,#facc15,#f97316)",
];

export const USERS: User[] = [
  mkUser("u1", "Rahul Sharma", "sales", "bangalore", 1240, 6),
  mkUser("u2", "Priya Nair", "sales", "bangalore", 980, 4),
  mkUser("u3", "Arjun Rao", "sales", "mysore", 1420, 8),
  mkUser("u4", "Neha Kapoor", "sales", "hubli", 720, 3),
  mkUser("u5", "Kiran Desai", "sales", "mangalore", 860, 5),
  mkUser("u6", "Ananya Iyer", "finance", "bangalore", 1580, 7),
  mkUser("u7", "Vikram Shetty", "finance", "mysore", 1120, 5),
  mkUser("u8", "Meera Joshi", "finance", "hubli", 840, 4),
  mkUser("u9", "Rohan Menon", "delivery", "bangalore", 1780, 9),
  mkUser("u10", "Divya Pillai", "delivery", "mysore", 1360, 6),
  mkUser("u11", "Aditya Reddy", "delivery", "hubli", 990, 4),
];

function mkUser(
  id: string,
  name: string,
  role: User["role"],
  branchId: BranchId,
  xp: number,
  streak: number,
): User {
  const idx = parseInt(id.slice(1), 10) % AVATARS.length;
  return {
    id,
    name,
    role,
    branchId,
    xp,
    streak,
    level: 1,
    badges: xp > 1500 ? ["deal_closer"] : [],
    avatarColor: AVATARS[idx],
    weeklyXp: Math.round(xp * 0.35),
    monthlyXp: xp,
    dailyXp: Math.round(xp * 0.12),
  };
}

export const CURRENT_USER_TEMPLATES: Record<User["role"], User> = {
  sales: mkUser("me-s", "You (Sales)", "sales", "bangalore", 420, 3),
  finance: mkUser("me-f", "You (Finance)", "finance", "bangalore", 560, 4),
  delivery: mkUser("me-d", "You (Delivery)", "delivery", "bangalore", 680, 4),
};

const VEHICLES = [
  ["Mercedes AMG GT", "63 S Coupe"],
  ["BMW M4", "Competition"],
  ["Audi RS7", "Sportback"],
  ["Porsche 911", "Carrera S"],
  ["Range Rover", "Autobiography"],
  ["Mercedes GLE", "450d 4MATIC"],
  ["BMW X5", "M Sport"],
  ["Audi Q7", "Premium Plus"],
  ["Lexus LX", "500d"],
  ["Volvo XC90", "Ultimate"],
];

const CUSTOMERS = [
  "Aakash Verma",
  "Sanjay Gupta",
  "Ritu Malhotra",
  "Karthik Menon",
  "Deepika Rao",
  "Manish Kulkarni",
  "Suresh Bhat",
  "Pooja Hegde",
  "Nikhil Chandra",
  "Latha Krishnan",
];

let seed = 1;
export function newBookingId() {
  return `bk-${Date.now().toString(36)}-${(seed++).toString(36)}`;
}

export function seedBookings(salesId: string): Booking[] {
  const now = Date.now();
  const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];
  const items: Booking[] = [];
  const statuses: Booking["status"][] = [
    "booking_created",
    "booking_created",
    "awaiting_finance",
    "awaiting_finance",
    "finance_approved",
    "invoice_ready",
    "invoice_ready",
    "docs_requested",
  ];
  statuses.forEach((s, i) => {
    const [make, variant] = pick(VEHICLES, i);
    items.push({
      id: newBookingId(),
      customer: pick(CUSTOMERS, i),
      vehicle: make,
      variant,
      amount: 3500000 + (i % 5) * 950000,
      status: s,
      salesId,
      branchId: "bangalore",
      createdAt: now - (i + 1) * 3_600_000,
      updatedAt: now - i * 1_600_000,
      timeline: [
        {
          at: now - (i + 1) * 3_600_000,
          status: "booking_created",
          actorId: salesId,
        },
      ],
    });
  });
  return items;
}

export function seedActivity(): ActivityEvent[] {
  const now = Date.now();
  return [
    {
      id: "a1",
      kind: "delivery_completed",
      actorName: "Rohan Menon",
      message: "delivered a Mercedes GLE to Karthik Menon",
      timestamp: now - 40_000,
      branchId: "bangalore",
      xp: 100,
    },
    {
      id: "a2",
      kind: "loan_approved",
      actorName: "Ananya Iyer",
      message: "approved a ₹42L loan for Ritu Malhotra",
      timestamp: now - 110_000,
      branchId: "bangalore",
      xp: 40,
    },
    {
      id: "a3",
      kind: "booking_sent",
      actorName: "Arjun Rao",
      message: "sent a BMW M4 booking to Finance",
      timestamp: now - 220_000,
      branchId: "mysore",
      xp: 20,
    },
    {
      id: "a4",
      kind: "badge_unlocked",
      actorName: "Priya Nair",
      message: "unlocked the Fast Seller badge",
      timestamp: now - 340_000,
      branchId: "bangalore",
    },
    {
      id: "a5",
      kind: "branch_promoted",
      message: "Bangalore reached #1 in the daily standings",
      timestamp: now - 460_000,
      branchId: "bangalore",
    },
  ];
}

export function seedChallenges(): Challenge[] {
  return [
    {
      id: "c-sales",
      role: "sales",
      title: "Send 3 bookings to Finance",
      target: 3,
      progress: 1,
      reward: 150,
      completed: false,
    },
    {
      id: "c-finance",
      role: "finance",
      title: "Approve 5 loans today",
      target: 5,
      progress: 2,
      reward: 150,
      completed: false,
    },
    {
      id: "c-delivery",
      role: "delivery",
      title: "Complete 2 deliveries",
      target: 2,
      progress: 0,
      reward: 150,
      completed: false,
    },
  ];
}

export function motivationQuote(): string {
  const quotes = [
    "Great salespeople aren't born. They ship one booking at a time.",
    "Every delivery is a customer's best day. Make it count.",
    "Approve fast. Approve fair. Approve like Ananya.",
    "The leaderboard doesn't lie. Your streak does the talking.",
    "Momentum compounds. Close the next one.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function randomVehicle(): [string, string] {
  return VEHICLES[Math.floor(Math.random() * VEHICLES.length)] as [
    string,
    string,
  ];
}

export function randomCustomer(): string {
  return CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
}