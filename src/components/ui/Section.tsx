"use client";

import React from "react";
import { motion } from "framer-motion";

export function Section({
  id,
  num,
  title,
  subtitle,
  children,
}: {
  id: string;
  num: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className="scroll-mt-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Section header */}
      <div className="mb-20">
        <div className="flex items-center gap-6 mb-8 group">
          <div className="flex flex-col">
            <span className="font-mono text-2xs tracking-[0.3em] text-interactive-brand-default/50 uppercase mb-1">
              Section
            </span>
            <span className="font-display text-2xl font-bold text-text-disabled group-hover:text-interactive-brand-default/80 transition-colors">
              {num}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-border-subtle via-border-subtle to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full border border-border-subtle" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold text-text-primary tracking-tightest mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-md text-text-secondary leading-relaxed font-light">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-border-subtle/50 via-transparent to-transparent hidden xl:block" />
        {children}
      </div>
    </motion.section>
  );
}
