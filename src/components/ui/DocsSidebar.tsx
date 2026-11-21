"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  num: string;
}

export interface LayerItem {
  href: string;
  label: string;
  num: string;
  active?: boolean;
}

const LAYERS: LayerItem[] = [
  { href: "/designsystem/tokens",    label: "Design Tokens",    num: "01" },
  { href: "/designsystem/semantic",  label: "Semantic Intent",  num: "02" },
  { href: "/designsystem/motion",    label: "Motion System",    num: "03" },
  { href: "/designsystem/atoms",     label: "Atoms Gallery",    num: "04" },
  { href: "/designsystem/molecules", label: "Molecules Gallery", num: "05" },
];

interface DocsSidebarProps {
  currentLayer: string;
  items: NavItem[];
}

export function DocsSidebar({ currentLayer, items }: DocsSidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -70% 0%", // Trigger when section is in the upper part of the viewport
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-0 h-screen overflow-y-auto border-r border-white/[0.04] bg-surface-page/50 backdrop-blur-xl px-6 py-12 scrollbar-none">
      <div className="space-y-12">
        {/* Logo / Home */}
        <div className="flex items-center gap-3 px-2 mb-16">
          <div className="w-6 h-6 rounded-lg bg-interactive-brand-default flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-text-primary">Token Docs</span>
        </div>

        {/* Global Layers */}
        <div className="space-y-4">
          <h4 className="font-mono text-[10px] tracking-[0.3em] text-text-disabled uppercase px-2 mb-6">Architectural Layers</h4>
          <nav className="space-y-1">
            {LAYERS.map((layer) => {
              const isActive = currentLayer === layer.href;
              return (
                <a
                  key={layer.href}
                  href={layer.href}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-interactive-brand-default/10 border border-interactive-brand-default/20 text-text-primary" 
                      : "text-text-muted hover:bg-white/5 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "font-mono text-[9px] transition-colors",
                      isActive ? "text-text-brand" : "text-text-disabled group-hover:text-text-brand"
                    )}>
                      {layer.num}
                    </span>
                    <span className="text-xs font-semibold tracking-tight">{layer.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveLayer"
                      className="w-1 h-1 rounded-full bg-interactive-brand-default shadow-[0_0_8px_rgba(38,201,201,0.6)]"
                    />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Current Page Sections */}
        <div className="space-y-4">
          <h4 className="font-mono text-[10px] tracking-[0.3em] text-text-disabled uppercase px-2 mb-6">On this page</h4>
          <nav className="space-y-0.5 relative">
            {items.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  <span className={cn(
                    "font-mono text-[9px] transition-colors shrink-0",
                    isActive ? "text-text-brand" : "text-text-disabled group-hover:text-text-brand"
                  )}>
                    {item.num}
                  </span>
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveSection"
                      className="absolute left-0 w-0.5 h-4 bg-interactive-brand-default rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
