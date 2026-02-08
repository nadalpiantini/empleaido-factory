'use client';

import Image from 'next/image';
import Link from 'next/link';
import imageManifest from '../../public/empleaido-images.json';
import { Button } from './ui';

interface EmpleaidoCardProps {
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
  skills: {
    native: string[];
    locked: string[];
  };
  visual: {
    accessory: string;
    color_accent: string;
  };
  pricing: {
    monthly_usd: number;
    annual_usd?: number;
  };
}

export function EmpleaidoCard({
  id,
  name,
  serial,
  role,
  sephirot,
  skills,
  pricing
}: EmpleaidoCardProps) {
  const imageData = imageManifest.find((img) => img.empleaido_id === id);
  const imageUrl = imageData?.imageUrl;

  return (
    <Link href={`/empleaido/${id}`} className="block group">
      <div className="card-power bg-light overflow-hidden relative">
        {/* Corner starburst for deluxe */}
        {role.tier === 'deluxe' && (
          <div className="absolute top-0 right-0 z-20">
            <div className="bg-warning text-shadow px-4 py-1 font-black text-sm uppercase tracking-wider transform rotate-0 border-b-4 border-l-4 border-shadow">
              ★ DELUXE
            </div>
          </div>
        )}

        {/* IMAGE SECTION — HUGE */}
        <div className="relative h-64 w-full bg-shadow overflow-hidden">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={`${name} - AI Employee`}
                fill
                className="object-cover  transition-transform duration-slow"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Halftone overlay */}
              <div className="absolute inset-0 halftone-dark opacity-20 mix-blend-multiply" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-mid">
              <span className="text-8xl  transition-transform duration-med">
                {getRoleEmoji(role.main)}
              </span>
            </div>
          )}

          {/* Diagonal gradient overlay */}
          <div className="absolute inset-0 halftone-dark opacity-40" />

          {/* LED accent line top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-fast" />

          {/* Serial number overlay */}
          <div className="absolute top-4 left-4">
            <span className="font-mono text-lg font-bold text-cyan bg-shadow/80 px-3 py-1 rounded border-2 border-cyan">
              #{serial.toString().padStart(5, '0')}
            </span>
          </div>

          {/* Name overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h4 className="text-2xl font-black text-light uppercase tracking-wide drop-shadow-[2px_2px_0_rgba(14,58,65,1)]">
              {name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider ${getTierBadge(role.tier)} border-2 border-shadow`}>
                {role.tier}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-6 bg-light">
          {/* Role with icon */}
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl">{getRoleEmoji(role.main)}</span>
            <div>
              <p className="text-lg font-black text-shadow uppercase">{role.main}</p>
              <p className="text-sm text-shadow/70 font-medium">{role.sub}</p>
            </div>
          </div>

          {/* Sephirah Badge - Prominent */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-shadow text-cyan rounded-lg border-2 border-shadow">
              <span className="w-2 h-2 bg-cyan rounded-full led-pulse" />
              <span className="font-bold text-sm uppercase tracking-wider">{sephirot.primary}</span>
            </div>
          </div>

          {/* Skills - Tags style */}
          <div className="mb-4">
            <p className="text-xs font-black text-shadow/50 uppercase tracking-wider mb-2">
              ⚡ Core Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.native.slice(0, 3).map(s => (
                <span
                  key={s}
                  className="text-xs px-3 py-1.5 bg-mid text-light font-bold rounded border-2 border-shadow/20"
                >
                  {s.replace(/_/g, ' ')}
                </span>
              ))}
              {skills.native.length > 3 && (
                <span className="text-xs px-3 py-1.5 bg-cyan text-shadow font-bold rounded">
                  +{skills.native.length - 3} más
                </span>
              )}
            </div>
          </div>

          {/* PRICE — HUGE AND PROMINENT */}
          <div className="flex items-end justify-between pt-4 border-t-4 border-shadow/10">
            <div>
              <span className="text-4xl font-black text-shadow">${pricing.monthly_usd}</span>
              <span className="text-sm text-shadow/60 font-bold ml-1">/mes</span>
            </div>
            <div className="text-right">
              {pricing.annual_usd && (
                <p className="text-xs text-shadow/50 font-medium">
                  ${Math.round(pricing.annual_usd / 12)}/mes anual
                </p>
              )}
            </div>
          </div>

          {/* CTA — POWER BUTTON */}
          <div className="mt-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full "
              starburst
            >
              <span className="flex items-center gap-2">
                VER PERFIL
                <span className="text-xl ">→</span>
              </span>
            </Button>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 border-4 border-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-fast rounded-lg pointer-events-none" />
      </div>
    </Link>
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

function getTierBadge(tier: string): string {
  const badges = {
    base: 'bg-light text-shadow',
    pro: 'bg-cyan text-shadow',
    deluxe: 'bg-warning text-shadow',
  };
  return badges[tier as keyof typeof badges] || badges.base;
}
