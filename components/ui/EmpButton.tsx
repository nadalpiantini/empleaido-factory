import React from 'react';
import Link from 'next/link';

interface EmpButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const EmpButton: React.FC<EmpButtonProps> = ({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'emp-button';
  const variantClasses = {
    primary: '',
    secondary: 'emp-button-secondary',
    disabled: 'emp-button-disabled',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  }[size];

  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled || variant === 'disabled' ? 'emp-button-disabled cursor-not-allowed' : '';

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${disabledClasses} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={combinedClasses}
        onClick={onClick}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || variant === 'disabled'}
    >
      {children}
    </button>
  );
};