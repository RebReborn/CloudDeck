import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  glow?: boolean;
}

export default function GlassCard({ 
  children, 
  className, 
  variant = 'glass', 
  glow = false, 
  ...props 
}: GlassCardProps) {
  const variants = {
    primary: "backdrop-blur-3xl bg-slate-900/60 border border-white/10 shadow-2xl shadow-blue-500/10",
    secondary: "backdrop-blur-2xl bg-slate-800/40 border border-white/5",
    accent: "backdrop-blur-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-indigo-500/10 shadow-xl",
    glass: "backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
  };

  return (
    <motion.div
      {...props}
      className={cn(
        "rounded-[2.5rem] p-8 overflow-hidden relative",
        variants[variant],
        glow && "before:absolute before:inset-0 before:bg-primary/5 before:blur-3xl before:-z-10",
        className
      )}
    >
      {/* Subtle "Light Leak" reflection effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      
      {children}
    </motion.div>
  );
}
