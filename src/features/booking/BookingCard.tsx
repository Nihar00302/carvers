import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatINR, formatRelativeTime } from "@/lib/format";
import type { Booking, Role } from "@/lib/types";
import { ArrowRight, Car, User2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  booking: Booking;
  role: Role;
  onAction?: (id: string) => void;
  onReject?: (id: string) => void;
  onDocs?: (id: string) => void;
}

const STEPS: Booking["status"][] = [
  "booking_created",
  "awaiting_finance",
  "finance_approved",
  "invoice_ready",
  "completed",
];

function progressRatio(status: Booking["status"]): number {
  const idx = STEPS.indexOf(status);
  if (idx < 0) return 0.25;
  return (idx + 1) / STEPS.length;
}

function actionLabel(role: Role, status: Booking["status"]): string | null {
  if (role === "sales") {
    if (status === "booking_created") return "Send to Finance";
    if (status === "docs_requested") return "Resend to Finance";
    return null;
  }
  if (role === "finance") {
    if (status === "awaiting_finance") return "Approve loan";
    return null;
  }
  if (role === "delivery") {
    if (status === "invoice_ready") return "Complete delivery";
    return null;
  }
  return null;
}

export function BookingCard({ booking, role, onAction, onReject, onDocs }: Props) {
  const label = actionLabel(role, booking.status);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
    >
      <GlassCard className="p-5 group">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Car size={14} />
              <span className="uppercase tracking-widest">
                {booking.vehicle}
              </span>
            </div>
            <div className="mt-1 font-display text-lg">{booking.variant}</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <User2 size={14} />
              {booking.customer}
            </div>
          </div>
          <div className="text-right">
            <StatusPill status={booking.status} />
            <div className="mt-2 font-display text-lg text-gradient">
              {formatINR(booking.amount ?? 0)}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-1 rounded-full overflow-hidden bg-[oklch(1_0_0/0.06)]">
            <motion.div
              className="h-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-blue))]"
              initial={false}
              animate={{ width: `${progressRatio(booking.status) * 100}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 22 }}
            />
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            Updated {formatRelativeTime(booking.updatedAt)}
          </div>
        </div>

        {label && (
          <div className="mt-4 flex items-center gap-2">
            <GradientButton
              size="sm"
              onClick={() => onAction?.(booking.id)}
              className="flex-1"
            >
              {label} <ArrowRight size={14} />
            </GradientButton>
            {role === "finance" && booking.status === "awaiting_finance" && (
              <>
                <GradientButton
                  size="sm"
                  variant="ghost"
                  onClick={() => onDocs?.(booking.id)}
                >
                  Docs
                </GradientButton>
                <GradientButton
                  size="sm"
                  variant="ghost"
                  onClick={() => onReject?.(booking.id)}
                >
                  Reject
                </GradientButton>
              </>
            )}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
