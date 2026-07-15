import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "ghost" | "danger" | "success";

export interface GradientButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const variants: Record<Variant, string> = {
  primary:
    "text-[oklch(0.1_0.02_260)] bg-[linear-gradient(120deg,var(--accent-cyan),var(--accent-blue)_55%,var(--accent-violet))] shadow-[0_10px_30px_-10px_oklch(0.72_0.17_245/0.6)]",
  ghost:
    "text-foreground border border-[var(--hairline)] bg-[oklch(1_0_0/0.03)] hover:bg-[oklch(1_0_0/0.06)]",
  danger:
    "text-white bg-[linear-gradient(120deg,oklch(0.7_0.22_15),oklch(0.6_0.24_25))]",
  success:
    "text-[oklch(0.1_0.02_260)] bg-[linear-gradient(120deg,oklch(0.86_0.16_150),oklch(0.72_0.17_170))]",
};

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors",
          size === "sm" && "text-xs px-3 py-1.5",
          size === "md" && "text-sm px-4 py-2",
          size === "lg" && "text-base px-5 py-2.5",
          variants[variant],
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    );
  },
);
GradientButton.displayName = "GradientButton";
