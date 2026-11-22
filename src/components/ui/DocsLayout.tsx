"use client";

import React from "react";
import { DocsSidebar, NavItem } from "./DocsSidebar";
import { motion, useScroll, useSpring } from "framer-motion";

interface DocsLayoutProps {
  currentLayer: string;
  items: NavItem[];
  children: React.ReactNode;
}

export function DocsLayout({ currentLayer, items, children }: DocsLayoutProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-surface-page text-text-primary relative selection:bg-cyan-500/30">
      {/* Global Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-interactive-brand-default origin-left z-[70]"
        style={{ scaleX }}
      />

      <div className="flex">
        {/* Fixed Sidebar */}
        <DocsSidebar currentLayer={currentLayer} items={items} />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <main className="max-w-[1040px] px-8 lg:px-16 py-12 mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
