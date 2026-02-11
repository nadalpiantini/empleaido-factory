'use client';

import Image from 'next/image';
import imageManifest from '../public/empleaido-images.json';

interface EmpleaidoCedulaProps {
  id: string;
  name: string;
  serial: number;
  role: {
    main: string;
    sub: string;
    tier: 'base' | 'pro' | 'deluxe';
  };
  sephirot: {
    primary: string;
    secondary: string[];
  };
  visual: {
    accessory: string;
    color_accent: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function EmpleaidoCedula({
  id,
  name,
  serial,
  role,
  sephirot,
  visual,
  size = 'md',
}: EmpleaidoCedulaProps) {
  const imageData = imageManifest.find((img) => img.empleaido_id === id);
  const imageUrl = imageData?.imageUrl;

  const sizeClasses = {
    sm: { card: 'w-64', image: 'w-16 h-16', title: 'text-lg', serial: 'text-xs' },
    md: { card: 'w-80', image: 'w-24 h-24', title: 'text-2xl', serial: 'text-sm' },
    lg: { card: 'w-96', image: 'w-32 h-32', title: 'text-3xl', serial: 'text-base' },
  };

  const styles = sizeClasses[size];

  const tierConfig = {
    base: { icon: '○', label: 'BASE', bg: '#6B7280' },
    pro: { icon: '◆', label: 'PRO', bg: '#2563EB' },
    deluxe: { icon: '★', label: 'DELUXE', bg: '#D97706' },
  };

  const tier = tierConfig[role.tier];

  return (
    <div
      className={`${styles.card} rounded-xl overflow-hidden shadow-lg`}
      style={{
        background: `linear-gradient(135deg, #fff 0%, ${visual.color_accent}10 100%)`,
        border: `3px solid ${visual.color_accent}`,
      }}
    >
      {/* Header Bar */}
      <div
        className="px-4 py-2 text-center"
        style={{ background: visual.color_accent }}
      >
        <span className="text-white text-xs font-bold tracking-widest uppercase">
          Empleaido Factory
        </span>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Photo */}
          <div
            className={`${styles.image} rounded-lg overflow-hidden flex-shrink-0 relative`}
            style={{
              border: `2px solid ${visual.color_accent}`,
              background: `${visual.color_accent}20`
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-3xl">{getRoleEmoji(role.main)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`${styles.title} font-bold text-gray-900 truncate`}>
              {name}
            </h3>
            <p
              className={`${styles.serial} font-mono font-semibold mb-2`}
              style={{ color: visual.color_accent }}
            >
              #{serial.toString().padStart(5, '0')}
            </p>
            <p className="text-sm text-gray-800 truncate">{role.main}</p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-3 h-px"
          style={{ background: `${visual.color_accent}40` }}
        />

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-700 font-medium">Sephirah</span>
            <p className="font-semibold text-gray-900">{sephirot.primary}</p>
          </div>
          <div>
            <span className="text-gray-700 font-medium">Tier</span>
            <p
              className="font-bold flex items-center gap-1"
              style={{ color: tier.bg }}
            >
              {tier.icon} {tier.label}
            </p>
          </div>
        </div>

        {/* Color Accent Bar */}
        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ background: visual.color_accent }}
          />
          <span className="text-xs font-mono text-gray-700">
            {visual.color_accent}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 text-center border-t"
        style={{ borderColor: `${visual.color_accent}30` }}
      >
        <span className="text-xs text-gray-700">
          empleaido-{serial.toString().padStart(5, '0')}
        </span>
      </div>
    </div>
  );
}

function getRoleEmoji(role: string): string {
  const map: Record<string, string> = {
    'Contabilidad RD': '🧾',
    'Growth Marketing': '📣',
    'Operaciones': '🗂️',
    'CFO Estrategico': '💰',
    'Productividad Personal': '⏱️',
    'UX Design': '🎨',
  };
  return map[role] || '🤖';
}
