'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'power' | 'mega';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'mega';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  starburst?: boolean;
}

// NO MOVEMENT - Only shadow/glow changes on hover
const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-cyan text-shadow
    border-4 border-shadow
    shadow-[6px_6px_0_var(--ink-shadow)]
    hover:shadow-[6px_6px_0_var(--led-cyan)]
    active:shadow-[2px_2px_0_var(--ink-shadow)]
  `,
  secondary: `
    bg-transparent text-cyan
    border-4 border-cyan
    shadow-[6px_6px_0_var(--led-cyan)]
    hover:bg-cyan-dim
    active:shadow-[2px_2px_0_var(--led-cyan)]
  `,
  ghost: `
    bg-transparent text-light
    border-2 border-light/30
    hover:bg-mid hover:border-cyan
  `,
  danger: `
    bg-error text-shadow
    border-4 border-shadow
    shadow-[6px_6px_0_var(--ink-shadow)]
    hover:shadow-[6px_6px_0_var(--state-error)]
    active:shadow-[2px_2px_0_var(--ink-shadow)]
  `,
  power: `
    bg-cyan text-shadow
    border-4 border-shadow
    shadow-[8px_8px_0_var(--ink-shadow)]
    hover:shadow-[8px_8px_0_var(--led-cyan)]
    active:shadow-[3px_3px_0_var(--ink-shadow)]
  `,
  mega: `
    bg-light text-shadow
    border-[6px] border-shadow
    shadow-[10px_10px_0_var(--ink-shadow)]
    hover:shadow-[10px_10px_0_var(--led-cyan)]
    active:shadow-[4px_4px_0_var(--ink-shadow)]
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-lg',
  xl: 'px-10 py-5 text-xl rounded-xl',
  mega: 'px-12 py-6 text-2xl rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      starburst = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-3
          font-display uppercase tracking-wider
          transition-shadow duration-fast ease-ui
          focus-visible:outline-4 focus-visible:outline-cyan focus-visible:outline-offset-4
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${starburst ? 'starburst' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {leftIcon && <span className="shrink-0 text-current">{leftIcon}</span>}
            <span className="relative z-10">{children}</span>
            {rightIcon && <span className="shrink-0 text-current">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

function LoadingSpinner({ size }: { size: ButtonSize }) {
  const spinnerSize = size === 'mega' || size === 'xl' ? 'h-8 w-8' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <svg
      className={`animate-spin ${spinnerSize}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Power Action Button (for hero sections) - NO MOVEMENT
export function PowerButton({
  children,
  href,
  onClick,
  className = ''
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const buttonContent = (
    <span className={`
      group relative inline-flex items-center gap-4
      px-12 py-6 text-2xl md:text-3xl font-display uppercase tracking-widest
      bg-light text-shadow
      border-[6px] border-shadow rounded-2xl
      shadow-[12px_12px_0_var(--ink-shadow)]
      transition-shadow duration-150 ease-ui
      hover:shadow-[12px_12px_0_var(--led-cyan)]
      active:shadow-[4px_4px_0_var(--ink-shadow)]
      starburst
      ${className}
    `}>
      {/* Halftone overlay */}
      <span className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ink-shadow) 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      />

      <span className="relative z-10 flex items-center gap-4">
        {children}
        <span className="text-3xl">→</span>
      </span>
    </span>
  );

  if (href) {
    return <a href={href}>{buttonContent}</a>;
  }

  return <button onClick={onClick}>{buttonContent}</button>;
}

export default Button;
