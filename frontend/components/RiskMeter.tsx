'use client';
import { motion } from 'framer-motion';

interface RiskMeterProps {
  value: number; // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskMeter({ value, label, size = 'md' }: RiskMeterProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const getColor = () => {
    if (clampedValue >= 80) return { stroke: '#ff3d6b', text: '#ff3d6b', glow: 'rgba(255,61,107,0.4)' };
    if (clampedValue >= 60) return { stroke: '#ff7a00', text: '#ff7a00', glow: 'rgba(255,122,0,0.4)' };
    if (clampedValue >= 35) return { stroke: '#ffcc00', text: '#ffcc00', glow: 'rgba(255,204,0,0.4)' };
    return { stroke: '#00ff9d', text: '#00ff9d', glow: 'rgba(0,255,157,0.4)' };
  };

  const getRiskLabel = () => {
    if (clampedValue >= 80) return 'CRITICAL';
    if (clampedValue >= 60) return 'HIGH';
    if (clampedValue >= 35) return 'MEDIUM';
    return 'LOW';
  };

  const color = getColor();

  const sizes = {
    sm: { r: 36, size: 90, stroke: 4, fontSize: 'text-lg', labelSize: 'text-[9px]' },
    md: { r: 54, size: 130, stroke: 6, fontSize: 'text-2xl', labelSize: 'text-[10px]' },
    lg: { r: 70, size: 165, stroke: 7, fontSize: 'text-3xl', labelSize: 'text-xs' },
  };
  const cfg = sizes[size];
  const circumference = 2 * Math.PI * cfg.r;
  const dashOffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: cfg.size, height: cfg.size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${cfg.size} ${cfg.size}`}>
          {/* Background ring */}
          <circle
            cx={cfg.size / 2}
            cy={cfg.size / 2}
            r={cfg.r}
            fill="none"
            stroke="#0e2a4a"
            strokeWidth={cfg.stroke}
          />
          {/* Progress ring */}
          <motion.circle
            cx={cfg.size / 2}
            cy={cfg.size / 2}
            r={cfg.r}
            fill="none"
            stroke={color.stroke}
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color.glow})` }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${cfg.fontSize} font-black font-mono`}
            style={{ color: color.text }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(clampedValue)}%
          </motion.span>
          <span className={`${cfg.labelSize} font-bold tracking-widest uppercase`} style={{ color: color.text }}>
            {getRiskLabel()}
          </span>
        </div>
      </div>
      {label && <p className="text-cyber-text text-xs text-center">{label}</p>}
    </div>
  );
}
