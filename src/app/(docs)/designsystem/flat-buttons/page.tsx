"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export default function FlatButtonsDemo() {
  return (
    <div className="min-h-[100vh] bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="w-full max-w-3xl space-y-16 pb-32 pt-16">
        
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-display font-semibold tracking-tight">Flat Interaction Models</h1>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed">
            These button prototypes stay perfectly grounded (y: 0). They rely purely on surface textures, borders, and color math to communicate affordance.
          </p>
        </div>

        {/* ── Option 1: The Machined Edge ────────────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-medium text-white">Option 1: The Machined Edge</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">Tactile inner bevel on hover. Highly physical, mimicking milled hardware.</p>
          </div>
          <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 flex items-center justify-center gap-6">
            <MachinedButton>Confirm Action</MachinedButton>
            <MachinedButton variant="neutral">Cancel</MachinedButton>
          </div>
        </div>

        {/* ── Option 2: The Surface Reaction ─────────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-medium text-white">Option 2: The Surface Reaction</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">Pure color shifting. Fades in a tactile noise texture on hover.</p>
          </div>
          <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 flex items-center justify-center gap-6">
            <SurfaceButton>Confirm Action</SurfaceButton>
            <SurfaceButton variant="neutral">Cancel</SurfaceButton>
          </div>
        </div>

        {/* ── Option 4: The Text Glow ─────────────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-medium text-white">Option 4: The Text Glow</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">Surface remains static. The text itself blooms with light on hover.</p>
          </div>
          <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 flex items-center justify-center gap-6">
            <TextGlowButton>Confirm Action</TextGlowButton>
            <TextGlowButton variant="neutral">Cancel</TextGlowButton>
          </div>
        </div>

        {/* ── Option 5: The Neumorphic Recess ────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-medium text-white">Option 5: The Soft Trench (Recess)</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">Starts slightly sunken. Hover deepens the dark inner shadow.</p>
          </div>
          <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 flex items-center justify-center gap-6">
            <RecessButton>Confirm Action</RecessButton>
            <RecessButton variant="neutral">Cancel</RecessButton>
          </div>
        </div>

        {/* ── Option 6: The Metallic Sheen ───────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-medium text-white">Option 6: The Metallic Sheen</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">A slow, wide linear gradient glides across the button like brushed metal.</p>
          </div>
          <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 flex items-center justify-center gap-6">
            <MetallicButton>Confirm Action</MetallicButton>
            <MetallicButton variant="neutral">Cancel</MetallicButton>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Option 1: Machined Button ──────────────────────────────────────────────

function MachinedButton({ children, variant = "brand" }: { children: React.ReactNode, variant?: "brand"|"neutral" }) {
  const [hovered, setHovered] = useState(false);
  const isBrand = variant === "brand";

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        relative overflow-hidden h-10 px-4 rounded-xl font-medium text-sm transition-colors duration-200
        ${isBrand ? "text-white" : "text-neutral-300"}
      `}
      style={{
        backgroundColor: isBrand 
          ? (hovered ? "rgba(14,116,144,0.9)" : "rgba(14,116,144,1)") 
          : (hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"),
      }}
    >
      <motion.span 
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          boxShadow: isBrand 
            ? "inset 0 1.5px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.3)"
            : "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ─── Option 2: Surface Reaction ─────────────────────────────────────────────

function SurfaceButton({ children, variant = "brand" }: { children: React.ReactNode, variant?: "brand"|"neutral" }) {
  const [hovered, setHovered] = useState(false);
  const isBrand = variant === "brand";

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        relative overflow-hidden h-10 px-4 rounded-xl font-medium text-sm transition-colors duration-200
        ${isBrand ? "text-white bg-cyan-700 hover:bg-cyan-600" : "text-neutral-300 bg-white/5 hover:bg-white/10"}
      `}
    >
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none mix-blend-overlay"
        animate={{ opacity: hovered ? 0.08 : 0 }}
        style={{ backgroundImage: NOISE }}
      />
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{children}</span>
    </motion.button>
  );
}

// ─── Option 3: Tonal Stroke ─────────────────────────────────────────────────

function TonalStrokeButton({ children, variant = "brand" }: { children: React.ReactNode, variant?: "brand"|"neutral" }) {
  const [hovered, setHovered] = useState(false);
  const isBrand = variant === "brand";

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        relative overflow-hidden h-10 px-4 rounded-xl font-medium text-sm
        ${isBrand ? "text-white bg-cyan-700" : "text-neutral-300 bg-white/5"}
      `}
    >
      <motion.span 
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{
          border: isBrand ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.15)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ─── Option 4: Text Glow ───────────────────────────────────────────────────

function TextGlowButton({ children, variant = "brand" }: { children: React.ReactNode, variant?: "brand"|"neutral" }) {
  const [hovered, setHovered] = useState(false);
  const isBrand = variant === "brand";

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        relative overflow-hidden h-10 px-4 rounded-xl font-medium text-sm transition-colors duration-200
        ${isBrand ? "bg-[#0c4a6e]" : "bg-[#1f1f1f] border border-white/[0.03]"}
      `}
    >
      <motion.span 
        className={`relative z-10 block ${isBrand ? "text-cyan-300" : "text-neutral-400"}`}
        animate={{
          color: isBrand 
            ? (hovered ? "#67e8f9" : "#a5f3fc") 
            : (hovered ? "#ffffff" : "#a3a3a3"),
          textShadow: hovered 
            ? (isBrand ? "0 0 12px rgba(103,232,249,0.5)" : "0 0 12px rgba(255,255,255,0.2)") 
            : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

// ─── Option 5: Soft Trench ─────────────────────────────────────────────────

function RecessButton({ children, variant = "brand" }: { children: React.ReactNode, variant?: "brand"|"neutral" }) {
  const [hovered, setHovered] = useState(false);
  const isBrand = variant === "brand";

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        relative overflow-hidden h-10 px-4 rounded-xl font-medium text-sm transition-colors duration-300
        ${isBrand ? "text-white bg-cyan-800" : "text-neutral-300 bg-[#0f0f0f]"}
      `}
      style={{
        boxShadow: isBrand 
          ? "inset 0 3px 6px rgba(0,0,0,0.25), inset 0 -1px 1px rgba(255,255,255,0.1)"
          : "inset 0 3px 6px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.02)",
      }}
    >
      <motion.span 
        className="absolute inset-0 rounded-[inherit] pointer-events-none bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10 opacity-90">{children}</span>
    </motion.button>
  );
}

// ─── Option 6: Metallic Sheen ──────────────────────────────────────────────

function MetallicButton({ children, variant = "brand" }: { children: React.ReactNode, variant?: "brand"|"neutral" }) {
  const [hovered, setHovered] = useState(false);
  const isBrand = variant === "brand";

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        relative overflow-hidden h-10 px-4 rounded-xl font-medium text-sm flex items-center justify-center
        ${isBrand ? "text-white bg-[#0e7490]" : "text-neutral-200 bg-[#161616] border border-white/5"}
      `}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        animate={{ 
          x: hovered ? ["-100%", "100%"] : "-100%",
        }}
        transition={{ 
          duration: hovered ? 1.5 : 0, 
          ease: "easeInOut",
          repeat: hovered ? Infinity : 0,
        }}
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.15) 70%, transparent 100%)",
          transform: "skewX(-20deg)",
          width: "200%"
        }}
      />
      <span className="relative z-10 drop-shadow-md">{children}</span>
    </motion.button>
  );
}
