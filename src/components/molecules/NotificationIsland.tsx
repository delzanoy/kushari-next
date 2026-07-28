"use client";

import React from "react";
import { motion } from "framer-motion";

interface NotificationIslandProps {
  title: React.ReactNode;
  titleAction?: React.ReactNode;
  mainActions?: React.ReactNode;
}

export function NotificationIsland({ title, titleAction, mainActions }: NotificationIslandProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-2 pl-6 rounded-2xl bg-[var(--color-surface-notification)] border border-[var(--color-border-subtle)] shadow-[0_12px_24px_-4px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <span className="text-[var(--color-text-primary)] font-medium text-sm tracking-wide">
          {title}
        </span>
        {titleAction}
      </div>
      
      {mainActions && (
        <div className="flex items-center gap-2 pl-4 border-l border-[var(--color-border-subtle)]">
          {mainActions}
        </div>
      )}
    </motion.div>
  );
}
