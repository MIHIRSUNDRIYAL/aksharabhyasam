"use client";

import { motion } from "framer-motion";
import type { FeedbackTier } from "@/components/tracing/tracingConfig";

const TIER_STYLES: Record<FeedbackTier, string> = {
  great: "bg-green-100 text-green-800 border-green-300",
  good: "bg-amber-100 text-amber-800 border-amber-300",
  tryAgain: "bg-rose-100 text-rose-800 border-rose-300",
};

export function FeedbackBanner({
  tier,
  message,
}: {
  tier: FeedbackTier;
  message: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`mt-4 rounded-2xl border-2 px-5 py-3 text-center font-heading text-lg font-bold ${TIER_STYLES[tier]}`}
    >
      {tier === "great" ? (
        <motion.span
          initial={{ scale: 0.6, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="inline-block"
        >
          {message}
        </motion.span>
      ) : (
        message
      )}
    </motion.div>
  );
}
