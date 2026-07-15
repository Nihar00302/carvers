export function formatINR(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export const STATUS_LABEL: Record<string, string> = {
  booking_created: "Booking Created",
  awaiting_finance: "Awaiting Finance",
  docs_requested: "Docs Requested",
  rejected: "Rejected",
  finance_approved: "Loan Approved",
  invoice_ready: "Invoice Ready",
  in_delivery: "In Delivery",
  completed: "Delivered",
};

export const STATUS_COLOR: Record<string, string> = {
  booking_created: "var(--accent-cyan)",
  awaiting_finance: "var(--accent-amber)",
  docs_requested: "var(--accent-violet)",
  rejected: "var(--accent-red)",
  finance_approved: "var(--accent-green)",
  invoice_ready: "var(--accent-blue)",
  in_delivery: "var(--accent-cyan)",
  completed: "var(--accent-green)",
};