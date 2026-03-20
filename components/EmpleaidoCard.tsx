/**
 * FACTORY FLOOR UI - EMPLEAIDO CARD v2.0
 *
 * Enhanced with:
 * - 3D tilt effects on hover
 * - Holographic/shimmer effects
 * - Card flip animation
 * - Rarity indicators
 * - Enhanced visual feedback
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, MouseEvent } from 'react';

interface EmpleaidoCardProps {
  id: string;
  serial: number;
  name: string;
  role: {
    main: string;
    sub: string;
    tier: 'base' | 'pro' | 'deluxe';
  };
  sephirot: {
    primary: string;
  };
  skills: {
    native: string[];
  };
  pricing: {
    monthly_usd: number;
    annual_usd?: number;
  };
  index?: number; // Card number for collection display
}

export function EmpleaidoCard({
  id,
  serial,
  name,
  role,
  sephirot,
  skills,
  pricing,
  index = 1
}: EmpleaidoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const getRoleEmoji = (roleMain: string) => {
    const map: Record<string, string> = {
      'Contabilidad RD': '🧾',
      'Growth Marketing': '📣',
      'Operaciones': '🗂️',
      'CFO Estrategico': '💰',
      'CEO Virtual': '👑',
      'CTO Tech Lead': '⚙️',
      'Ventas B2B': '🤝',
      'Customer Success': '💚',
      'Product Manager': '📊',
      'Data Analyst': '📈',
      'Content Creator': '✍️',
      'Social Media': '📱',
      'Diseñador UI/UX': '🎨',
      'Desarrollador': '💻',
      'DevOps': '🚀',
      'QA Tester': '🔍',
      'Copywriter': '📝',
      'SEO Specialist': '🔎',
      'Project Manager': '🎯',
      'HR Manager': '👥',
      'Legal Advisor': '⚖️',
      'Business Analyst': '📋',
      'Strategy Consultant': '🗺️',
      'Innovation Lead': '💡',
      'Research Analyst': '🔬',
      'Community Manager': '🌐',
      'Brand Strategist': '🏷️',
      'Event Coordinator': '🎪',
      'Training Specialist': '🎓',
      'Quality Manager': '✅',
      'Operations Lead': '⚡',
      'Supply Chain': '📦',
      'Procurement': '🛒',
      'Finance Analyst': '🧮',
      'Risk Manager': '🛡️',
      'Compliance Officer': '📜',
      'Internal Auditor': '🔍',
      'Tax Specialist': '🏛️',
      'Treasury Manager': '🏦',
      'Investment Analyst': '📊',
      'Insurance Broker': '🛡️',
      'Real Estate': '🏢',
      'Facilities Manager': '🏗️',
      'IT Support': '🔧',
      'Security Analyst': '🔒',
      'Network Admin': '🌐',
      'Database Admin': '🗃️',
      'System Admin': '⚙️',
      'Help Desk': '🎧',
      'Technical Writer': '📖',
      'UI Designer': '🖼️',
      'UX Researcher': '🔍',
      'Interaction Designer': '👆',
      'Visual Designer': '🎨',
      'Motion Designer': '🎬',
      'Video Editor': '🎥',
      'Photographer': '📸',
      'Illustrator': '✏️',
      'Animator': '🎞️',
      '3D Artist': '🎨',
      'Game Designer': '🎮',
      'VR Developer': '🥽',
      'AR Developer': '👓',
      'Blockchain Dev': '⛓️',
      'Smart Contract': '📜',
      'Crypto Analyst': '🪙',
      'DeFi Specialist': '🏦',
      'NFT Creator': '🖼️',
      'Web3 Developer': '🌐',
      'Metaverse Architect': '🏛️',
      'Digital Twin': '👥',
      'IoT Developer': '🌐',
      'Edge Computing': '⚡',
      'Cloud Architect': '☁️',
      'Serverless Dev': '🚀',
      'Microservices': '🏗️',
      'Kubernetes': '🚢',
      'Docker Specialist': '🐳',
      'CI/CD Engineer': '🔄',
      'Automation Eng': '🤖',
      'AI Engineer': '🧠',
      'Machine Learning': '📊',
      'Data Scientist': '🔬',
      'Deep Learning': '🧠',
      'NLP Specialist': '💬',
      'Computer Vision': '👁️',
      'Robotics Engineer': '🤖',
      'Quantum Computing': '⚛️',
    };
    return map[roleMain] || '🤖';
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });

    // Calculate rotation based on mouse position
    const rotateX = (y - 0.5) * -20; // Max 10 degrees rotation
    const rotateY = (x - 0.5) * 20; // Max 10 degrees rotation

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
  };

  const getRarityColor = (tier: string) => {
    switch (tier) {
      case 'deluxe':
        return 'from-yellow-400/20 to-yellow-600/20 border-yellow-400';
      case 'pro':
        return 'from-purple-400/20 to-purple-600/20 border-purple-400';
      default:
        return 'from-blue-400/20 to-blue-600/20 border-blue-400';
    }
  };

  const getRarityLabel = (tier: string) => {
    switch (tier) {
      case 'deluxe':
        return { label: '★ DELUXE ★', color: 'text-yellow-400' };
      case 'pro':
        return { label: '◆ PRO ◆', color: 'text-purple-400' };
      default:
        return { label: '● BASE ●', color: 'text-blue-400' };
    }
  };

  const rarity = getRarityLabel(role.tier);

  return (
    <div className="relative">
      {/* CARD NUMBER - Top left */}
      <div className="absolute -top-2 -left-2 z-20">
        <div className="bg-[#0E3A41] border-2 border-[#5ED3D0] px-3 py-1.5 shadow-lg">
          <div className="font-mono text-sm text-[#5ED3D0] font-bold">
            #{index.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div
        ref={cardRef}
        className="relative w-full h-full group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* CARD CONTAINER with 3D effect */}
        <div className="relative w-full h-[400px] transition-all duration-500" style={{ transformStyle: 'preserve-3d' }}>
          {/* FRONT FACE */}
          <div className={`
            absolute inset-0 w-full h-full backface-hidden
            bg-gradient-to-br from-[#1A434F] to-[#0E3A41]
            border-4 border-[#F3E4C8] group-hover:border-[#5ED3D0]
            p-6 overflow-hidden
            transition-all duration-500
            ${isFlipped ? 'opacity-0 rotate-y-180' : 'opacity-100 rotate-y-0'}
          `}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* RARITY BACKGROUND GLOW */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${getRarityColor(role.tier)}
              opacity-20 group-hover:opacity-40 transition-opacity duration-300
            `} />

            {/* SHIMMER EFFECT */}
            {isHovered && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
              </div>
            )}

            {/* HEADER */}
            <div className="relative z-10 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-mono text-gray-400 mb-1">SERIAL #{serial}</div>
                  <h3 className="text-2xl font-display font-black text-[#F3E4C8] uppercase tracking-tight">
                    {name}
                  </h3>
                </div>
                <div className="text-3xl">{getRoleEmoji(role.main)}</div>
              </div>

              {/* RARITY BADGE */}
              <div className={`
                inline-block px-3 py-1 rounded-md border
                ${rarity.color} border-current
                font-mono text-xs tracking-wider
                animate-pulse
              `}>
                {rarity.label}
              </div>
            </div>

            {/* EMPLEAIDO IMAGE */}
            <div className="relative z-10 mb-4">
              <div className={`
                relative w-full h-32 bg-gradient-to-br from-[#0E3A41] to-[#082A31]
                border-2 border-[#5ED3D0]/50 rounded-lg overflow-hidden
                group-hover:border-[#5ED3D0] transition-all duration-300
              `}>
                <Image
                  src={`/empleaido/head-${id}.png`}
                  alt={`${name} head unit`}
                  fill
                  className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-500"
                />

                {/* HOVER EFFECTS */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#5ED3D0] rounded-full animate-pulse" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>

            {/* ROLE & SEPHIROT */}
            <div className="relative z-10 mb-4">
              <div className="text-lg font-bold text-[#F3E4C8] mb-1">{role.main}</div>
              <div className="text-sm text-gray-400 mb-2">{role.sub}</div>
              <div className="inline-block px-2 py-1 bg-[#5ED3D0]/20 rounded font-mono text-xs text-[#5ED3D0]">
                {sephirot.primary}
              </div>
            </div>

            {/* SKILLS PREVIEW */}
            <div className="relative z-10 mb-4">
              <div className="text-xs font-mono text-gray-400 mb-2">SKILLS</div>
              <div className="flex flex-wrap gap-1">
                {skills.native.slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-[#5ED3D0]/10 text-[#5ED3D0] text-xs rounded font-mono"
                  >
                    {skill}
                  </span>
                ))}
                {skills.native.length > 3 && (
                  <span className="px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded font-mono">
                    +{skills.native.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* PRICING */}
            <div className="relative z-10 mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#F3E4C8]">${pricing.monthly_usd}</div>
                  <div className="text-xs text-gray-500">/month</div>
                </div>
                <div className="text-xs text-gray-400">USD</div>
              </div>
            </div>

            {/* HOVER INDICATOR */}
            <div className={`
              absolute bottom-2 right-2 font-mono text-xs text-[#5ED3D0]
              ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300
            `}>
              CLICK TO FLIP →
            </div>
          </div>

          {/* BACK FACE */}
          <div className={`
            absolute inset-0 w-full h-full backface-hidden
            bg-gradient-to-br from-[#0E3A41] to-[#082A31]
            border-4 border-[#5ED3D0]
            p-6 overflow-hidden
            transition-all duration-500
            ${isFlipped ? 'opacity-100 rotate-y-0' : 'opacity-0 rotate-y-180'}
          `}
            style={{ backfaceVisibility: 'hidden', transform: isFlipped ? 'rotateY(0)' : 'rotateY(180deg)' }}
          >
            {/* HEADER */}
            <div className="mb-4">
              <h3 className="text-xl font-display font-black text-[#F3E4C8] uppercase tracking-tight mb-2">
                {name}
              </h3>
              <div className={`
                inline-block px-3 py-1 rounded-md border
                ${rarity.color} border-current
                font-mono text-xs tracking-wider
              `}>
                {rarity.label}
              </div>
            </div>

            {/* FULL STATS */}
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-[#F3E4C8] mb-2">ROLE SPECIFICATIONS</div>
                <div className="text-sm text-gray-300 mb-1">{role.main}</div>
                <div className="text-xs text-gray-500">{role.sub}</div>
              </div>

              <div>
                <div className="text-sm font-bold text-[#F3E4C8] mb-2">SEPHIROT ALIGNMENT</div>
                <div className="px-3 py-2 bg-[#5ED3D0]/10 rounded border border-[#5ED3D0]/30">
                  <div className="font-mono text-sm text-[#5ED3D0]">{sephirot.primary}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-[#F3E4C8] mb-2">NATIVE SKILLS</div>
                <div className="space-y-1">
                  {skills.native.map((skill, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-2 py-1 bg-[#5ED3D0]/5 rounded"
                    >
                      <span className="text-sm text-gray-300">{skill}</span>
                      <span className="font-mono text-xs text-[#5ED3D0]">LVL 1</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-[#F3E4C8] mb-2">PRICING OPTIONS</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-[#F3E4C8]/10 rounded">
                    <span className="text-sm text-gray-300">Monthly</span>
                    <span className="font-bold text-[#F3E4C8]">${pricing.monthly_usd}/mo</span>
                  </div>
                  {pricing.annual_usd && (
                    <div className="flex items-center justify-between p-2 bg-green-900/20 rounded border border-green-700/30">
                      <span className="text-sm text-gray-300">Annual (Save 20%)</span>
                      <span className="font-bold text-green-400">${pricing.annual_usd}/yr</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-auto pt-4">
              <Link
                href={`/empleaidos/${id}`}
                className="block w-full bg-gradient-to-r from-[#5ED3D0] to-[#7DF3F0] text-[#0E3A41]
                         px-4 py-3 rounded font-mono font-bold text-sm tracking-wider
                         hover:from-[#7DF3F0] hover:to-[#5ED3D0]
                         transition-all duration-300 text-center
                         hover:shadow-[0_0_20px_rgba(94,211,208,0.5)]"
              >
                ACTIVATE UNIT
              </Link>
            </div>
          </div>
        </div>

        {/* CORNERS DECORATION */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#5ED3D0] opacity-50" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#5ED3D0] opacity-50" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#5ED3D0] opacity-50" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#5ED3D0] opacity-50" />
      </div>
    </div>
  );
}

// Add shimmer animation styles
const shimmerStyle = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .rotate-y-0 {
    transform: rotateY(0deg);
  }

  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerStyle;
  document.head.appendChild(style);
}