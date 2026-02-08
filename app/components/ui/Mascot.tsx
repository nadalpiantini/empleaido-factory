'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export type MascotState = 'idle' | 'wave' | 'thinking' | 'working' | 'celebrating' | 'supportive';

interface MascotPose {
  pose: MascotState;
  scene: string;
  imageUrl: string;
  seed: number;
  generatedAt: string;
}

interface MascotProps {
  state?: MascotState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
  fallbackEmoji?: string;
}

const SIZES = {
  sm: { width: 48, height: 48 },
  md: { width: 80, height: 80 },
  lg: { width: 120, height: 120 },
  xl: { width: 200, height: 200 },
};

// Fallback emojis for each state (before images are generated)
const STATE_EMOJIS: Record<MascotState, string> = {
  idle: '🤖',
  wave: '👋',
  thinking: '🤔',
  working: '⚙️',
  celebrating: '🎉',
  supportive: '💚',
};

// State descriptions for accessibility and tooltips
const STATE_DESCRIPTIONS: Record<MascotState, string> = {
  idle: 'Empleaido is ready to help',
  wave: 'Empleaido says hello!',
  thinking: 'Empleaido is thinking...',
  working: 'Empleaido is working on it',
  celebrating: 'Task completed successfully!',
  supportive: 'Empleaido is here to help',
};

/**
 * Mascot Component
 *
 * Displays the Empleaido mascot in different states.
 * Falls back to emoji if generated images aren't available.
 */
export function Mascot({
  state = 'idle',
  size = 'md',
  animate = true,
  className = '',
  fallbackEmoji,
}: MascotProps) {
  const [poses, setPoses] = useState<MascotPose[]>([]);
  const [loading, setLoading] = useState(true);

  // Load mascot poses
  useEffect(() => {
    fetch('/mascot-poses.json')
      .then((res) => (res.ok ? res.json() : []))
      .then(setPoses)
      .catch(() => setPoses([]))
      .finally(() => setLoading(false));
  }, []);

  const currentPose = poses.find((p) => p.pose === state);
  const { width, height } = SIZES[size];
  const emoji = fallbackEmoji || STATE_EMOJIS[state];
  const description = STATE_DESCRIPTIONS[state];

  // Animation classes based on state (NO hover movement - only glow effects)
  const getAnimationClass = () => {
    if (!animate) return '';

    switch (state) {
      case 'thinking':
        return 'animate-pulse';
      case 'working':
        return 'animate-bounce';
      case 'celebrating':
        return 'animate-bounce';
      case 'wave':
        return 'transition-shadow hover:drop-shadow-[0_0_8px_var(--led-cyan)]';
      default:
        return 'transition-shadow hover:drop-shadow-[0_0_6px_var(--led-cyan)]';
    }
  };

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        ${getAnimationClass()}
        ${className}
      `}
      title={description}
      role="img"
      aria-label={description}
    >
      {currentPose?.imageUrl ? (
        <Image
          src={currentPose.imageUrl}
          alt={`Empleaido - ${state}`}
          width={width}
          height={height}
          className="rounded-lg object-cover"
          priority={state === 'idle'}
        />
      ) : (
        // Fallback: styled emoji container
        <div
          className="flex items-center justify-center bg-mid rounded-lg border border-light/10"
          style={{ width, height }}
        >
          <span
            className="text-center"
            style={{ fontSize: width * 0.5 }}
          >
            {loading ? '⏳' : emoji}
          </span>
        </div>
      )}

      {/* LED indicator dot */}
      {state === 'working' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan rounded-full led-pulse" />
      )}
      {state === 'celebrating' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full led-pulse" />
      )}
    </div>
  );
}

/**
 * MascotWithMessage
 *
 * Mascot with a speech bubble message
 */
interface MascotWithMessageProps extends MascotProps {
  message?: string;
}

export function MascotWithMessage({
  message,
  state = 'idle',
  size = 'md',
  ...props
}: MascotWithMessageProps) {
  return (
    <div className="flex items-start gap-3">
      <Mascot state={state} size={size} {...props} />
      {message && (
        <div className="bg-mid rounded-lg p-3 max-w-xs relative">
          {/* Speech bubble tail */}
          <div className="absolute left-0 top-4 -translate-x-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-mid" />
          <p className="text-sm text-light">{message}</p>
        </div>
      )}
    </div>
  );
}

/**
 * MascotStateIndicator
 *
 * Compact mascot for status bars and headers
 */
interface MascotStateIndicatorProps {
  state: MascotState;
  label?: string;
  className?: string;
}

export function MascotStateIndicator({
  state,
  label,
  className = '',
}: MascotStateIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Mascot state={state} size="sm" />
      {label && (
        <span className="text-sm text-light/70">{label}</span>
      )}
    </div>
  );
}

export default Mascot;
