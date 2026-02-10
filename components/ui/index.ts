/**
 * EMPLEAIDO FACTORY — UI Component Library
 * ADN Visual: Retro-futurismo optimista
 *
 * Regla de oro: toda nueva UI nace de estos componentes o se extiende aquí.
 * Nunca crear componentes "rápidos" fuera de /ui
 */

// Core components
export { Button, PowerButton } from './Button';
export { Card, CardHeader, CardContent, CardFooter } from './Card';
export { Input, Textarea, Select } from './Input';

// State components
export {
  LoadingState,
  LoadingSpinner,
  EmptyState,
  ErrorState,
  SuccessState,
  Skeleton,
  SkeletonCard,
  SkeletonText,
} from './States';

// Mascot components
export {
  Mascot,
  MascotWithMessage,
  MascotStateIndicator,
  type MascotState,
} from './Mascot';
