import { STATUS_COLOR, STATUS_LABEL } from "@/lib/format";
import type { BookingStatus } from "@/lib/types";

export function StatusPill({ status }: { status: BookingStatus }) {
  const color = STATUS_COLOR[status] ?? "var(--muted-foreground)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hairline)] px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase"
      style={{
        color,
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: color }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}
