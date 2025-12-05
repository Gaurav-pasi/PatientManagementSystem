import React from 'react';
import { motion } from 'framer-motion';
import { cn, getStatusColor } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'status';
  status?: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  className?: string;
}

export function Badge({ children, variant = 'default', status, className }: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'status-badge',
        variant === 'status' && status ? getStatusColor(status) : 'bg-primary-100 text-primary-700',
        className
      )}
    >
      {children}
    </motion.span>
  );
}
