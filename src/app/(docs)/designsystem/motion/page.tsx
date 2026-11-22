"use client";

import { useState, useCallback } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Wind,
  MoveUp,
  Maximize2,
  LayoutGrid,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
  Eye,
  Play,
  RotateCcw,
  MousePointer2,
  Timer,
  Activity,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DocNav } from "@/components/ui/DocNav";
import { DocsLayout } from "@/components/ui/DocsLayout";
import { transitions, variants, interactions, motionProps } from "@/lib/motion";
import { PRIMITIVES } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/* ============================================================
   /motion — Motion System Archive
   Token v2 — Layer 3 Visual Reference

   A gallery-grade documentation of every transition preset,
   variant, micro-interaction, and composed motion prop
   in the system.
   ============================================================ */

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "transitions", label: "Transitions", num: "01" },
  { id: "spring", label: "Springs", num: "02" },
  { id: "variants", label: "Variants", num: "03" },
  { id: "interactions", label: "Interactions", num: "04" },
  { id: "composed", label: "Composed", num: "05" },
  { id: "stagger", label: "Stagger", num: "06" },
];

const TRANSITION_PRESETS = [
  {
    name: "fast",
    duration: "150ms",
    easing: "ease-decelerate",
    use: "Micro interactions, hover states",
    config: transitions.fast,
    bezier: [0, 0, 0.2, 1] as [number, number, number, number],
  },
  {
    name: "standard",
    duration: "200ms",
    easing: "ease-standard",
    use: "Default transitions",
    config: transitions.standard,
    bezier: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  {
    name: "smooth",
    duration: "300ms",
    easing: "ease-decelerate",
    use: "Slide, expand, collapse",
    config: transitions.smooth,
    bezier: [0, 0, 0.2, 1] as [number, number, number, number],
  },
  {
    name: "gentle",
    duration: "500ms",
    easing: "ease-standard",
    use: "Page content, reveals",
    config: transitions.gentle,
    bezier: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  {
    name: "slow",
    duration: "800ms",
    easing: "ease-standard",
    use: "Dramatic reveals, hero",
    config: transitions.slow,
    bezier: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  {
    name: "page",
    duration: "500ms",
    easing: "ease-standard",
    use: "Route transitions",
    config: transitions.page,
    bezier: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
];

const SPRING_PRESETS = [
  {
    name: "spring",
    stiffness: 500,
    damping: 30,
    mass: 0.7,
    use: "Default spring, balanced",
    character: "Snappy & controlled",
  },
  {
    name: "springBouncy",
    stiffness: 400,
    damping: 15,
    mass: 1,
    use: "Playful, attention-grabbing",
    character: "Elastic & fun",
  },
  {
    name: "springStiff",
    stiffness: 700,
    damping: 40,
    mass: 0.5,
    use: "Precise, mechanical",
    character: "Tight & crisp",
  },
];

const VARIANT_PRESETS = [
  {
    name: "fadeIn",
    desc: "Clean opacity reveal",
    icon: Wind,
    variant: variants.fadeIn,
    code: "opacity: 0 → 1",
  },
  {
    name: "fadeInFast",
    desc: "Quick fade with decelerate",
    icon: Zap,
    variant: variants.fadeInFast,
    code: "opacity: 0 → 1 (fast)",
  },
  {
    name: "slideUp",
    desc: "Vertical entrance with lift",
    icon: MoveUp,
    variant: variants.slideUp,
    code: "y: 20 → 0, opacity: 0 → 1",
  },
  {
    name: "slideUpSm",
    desc: "Subtle vertical shift",
    icon: MoveUp,
    variant: variants.slideUpSm,
    code: "y: 8 → 0, opacity: 0 → 1",
  },
  {
    name: "slideDown",
    desc: "Downward entrance",
    icon: ArrowDown,
    variant: variants.slideDown,
    code: "y: -20 → 0, opacity: 0 → 1",
  },
  {
    name: "slideInLeft",
    desc: "Horizontal from left",
    icon: ArrowRight,
    variant: variants.slideInLeft,
    code: "x: -20 → 0, opacity: 0 → 1",
  },
  {
    name: "slideInRight",
    desc: "Horizontal from right",
    icon: ArrowLeft,
    variant: variants.slideInRight,
    code: "x: 20 → 0, opacity: 0 → 1",
  },
  {
    name: "scaleIn",
    desc: "Growing presence from 95%",
    icon: Maximize2,
    variant: variants.scaleIn,
    code: "scale: 0.95 → 1, opacity: 0 → 1",
  },
  {
    name: "scaleInFast",
    desc: "Quick scale with decelerate",
    icon: Maximize2,
    variant: variants.scaleInFast,
    code: "scale: 0.98 → 1, opacity: 0 → 1",
  },
  {
    name: "pageTransition",
    desc: "Lateral shift for routes",
    icon: LayoutGrid,
    variant: variants.pageTransition,
    code: "x: -8 → 0, opacity: 0 → 1",
  },
];

const INTERACTION_PRESETS = [
  { category: "hover", name: "lift", values: interactions.hover.lift, desc: "Subtle vertical lift on hover", code: "y: -2, scale: 1.01" },
  { category: "hover", name: "scale", values: interactions.hover.scale, desc: "Gentle scale increase", code: "scale: 1.03" },
  { category: "hover", name: "glow", values: interactions.hover.glow, desc: "Minimal presence shift", code: "scale: 1.01" },
  { category: "hover", name: "iconSlide", values: interactions.hover.iconSlide, desc: "Nudge icon rightward", code: "x: 3" },
  { category: "hover", name: "brighten", values: interactions.hover.brighten, desc: "Reduce to show activity", code: "opacity: 0.8" },
  { category: "tap", name: "press", values: interactions.tap.press, desc: "Standard press feedback", code: "scale: 0.96" },
  { category: "tap", name: "pressLight", values: interactions.tap.pressLight, desc: "Light touch response", code: "scale: 0.98" },
  { category: "tap", name: "pressStrong", values: interactions.tap.pressStrong, desc: "Heavy press for emphasis", code: "scale: 0.92" },
];

// ---------------------------------------------------------------------------
// Interactive Specimen Components
// ---------------------------------------------------------------------------

function TransitionSpecimen({ preset }: { preset: (typeof TRANSITION_PRESETS)[number] }) {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl border border-white/[0.04] bg-surface-sunken overflow-hidden hover:border-interactive-brand-default/20 transition-all duration-500"
    >
      {/* Preview area */}
      <div className="relative h-48 flex items-center justify-center bg-surface-page overflow-hidden">
        {/* Grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(38,201,201,0.5) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: (preset.config as { duration?: number }).duration || 0.3,
              ease: preset.bezier,
            }}
            className="w-16 h-16 rounded-2xl bg-interactive-brand-default/20 border border-interactive-brand-default/30 flex items-center justify-center"
          >
            <div className="w-3 h-3 rounded-full bg-interactive-brand-default" />
          </motion.div>
        </AnimatePresence>

        {/* Replay button */}
        <button
          onClick={replay}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-surface-surface/50 backdrop-blur-sm border border-border-subtle flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-elevated"
        >
          <RotateCcw className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-base font-bold text-text-primary tracking-tight">{preset.name}</span>
          <span className="font-mono text-2xs text-interactive-brand-default/60 uppercase tracking-widest">{preset.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-3 h-3 text-text-muted" />
          <span className="text-2xs text-text-muted italic">{preset.use}</span>
        </div>
        <div className="px-3 py-2 rounded-lg bg-surface-page border border-border-subtle">
          <span className="font-mono text-2xs text-text-brand">{preset.easing}</span>
        </div>
      </div>
    </motion.div>
  );
}

function SpringSpecimen({ preset }: { preset: (typeof SPRING_PRESETS)[number] }) {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl border border-white/[0.04] bg-surface-sunken overflow-hidden hover:border-interactive-brand-default/20 transition-all duration-500"
    >
      <div className="relative h-56 flex items-center justify-center bg-surface-page overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(38,201,201,0.5) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Track line */}
        <div className="absolute inset-x-12 top-1/2 h-px bg-border-subtle" />

        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ x: -80, scale: 0.8 }}
            animate={{ x: 80, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: preset.stiffness,
              damping: preset.damping,
              mass: preset.mass,
            }}
            className="w-12 h-12 rounded-full bg-interactive-brand-default/20 border-2 border-interactive-brand-default/40 flex items-center justify-center relative z-10"
          >
            <div className="w-2 h-2 rounded-full bg-interactive-brand-default" />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={replay}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-surface-surface/50 backdrop-blur-sm border border-border-subtle flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-elevated"
        >
          <RotateCcw className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-text-primary tracking-tight">{preset.name}</span>
          <span className="text-2xs text-text-muted italic">{preset.character}</span>
        </div>
        <p className="text-xs text-text-muted font-light">{preset.use}</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Stiffness", val: preset.stiffness },
            { label: "Damping", val: preset.damping },
            { label: "Mass", val: preset.mass },
          ].map((param) => (
            <div key={param.label} className="px-3 py-2 rounded-lg bg-surface-page border border-border-subtle text-center">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest block mb-1">{param.label}</span>
              <span className="font-mono text-xs text-text-brand font-bold">{param.val}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function VariantSpecimen({ preset }: { preset: (typeof VARIANT_PRESETS)[number] }) {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);
  const Icon = preset.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl border border-white/[0.04] bg-surface-sunken overflow-hidden hover:border-interactive-brand-default/20 transition-all duration-500"
    >
      <div className="relative h-44 flex items-center justify-center bg-surface-page overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            variants={preset.variant}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitions.smooth}
            className="w-14 h-14 rounded-2xl bg-interactive-brand-default/15 border border-interactive-brand-default/25 flex items-center justify-center"
          >
            <Icon className="w-5 h-5 text-interactive-brand-default/80" />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={replay}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-surface-surface/50 backdrop-blur-sm border border-border-subtle flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-elevated"
        >
          <RotateCcw className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>

      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold text-text-primary tracking-tight">{preset.name}</span>
          <Icon className="w-3.5 h-3.5 text-text-muted" />
        </div>
        <p className="text-2xs text-text-muted italic">{preset.desc}</p>
        <div className="px-3 py-1.5 rounded-lg bg-surface-page border border-border-subtle">
          <span className="font-mono text-[10px] text-text-brand">{preset.code}</span>
        </div>
      </div>
    </motion.div>
  );
}

function TapSpecimen({ preset }: { preset: (typeof INTERACTION_PRESETS)[number] }) {
  const [pressed, setPressed] = useState(false);

  const handleTap = useCallback(() => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl border border-white/[0.04] bg-surface-sunken overflow-hidden hover:border-interactive-brand-default/20 transition-all duration-500"
    >
      <div className="relative h-36 flex items-center justify-center bg-surface-page overflow-hidden">
        <motion.div
          animate={pressed ? preset.values : { scale: 1, x: 0, y: 0, opacity: 1 }}
          transition={transitions.spring}
          onClick={handleTap}
          className="w-14 h-14 rounded-2xl border flex items-center justify-center cursor-pointer select-none bg-interactive-neutral-default border-border-default"
        >
          <MousePointer2 className="w-5 h-5 text-text-secondary" />
        </motion.div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">
            Tap to preview
          </span>
        </div>
      </div>

      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border text-text-secondary bg-surface-surface border-border-subtle">
              {preset.category}
            </span>
            <span className="font-display text-sm font-bold text-text-primary tracking-tight">{preset.name}</span>
          </div>
        </div>
        <p className="text-2xs text-text-muted italic">{preset.desc}</p>
        <div className="px-3 py-1.5 rounded-lg bg-surface-page border border-border-subtle">
          <span className="font-mono text-[10px] text-text-brand">{preset.code}</span>
        </div>
      </div>
    </motion.div>
  );
}

function HoverSpecimen({ preset }: { preset: (typeof INTERACTION_PRESETS)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl border border-white/[0.04] bg-surface-sunken overflow-hidden hover:border-interactive-brand-default/20 transition-all duration-500"
    >
      <div className="relative h-36 flex items-center justify-center bg-surface-page overflow-hidden">
        <motion.div
          whileHover={preset.values}
          className="w-14 h-14 rounded-2xl border flex items-center justify-center cursor-pointer select-none bg-interactive-brand-default/15 border-interactive-brand-default/25"
        >
          <MousePointer2 className="w-5 h-5 text-interactive-brand-default/80" />
        </motion.div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">
            Hover to preview
          </span>
        </div>
      </div>

      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border text-interactive-brand-default/80 bg-interactive-brand-tonal-bg border-interactive-brand-tonal-border">
              {preset.category}
            </span>
            <span className="font-display text-sm font-bold text-text-primary tracking-tight">{preset.name}</span>
          </div>
        </div>
        <p className="text-2xs text-text-muted italic">{preset.desc}</p>
        <div className="px-3 py-1.5 rounded-lg bg-surface-page border border-border-subtle">
          <span className="font-mono text-[10px] text-text-brand">{preset.code}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MotionPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [staggerKey, setStaggerKey] = useState(0);

  return (
    <DocsLayout currentLayer="/designsystem/motion" items={NAV_ITEMS}>

      {/* ================================================================
          HERO
          ================================================================ */}
      <header className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden border-b border-white/[0.03]">
        {/* Ambient background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle at center, rgba(38,201,201,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1040px] mx-auto px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-interactive-brand-default" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-interactive-brand-default animate-ping opacity-40" />
              </div>
              <span className="font-mono text-2xs tracking-[0.2em] text-interactive-brand-default/80 uppercase">
                Temporal DNA — Layer 3
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="font-display text-5xl md:text-[5rem] font-bold tracking-tightest leading-[0.95] text-text-primary">
                Motion <br />
                <span className="text-text-disabled italic">
                  System
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mt-4">
              <p className="text-lg text-text-secondary leading-relaxed font-light">
                The complete choreography system of Token. Every transition,
                spring, variant, and micro-interaction documented with live specimens.
                Built on Framer Motion for physics-accurate animation.
              </p>

              <div className="flex flex-wrap gap-8 md:justify-end">
                {[
                  { num: "06", label: "Transitions", icon: Timer },
                  { num: "03", label: "Springs", icon: Activity },
                  { num: "10", label: "Variants", icon: Wind },
                  { num: "08", label: "Interactions", icon: MousePointer2 },
                ].map(({ num, label, icon: Icon }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3 text-interactive-brand-default/40" />
                      <span className="font-display text-xl font-medium text-text-primary">{num}</span>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </header>


      {/* ================================================================
          CONTENT
          ================================================================ */}
      <div className="py-32 space-y-48">

        {/* ==============================================================
            01. TRANSITION PRESETS
            ============================================================== */}
        <Section
          id="transitions"
          num="01"
          title="Transition Presets"
          subtitle="Duration-based timing curves. Six calibrated presets that map to every interaction speed in the system."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRANSITION_PRESETS.map((preset) => (
              <TransitionSpecimen key={preset.name} preset={preset} />
            ))}
          </div>

          <div className="mt-16 p-10 rounded-3xl border border-white/[0.03] bg-surface-sunken/50">
            <h4 className="font-display text-xl font-bold text-text-primary mb-8">Duration Philosophy</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { label: "Imperceptible", range: "75–150ms", desc: "State changes that should feel instantaneous. Hover feedback, checkbox toggles, color shifts." },
                { label: "Perceptible", range: "200–300ms", desc: "The core of the system. Long enough to see, short enough to never feel slow. Most UI transitions live here." },
                { label: "Dramatic", range: "500–800ms", desc: "Reserved for significant events. Page transitions, hero reveals, modal entries." },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-1 bg-interactive-brand-default/20 rounded-full" />
                  <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest block">{item.label}</span>
                  <h5 className="font-display text-lg font-bold text-text-primary tracking-tight">{item.range}</h5>
                  <p className="text-xs text-text-muted font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ==============================================================
            02. SPRING PHYSICS
            ============================================================== */}
        <Section
          id="spring"
          num="02"
          title="Spring Physics"
          subtitle="Physics-based motion that feels alive. Three tuned spring presets for organic, physically-grounded animation."
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SPRING_PRESETS.map((preset) => (
              <SpringSpecimen key={preset.name} preset={preset} />
            ))}
          </div>

          <div className="mt-16 p-10 rounded-3xl border border-white/[0.03] bg-surface-sunken/50">
            <h4 className="font-display text-xl font-bold text-text-primary mb-8">Spring Anatomy</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { label: "Stiffness", desc: "How taut the spring is. Higher values create faster initial movement but can overshoot. Range: 400–700." },
                { label: "Damping", desc: "How much friction resists the spring. Low damping creates bounce. High damping creates a smooth settle. Range: 15–40." },
                { label: "Mass", desc: "The weight of the animated object. Higher mass means slower start but more momentum. Range: 0.5–1." },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-1 bg-interactive-brand-default/20 rounded-full" />
                  <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest block">{item.label}</span>
                  <p className="text-xs text-text-muted font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ==============================================================
            03. VARIANT PRESETS
            ============================================================== */}
        <Section
          id="variants"
          num="03"
          title="Variant Presets"
          subtitle="Pre-composed enter/exit animations. Each variant defines initial, animate, and exit states for AnimatePresence workflows."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {VARIANT_PRESETS.map((preset) => (
              <VariantSpecimen key={preset.name} preset={preset} />
            ))}
          </div>
        </Section>

        {/* ==============================================================
            04. MICRO-INTERACTIONS
            ============================================================== */}
        <Section
          id="interactions"
          num="04"
          title="Micro-Interactions"
          subtitle="Tactile response helpers. Applied via whileHover and whileTap for immediate, physical feedback on interactive elements."
        >
          <div className="space-y-16">
            {/* Hover interactions */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Hover Responses</h3>
                <div className="flex-1 h-px bg-border-subtle" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {INTERACTION_PRESETS.filter((p) => p.category === "hover").map((preset) => (
                  <HoverSpecimen key={preset.name} preset={preset} />
                ))}
              </div>
            </div>

            {/* Tap interactions */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Tap Responses</h3>
                <div className="flex-1 h-px bg-border-subtle" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {INTERACTION_PRESETS.filter((p) => p.category === "tap").map((preset) => (
                  <TapSpecimen key={preset.name} preset={preset} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ==============================================================
            05. COMPOSED MOTION PROPS
            ============================================================== */}
        <Section
          id="composed"
          num="05"
          title="Composed Motion Props"
          subtitle="Ready-to-spread prop objects. Apply a full enter animation in one spread: {...motionProps.fadeIn}"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(motionProps).map(([name, props], idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl border border-white/[0.04] bg-surface-sunken overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-text-primary tracking-tight">motionProps.{name}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-page border border-border-subtle">
                      <span className="font-mono text-[10px] text-text-brand">spread</span>
                    </span>
                  </div>

                  <p className="text-xs text-text-muted font-light">
                    Combines variant, initial, animate, exit, and transition into a single spreadable object.
                  </p>

                  <div className="rounded-xl bg-surface-page border border-border-subtle p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Usage</span>
                    </div>
                    <pre className="font-mono text-[11px] text-text-brand/80 leading-relaxed">
{`<motion.div {...motionProps.${name}}>
  {children}
</motion.div>`}
                    </pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ==============================================================
            06. STAGGER PATTERNS
            ============================================================== */}
        <Section
          id="stagger"
          num="06"
          title="Stagger Patterns"
          subtitle="Orchestrated list animations. Parent variants that stagger children for cascading entrance sequences."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard stagger */}
            {[
              { name: "stagger", delay: "50ms", variant: variants.stagger },
              { name: "staggerFast", delay: "30ms", variant: variants.staggerFast },
            ].map((preset) => (
              <div key={preset.name} className="rounded-2xl border border-white/[0.04] bg-surface-sunken overflow-hidden">
                <div className="p-6 border-b border-border-subtle flex items-center justify-between">
                  <div>
                    <span className="font-display text-base font-bold text-text-primary tracking-tight block">{preset.name}</span>
                    <span className="text-2xs text-text-muted italic">Child delay: {preset.delay}</span>
                  </div>
                  <button
                    onClick={() => setStaggerKey((k) => k + 1)}
                    className="w-8 h-8 rounded-lg bg-surface-surface border border-border-subtle flex items-center justify-center hover:bg-surface-elevated transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-text-secondary" />
                  </button>
                </div>

                <div className="p-6 bg-surface-page min-h-[200px] flex items-center justify-center">
                  <motion.div
                    key={staggerKey}
                    variants={preset.variant}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col gap-3 w-full max-w-xs"
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        variants={variants.slideUpSm}
                        className="h-10 rounded-xl bg-interactive-brand-default/10 border border-interactive-brand-default/20 flex items-center px-4"
                      >
                        <div className="w-6 h-6 rounded-lg bg-interactive-brand-default/20 mr-3" />
                        <div className="flex-1 h-2 rounded-full bg-interactive-brand-default/15" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="max-w-[1040px] mx-auto w-full pt-32 border-t border-white/[0.04]">
          <DocNav current="/designsystem/motion" />
        </div>
      </div>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="border-t border-white/[0.03] py-24 bg-surface-page relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-full bg-interactive-brand-default/[0.02] transform translate-x-1/2 -skew-x-12" />
        <div className="max-w-[1040px] mx-auto px-8 relative z-10 flex flex-col items-center justify-between gap-12 sm:flex-row">
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-interactive-brand-default/30 flex items-center justify-center group-hover:border-interactive-brand-default transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-interactive-brand-default" />
              </div>
              <span className="font-display text-xl font-bold text-text-primary">Token</span>
            </div>
            <p className="text-sm text-text-muted font-light">Layer 3 Motion System Documentation</p>
          </div>

          <div className="flex items-center gap-8">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">&copy; 2026 Token Systems</span>
            <div className="w-[1px] h-4 bg-white/10 hidden sm:block" />
            <button className="text-[10px] font-mono text-text-muted hover:text-text-brand transition-colors uppercase tracking-[0.2em]">Build &mdash; v2.4.0</button>
          </div>
        </div>
      </footer>
    </DocsLayout>
  );
}
