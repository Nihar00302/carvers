import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function AnimatedNumber({
  value,
  className,
  format = (v) => Math.round(v).toLocaleString(),
}: {
  value: number;
  className?: string;
  format?: (v: number) => string;
}) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 });
  const display = useTransform(spring, format);
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  return <motion.span className={className}>{display}</motion.span>;
}
