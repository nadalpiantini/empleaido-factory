import React, { forwardRef } from 'react';

interface EmpInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  hint?: string;
}

export const EmpInput = forwardRef<HTMLInputElement, EmpInputProps>((
  {
    type = 'text',
    placeholder,
    value,
    onChange,
    onFocus,
    onBlur,
    className = '',
    disabled = false,
    required = false,
    autoFocus = false,
    name,
    id,
    size = 'md',
    label,
    error,
    hint,
  },
  ref
) => {
  const sizeClasses = {
    sm: 'px-2 py-2 text-xs',
    md: 'px-3 py-3 text-sm',
    lg: 'px-4 py-4 text-base',
  }[size];

  const errorClasses = error ? 'border-red-500' : '';

  const inputClasses = `emp-input ${sizeClasses} ${errorClasses} ${className}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block font-mono text-sm text-cream uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-cyan ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />

        {/* Icono de estado si hay error */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="font-mono text-xs text-red-500">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${id}-hint`} className="font-mono text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
});

EmpInput.displayName = 'EmpInput';