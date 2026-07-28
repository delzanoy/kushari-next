"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const DOC_SEQUENCE = [
  { href: "/designsystem/tokens", layer: "Layer 1", title: "Design Tokens" },
  { href: "/designsystem/semantic", layer: "Layer 2", title: "Semantic Intent" },
  { href: "/designsystem/motion", layer: "Layer 3", title: "Motion System" },
  { href: "/designsystem/atoms",     layer: "Layer 4", title: "Atoms Gallery" },
  { href: "/designsystem/molecules", layer: "Layer 5", title: "Molecules Gallery" },
];

export function DocNav({ current }: { current: string }) {
  const idx = DOC_SEQUENCE.findIndex((p) => p.href === current);
  const prev = idx > 0 ? DOC_SEQUENCE[idx - 1] : null;
  const next = idx < DOC_SEQUENCE.length - 1 ? DOC_SEQUENCE[idx + 1] : null;

  return (
    <section className="pt-32 pb-48">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row gap-6"
      >
        {prev && (
          <a
            href={prev.href}
            className="group relative flex-1 block p-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/10 hover:bg-interactive-brand-tonal-bg/30 hover:border-interactive-brand-default/20 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(38,201,201,0.04)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-interactive-brand-default/30 group-hover:bg-interactive-brand-default/10 transition-all duration-500 shrink-0">
                <ArrowLeft className="w-4 h-4 text-text-muted group-hover:text-text-brand transition-colors" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-2xs tracking-[0.2em] text-text-muted uppercase block">{prev.layer}</span>
                <span className="font-display text-lg font-bold text-text-primary tracking-tight block">{prev.title}</span>
              </div>
            </div>
          </a>
        )}

        {next && (
          <a
            href={next.href}
            className="group relative flex-1 block p-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/10 hover:bg-interactive-brand-tonal-bg/30 hover:border-interactive-brand-default/20 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(38,201,201,0.04)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-end gap-6">
              <div className="space-y-1 text-right">
                <span className="font-mono text-2xs tracking-[0.2em] text-text-muted uppercase block">{next.layer}</span>
                <span className="font-display text-lg font-bold text-text-primary tracking-tight block">{next.title}</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-interactive-brand-default/30 group-hover:bg-interactive-brand-default/10 transition-all duration-500 shrink-0">
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-text-brand transition-colors" />
              </div>
            </div>
          </a>
        )}
      </motion.div>
    </section>
  );
}
