import type { Booking } from "../types/index.js";

export const bookings: Booking[] = [
  {
    id: "BK101",
    customer: "Rohit Sharma",
    vehicle: "Mercedes C-Class",
    salesId: "S1",
    status: "booking_created",
  },

  {
    id: "BK102",
    customer: "Ananya Singh",
    vehicle: "GLA 220d",
    salesId: "S2",
    financeId: "F1",
    status: "awaiting_finance",
  },

  {
    id: "BK103",
    customer: "Vikram Rao",
    vehicle: "GLE",
    salesId: "S1",
    financeId: "F1",
    deliveryId: "D1",
    status: "invoice_ready",
  },
];