import React from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  variant?: 'glass' | 'regular';
}

export default function Input({ 
  label, 
  icon, 
  error, 
  className, 
  value, 
  variant = 'glass', 
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const hasValue = String(value || '').length > 0;

  const glassInput = "backdrop-blur-md bg-white/5 border-white/10 text-white focus:border-primary/50 focus:bg-white/10 ring-primary/20";
  const regularInput = "bg-secondary border-border text-foreground focus:border-primary ring-primary/20";

  return (
    <div className="w-full space-y-1.5 group">
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
            isFocused ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground"
          )}>
            {icon}
          </div>
        )}
        <input
          {...props}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "w-full rounded-2xl py-4 transition-all outline-none focus:ring-4 placeholder:text-transparent",
            icon ? "pl-12 pr-4" : "px-4",
            variant === 'glass' ? glassInput : regularInput,
            error && "border-destructive ring-destructive/20",
            className
          )}
        />
        <label
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 text-sm font-medium",
            icon && "left-12",
            (isFocused || hasValue) ? "-translate-y-9 text-xs text-primary font-black uppercase tracking-wider" : "text-muted-foreground/50",
            error && "text-destructive"
          )}
        >
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-destructive font-semibold ml-4"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
