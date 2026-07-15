import axios from "axios";
import { useAppStore } from "@/store/appStore";
import type { Booking, Role } from "@/lib/types";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const latency = (ms = 140) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(role: Role) {
    await latency(180);
    useAppStore.getState().login(role);
  },

  async logout() {
    await latency();
    useAppStore.getState().logout();
  },
};

export const bookingService = {
  async list(): Promise<Booking[]> {
    const res = await api.get("/bookings");

    useAppStore.getState().setBookings(res.data);

    return res.data;
  },

  async create(salesId: string) {
    await api.post("/bookings", {
  customer: "New Customer",
  vehicle: "Mercedes C-Class",
  amount: 8500000,
  salesId,
});

    const bookings = await this.list();

    useAppStore.getState().setBookings(bookings);
  },

  async sendToFinance(id: string) {
    await api.post(`/bookings/${id}/send-finance`);

    const bookings = await this.list();

    useAppStore.getState().setBookings(bookings);
  },
};

export const financeService = {
  async approve(id: string, financeId: string) {
    await latency();
    useAppStore.getState().approveLoan(id, financeId);
  },

  async reject(id: string, financeId: string) {
    await latency();
    useAppStore.getState().rejectLoan(id, financeId);
  },

  async requestDocs(id: string, financeId: string) {
    await latency();
    useAppStore.getState().requestDocs(id, financeId);
  },
};

export const deliveryService = {
  async complete(id: string, deliveryId: string) {
    await latency();
    useAppStore.getState().completeDelivery(id, deliveryId);
  },
};

export const leaderboardService = {
  async top() {
    await latency();
    return Object.values(useAppStore.getState().users);
  },
};

export const notificationService = {
  async markAllRead() {
    await latency();
    useAppStore.getState().markAllRead();
  },
};