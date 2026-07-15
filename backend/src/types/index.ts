export type Role = "sales" | "finance" | "delivery";

export type BookingStatus =
  | "booking_created"
  | "awaiting_finance"
  | "finance_approved"
  | "invoice_ready"
  | "completed";

export interface User {
  id: string;
  name: string;
  role: Role;
  branch: string;
  xp: number;
  level: number;
  streak: number;
}

export interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  salesId: string;
  financeId?: string;
  deliveryId?: string;

  status: BookingStatus;
}