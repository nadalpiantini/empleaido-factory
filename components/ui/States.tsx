'use client';

/**
 * EMPLEAIDO FACTORY — UI States
 * Sistema de estados para feedback consistente
 *
 * Regla madre: Nunca dejar al usuario preguntándose qué está pasando.
 */

interface StateProps {
  className?: string;
}

// ============================================
// 1. LOADING — "Estoy en eso. Todo bien."
// ============================================

interface LoadingStateProps extends StateProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  label = 'Procesando...',
  size = 'md',
  className = '',
}: LoadingStateProps) {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-3 ${textSizes[size]} text-[#F3E4C8]/80 ${className}`}>
      <span className={`${sizes[size]} rounded-full bg-[#5ED3D0] led-pulse`} />
      {label}
    </div>
  );
}

// Spinner variant for inline use
export function LoadingSpinner({ className = '' }: StateProps) {
  return (
    <svg
      className={`animate-spin h-4 w-4 text-[#5ED3D0] ${className}`}
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

// ============================================
// 2. EMPTY — "Aquí va a pasar algo, solo que aún no."
// ============================================

interface EmptyStateProps extends StateProps {
  title?: string;
  hint?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'Nada por aquí todavía',
  hint = 'Cuando haya actividad, aparecerá aquí.',
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="text-[#F3E4C8]/30 text-5xl mb-4">{icon}</div>
      )}
      <p className="font-medium text-[#F3E4C8] mb-2">{title}</p>
      <p className="text-sm text-[#F3E4C8]/60 mb-6 max-w-sm mx-auto">{hint}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================
// 3. ERROR — "Algo no salió bien, pero no estás solo."
// ============================================

interface ErrorStateProps extends StateProps {
  message?: string;
  hint?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Algo falló. Intenta de nuevo.',
  hint,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`
        bg-[#1A434F] border border-[#F3E4C8]/20 rounded-lg p-4
        ${className}
      `}
    >
      <p className="text-sm text-[#F3E4C8] font-medium">{message}</p>
      {hint && <p className="text-xs text-[#F3E4C8]/60 mt-1">{hint}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-sm text-[#5ED3D0] hover:underline"
        >
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

// ============================================
// 4. SUCCESS — "Listo. Buen trabajo."
// ============================================

interface SuccessStateProps extends StateProps {
  message?: string;
  autoDismiss?: boolean;
  onDismiss?: () => void;
}

export function SuccessState({
  message = 'Listo. Todo salió bien.',
  autoDismiss = false,
  onDismiss,
  className = '',
}: SuccessStateProps) {
  return (
    <div
      className={`
        bg-[#5ED3D0] text-[#0E3A41] rounded-md px-4 py-2 text-sm font-medium
        inline-flex items-center gap-2
        ${autoDismiss ? 'animate-fade-in' : ''}
        ${className}
      `}
    >
      <span>✓</span>
      {message}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}

// ============================================
// 5. SKELETON — Loading placeholder for content
// ============================================

interface SkeletonProps extends StateProps {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
  className = '',
}: SkeletonProps) {
  const radiusMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        bg-[#F3E4C8]/10 animate-pulse
        ${width} ${height} ${radiusMap[rounded]}
        ${className}
      `}
    />
  );
}

// Skeleton group for common patterns
export function SkeletonCard({ className = '' }: StateProps) {
  return (
    <div className={`bg-[#1A434F] rounded-lg p-6 space-y-4 ${className}`}>
      <Skeleton width="w-1/3" height="h-5" />
      <Skeleton width="w-full" height="h-3" />
      <Skeleton width="w-2/3" height="h-3" />
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number } & StateProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? 'w-2/3' : 'w-full'}
          height="h-3"
        />
      ))}
    </div>
  );
}

const StatesExport = {
  LoadingState,
  LoadingSpinner,
  EmptyState,
  ErrorState,
  SuccessState,
  Skeleton,
  SkeletonCard,
  SkeletonText,
};

export default StatesExport;
