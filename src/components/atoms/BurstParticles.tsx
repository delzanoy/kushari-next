"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Spark {
  id: number;
  angle: number;
  dist: number;
  size: number;
  color: string;
  duration: number;
}

const COLORS = [
  "rgba(60,200,200,1)",   // cyan-400
  "rgba(60,200,200,0.7)", // cyan-400 softer
  "rgba(255,255,255,0.9)",// white
  "rgba(60,200,200,0.4)", // cyan faint
];

export function useBurst(count = 26) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const trigger = useCallback(() => {
    const next: Spark[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      angle: (360 / count) * i + (Math.random() - 0.5) * (360 / count),
      dist: 36 + Math.random() * 52,
      size: Math.random() * 2.5 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 0.45 + Math.random() * 0.25,
    }));
    setSparks(next);
    setTimeout(() => setSparks([]), 800);
  }, [count]);

  return { sparks, trigger };
}

interface BurstParticlesProps {
  sparks: Spark[];
}

export function BurstParticles({ sparks }: BurstParticlesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
      <AnimatePresence>
        {sparks.map((spark) => {
          const rad = (spark.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * spark.dist;
          const ty = Math.sin(rad) * spark.dist;

          return (
            <motion.span
              key={spark.id}
              className="absolute rounded-full shrink-0"
              style={{
                width: spark.size,
                height: spark.size,
                backgroundColor: spark.color,
                boxShadow: `0 0 ${spark.size * 3}px ${spark.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
              transition={{
                duration: spark.duration,
                ease: [0.15, 0, 0.85, 1],
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
