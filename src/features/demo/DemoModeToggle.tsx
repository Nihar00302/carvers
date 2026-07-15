import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";
import { PlayCircle, PauseCircle } from "lucide-react";
import { useEffect } from "react";
import { startDemoEngine, stopDemoEngine } from "./demoEngine";

export function DemoModeToggle() {
  const demo = useAppStore((s) => s.demoMode);
  const setDemoMode = useAppStore((s) => s.setDemoMode);

  useEffect(() => {
    if (demo) startDemoEngine();
    else stopDemoEngine();
    return () => stopDemoEngine();
  }, [demo]);

  return (
    <motion.button
      onClick={() => setDemoMode(!demo)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        demo
          ? "border-[color:var(--accent-green)] bg-[color-mix(in_oklab,var(--accent-green)_18%,transparent)] text-[color:var(--accent-green)]"
          : "border-[var(--hairline)] bg-[oklch(1_0_0/0.03)] text-muted-foreground hover:text-foreground"
      }`}
    >
      {demo ? (
        <>
          <PauseCircle size={14} /> Demo running
          <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[color:var(--accent-green)] animate-pulse" />
        </>
      ) : (
        <>
          <PlayCircle size={14} /> Start demo mode
        </>
      )}
    </motion.button>
  );
}
