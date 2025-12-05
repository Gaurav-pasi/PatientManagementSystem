import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

export function Card({
  children,
  hover = false,
  gradient = false,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        'card',
        hover && 'cursor-pointer',
        gradient && 'bg-gradient-to-br from-white/90 to-white/70',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-xl font-bold text-slate-800', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-slate-500 mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-slate-100', className)}>
      {children}
    </div>
  );
}
