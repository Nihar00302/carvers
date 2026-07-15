import { useAppStore } from "@/store/appStore";
import { bookingService, financeService, deliveryService } from "@/services/api";

let timer: ReturnType<typeof setInterval> | null = null;

export function startDemoEngine() {
  if (timer) return;
  timer = setInterval(tick, 2600);
}

export function stopDemoEngine() {
  if (timer) clearInterval(timer);
  timer = null;
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function tick() {
  const s = useAppStore.getState();
  const roll = Math.random();
  const salesUsers = Object.values(s.users).filter((u) => u.role === "sales");
  const financeUsers = Object.values(s.users).filter(
    (u) => u.role === "finance",
  );
  const deliveryUsers = Object.values(s.users).filter(
    (u) => u.role === "delivery",
  );

  const awaiting = s.bookings.filter((b) => b.status === "awaiting_finance");
  const ready = s.bookings.filter((b) => b.status === "invoice_ready");
  const created = s.bookings.filter((b) => b.status === "booking_created");

  // Prefer keeping the pipeline moving
  if (ready.length && roll < 0.4) {
    const b = pickRandom(ready);
    const d = pickRandom(deliveryUsers);
    if (b && d) deliveryService.complete(b.id, d.id);
    return;
  }
  if (awaiting.length && roll < 0.75) {
    const b = pickRandom(awaiting);
    const f = pickRandom(financeUsers);
    if (b && f) {
      const r = Math.random();
      if (r < 0.75) financeService.approve(b.id, f.id);
      else if (r < 0.9) financeService.requestDocs(b.id, f.id);
      else financeService.reject(b.id, f.id);
    }
    return;
  }
  if (created.length && roll < 0.9) {
    const b = pickRandom(created);
    if (b) bookingService.sendToFinance(b.id);
    return;
  }
  // Otherwise, create a new booking
  // Otherwise, create a new booking
const sales = pickRandom(salesUsers);

if (sales) {
  bookingService.create(sales.id).catch((err) => {
    console.error("Demo booking failed:", err);
  });
}
}