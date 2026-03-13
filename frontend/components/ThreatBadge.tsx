'use client';
import { motion } from 'framer-motion';

interface ThreatBadgeProps {
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  size?: 'sm' | 'md';
}

export default function ThreatBadge({ level, size = 'md' }: ThreatBadgeProps) {
  const config: Record<string, { class: string; pulse: string }> = {
    CRITICAL: { class: 'badge-critical', pulse: 'bg-red-500' },
    HIGH: { class: 'badge-high', pulse: 'bg-orange-500' },
    MEDIUM: { class: 'badge-medium', pulse: 'bg-yellow-500' },
    LOW: { class: 'badge-low', pulse: 'bg-green-400' },
    FAKE: { class: 'badge-critical', pulse: 'bg-red-500' },
    QUESTIONABLE: { class: 'badge-high', pulse: 'bg-orange-500' },
    'MOSTLY CREDIBLE': { class: 'badge-medium', pulse: 'bg-yellow-500' },
    CREDIBLE: { class: 'badge-low', pulse: 'bg-green-400' },
    'LIKELY FAKE': { class: 'badge-critical', pulse: 'bg-red-500' },
    LEGITIMATE: { class: 'badge-low', pulse: 'bg-green-400' },
  };

  const cfg = config[level] ?? { class: 'badge-medium', pulse: 'bg-yellow-500' };
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wider uppercase ${cfg.class} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.pulse} animate-pulse`} />
      {level}
    </motion.span>
  );
}
