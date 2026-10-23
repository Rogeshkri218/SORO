import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import type { Service } from '@/types';
import {
  Cpu,
  Layers,
  Box,
  Printer,
  Settings,
  Zap,
  Wrench,
  Microchip,
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu className="w-6 h-6" />,
  layers: <Layers className="w-6 h-6" />,
  microchip: <Microchip className="w-6 h-6" />,
  box: <Box className="w-6 h-6" />,
  printer: <Printer className="w-6 h-6" />,
  settings: <Settings className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
  wrench: <Wrench className="w-6 h-6" />,
};

// Colour accents per service
const accentColours: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  'pcb-design': {
    bg: 'rgba(30, 111, 255, 0.12)',
    border: 'rgba(30, 111, 255, 0.35)',
    glow: 'rgba(30, 111, 255, 0.2)',
    text: '#60A5FA',
  },
  'pcb-assembly': {
    bg: 'rgba(0, 170, 255, 0.12)',
    border: 'rgba(0, 170, 255, 0.35)',
    glow: 'rgba(0, 170, 255, 0.2)',
    text: '#38BDF8',
  },
  'embedded-systems': {
    bg: 'rgba(255, 107, 43, 0.12)',
    border: 'rgba(255, 107, 43, 0.35)',
    glow: 'rgba(255, 107, 43, 0.2)',
    text: '#FFA07A',
  },
  '3d-design': {
    bg: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.35)',
    glow: 'rgba(139, 92, 246, 0.2)',
    text: '#C4B5FD',
  },
  '3d-printing': {
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    glow: 'rgba(16, 185, 129, 0.2)',
    text: '#6EE7B7',
  },
  'cnc-machining': {
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    glow: 'rgba(245, 158, 11, 0.2)',
    text: '#FCD34D',
  },
  'laser-cutting': {
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    glow: 'rgba(239, 68, 68, 0.2)',
    text: '#FCA5A5',
  },
  'sheet-metal': {
    bg: 'rgba(100, 116, 139, 0.12)',
    border: 'rgba(100, 116, 139, 0.35)',
    glow: 'rgba(100, 116, 139, 0.2)',
    text: '#CBD5E1',
  },
};

interface ServiceCardProps {
  service: Service;
  variant?: 'full' | 'compact';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, variant = 'compact' }) => {
  const accent = accentColours[service.slug] ?? accentColours['pcb-design'];
  const icon = iconMap[service.icon] ?? <Cpu className="w-6 h-6" />;

  return (
    <div
      className="card-service p-6 group h-full flex flex-col"
      style={{
        background: `linear-gradient(135deg, rgba(19,31,46,0.95) 0%, rgba(10,22,40,0.95) 100%)`,
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{ background: accent.bg, border: `1px solid ${accent.border}`, color: accent.text }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="text-white font-bold text-lg mb-2"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {service.title}
      </h3>

      {/* Short description */}
      <p
        className="text-[#8A9DB5] text-sm leading-relaxed mb-4"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {service.shortDesc}
      </p>

      {variant === 'full' && (
        <>
          {/* Capabilities */}
          <ul className="flex flex-col gap-1.5 mb-5 flex-1">
            {service.capabilities.slice(0, 4).map((cap) => (
              <li
                key={cap}
                className="flex items-start gap-2 text-sm text-[#8A9DB5]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <CheckCircle
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: accent.text }}
                />
                {cap}
              </li>
            ))}
          </ul>
        </>
      )}

      {variant === 'compact' && <div className="flex-1" />}

      {/* CTA */}
      <Link
        to={`/services/${service.slug}`}
        className="inline-flex items-center gap-2 text-sm font-semibold mt-auto pt-4 border-t border-[#1E3050]/60 transition-all duration-200"
        style={{ color: accent.text, fontFamily: 'Outfit, sans-serif' }}
      >
        Enquire About This Service
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default ServiceCard;
