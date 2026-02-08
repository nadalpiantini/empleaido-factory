'use client';

import { forwardRef, HTMLAttributes } from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}

const variants: Record<CardVariant, string> = {
  default: `
    bg-mid
    shadow-card
  `,
  elevated: `
    bg-mid
    shadow-soft
  `,
  outlined: `
    bg-transparent
    border-2 border-mid
  `,
  interactive: `
    bg-mid
    shadow-card
    hover:shadow-soft
    hover:border-cyan
    border border-transparent
    cursor-pointer
    transition-all duration-med ease-ui
  `,
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      as: Component = 'div',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={`
          rounded-lg
          text-light
          ${variants[variant]}
          ${paddings[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

// === CARD SUB-COMPONENTS ===

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  children,
  className = '',
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${className}`}
      {...props}
    >
      <div>
        {title && (
          <h3 className="text-lg font-semibold text-light">{title}</h3>
        )}
        {subtitle && (
          <p className="text-sm text-light/70 mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({
  children,
  className = '',
  ...props
}: CardContentProps) {
  return (
    <div className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({
  children,
  className = '',
  ...props
}: CardFooterProps) {
  return (
    <div
      className={`
        mt-4 pt-4
        border-t border-light/10
        flex items-center gap-3
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
