'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#F3E4C8] mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3E4C8]/50">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              bg-[#1A434F]
              text-[#F3E4C8]
              placeholder:text-[#F3E4C8]/40
              border-2
              ${hasError ? 'border-red-500' : 'border-[#1A434F]'}
              rounded-md
              px-3 py-2
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              transition-all duration-fast ease-ui
              focus:outline-none
              focus:border-[#5ED3D0]
              focus:shadow-glow-sm
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3E4C8]/50">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || hint) && (
          <p
            className={`mt-1.5 text-sm ${
              hasError ? 'text-red-500' : 'text-[#F3E4C8]/60'
            }`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// === TEXTAREA ===

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#F3E4C8] mb-1.5"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full
            bg-[#1A434F]
            text-[#F3E4C8]
            placeholder:text-[#F3E4C8]/40
            border-2
            ${hasError ? 'border-red-500' : 'border-[#1A434F]'}
            rounded-md
            px-3 py-2
            min-h-[100px]
            resize-y
            transition-all duration-fast ease-ui
            focus:outline-none
            focus:border-[#5ED3D0]
            focus:shadow-glow-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {(error || hint) && (
          <p
            className={`mt-1.5 text-sm ${
              hasError ? 'text-red-500' : 'text-[#F3E4C8]/60'
            }`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// === SELECT ===

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#F3E4C8] mb-1.5"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={inputId}
          className={`
            w-full
            bg-[#1A434F]
            text-[#F3E4C8]
            border-2
            ${hasError ? 'border-red-500' : 'border-[#1A434F]'}
            rounded-md
            px-3 py-2
            appearance-none
            cursor-pointer
            transition-all duration-fast ease-ui
            focus:outline-none
            focus:border-[#5ED3D0]
            focus:shadow-glow-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F3E4C8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {(error || hint) && (
          <p
            className={`mt-1.5 text-sm ${
              hasError ? 'text-red-500' : 'text-[#F3E4C8]/60'
            }`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Input;
