'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  border?: boolean;
}

export function Card({ children, className, hover = false, glow = false, border = true }: CardProps) {
  const baseClasses = 'bg-[#1A434F] rounded-xl transition-all duration-300';
  const borderClasses = border ? 'border-4 border-[#0E3A41]' : '';
  const hoverClasses = hover ? 'hover:border-[#5ED3D0] hover:shadow-[6px_6px_0_#5ED3D0] hover:-translate-y-1' : '';
  const glowClasses = glow ? 'glow-enhanced' : '';

  return (
    <div className={cn(baseClasses, borderClasses, hoverClasses, glowClasses, className)}>
      {children}
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export function Button({ children, variant = 'primary', size = 'md', className, onClick, href, disabled }: ButtonProps) {
  const baseClasses = 'btn-enhanced focus-enhanced transition-all duration-200 font-bold text-center uppercase tracking-wider border-4';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const variantClasses = {
    primary: 'bg-[#5ED3D0] text-[#0E3A41] border-[#0E3A41] shadow-[6px_6px_0_#0E3A41] hover:shadow-[6px_6px_0_#5ED3D0] hover:border-[#5ED3D0]',
    secondary: 'bg-[#1A434F] text-[#F3E4C8] border-[#0E3A41] hover:border-[#5ED3D0] hover:text-[#5ED3D0]',
    ghost: 'bg-transparent text-[#F3E4C8] border-transparent hover:border-[#5ED3D0] hover:text-[#5ED3D0]'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  const classes = cn(baseClasses, sizeClasses[size], variantClasses[variant], disabledClasses, className);

  if (href) {
    return (
      <a href={href} className={cn(classes, 'inline-block')}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
  floating?: boolean;
}

export function Badge({ children, variant = 'default', size = 'md', className, floating = false }: BadgeProps) {
  const baseClasses = 'badge-power';
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    default: 'bg-[#5ED3D0] text-[#0E3A41]',
    success: 'bg-green-500 text-[#0E3A41]',
    warning: 'bg-yellow-500 text-[#0E3A41]',
    error: 'bg-red-500 text-[#0E3A41]'
  };

  const floatingClasses = floating ? 'float-badge' : '';

  return (
    <span className={cn(baseClasses, sizeClasses[size], variantClasses[variant], floatingClasses, className)}>
      {children}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  color?: 'cyan' | 'success' | 'warning' | 'error';
}

export function ProgressBar({ value, max = 100, className, showValue = false, color = 'cyan' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    cyan: 'bg-[#5ED3D0]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={cn('w-full', className)}>
      {showValue && (
        <div className="flex justify-between text-xs text-[#F3E4C8]/60 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress-brutal">
        <div
          className={cn('progress-brutal-fill', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loading({ size = 'md', className }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('loading-shimmer rounded', sizeClasses[size])} />
    </div>
  );
}

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('typing-indicator', className)}>
      <span />
      <span />
      <span />
    </div>
  );
}
