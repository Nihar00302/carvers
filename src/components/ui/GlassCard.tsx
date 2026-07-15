import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  strong?: boolean;
  glow?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, strong, glow, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          strong ? "glass-strong" : "glass",
          "rounded-2xl relative overflow-hidden",
          glow &&
            "shadow-[0_0_0_1px_var(--hairline),0_30px_80px_-30px_oklch(0.72_0.17_245/0.35)]",
          className,
        )}
        {...props}
      />
    );
  },
);
GlassCard.displayName = "GlassCard";
