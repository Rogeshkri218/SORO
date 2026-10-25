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

// Restrict service accents to the shared brand palette.
const accentColours: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  'pcb-design': {
    bg: 'rgba(34, 97, 146, 0.1)',
    border: 'rgba(34, 97, 146, 0.25)',
    glow: 'rgba(34, 97, 146, 0.15)',
    text: '#226192',
  },
  'pcb-assembly': {
    bg: 'rgba(239, 133, 87, 0.1)',
    border: 'rgba(239, 133, 87, 0.28)',
    glow: 'rgba(239, 133, 87, 0.15)',
    text: '#EF8557',
  },
  'embedded-systems': {
    bg: 'rgba(34, 97, 146, 0.1)',
    border: 'rgba(34, 97, 146, 0.25)',
    glow: 'rgba(34, 97, 146, 0.15)',
    text: '#226192',
  },
  '3d-design': {
    bg: 'rgba(239, 133, 87, 0.1)',
    border: 'rgba(239, 133, 87, 0.28)',
    glow: 'rgba(239, 133, 87, 0.15)',
    text: '#EF8557',
  },
  '3d-printing': {
    bg: 'rgba(34, 97, 146, 0.1)',
    border: 'rgba(34, 97, 146, 0.25)',
    glow: 'rgba(34, 97, 146, 0.15)',
    text: '#226192',
  },
  'cnc-machining': {
    bg: 'rgba(239, 133, 87, 0.1)',
    border: 'rgba(239, 133, 87, 0.28)',
    glow: 'rgba(239, 133, 87, 0.15)',
    text: '#EF8557',
  },
  'laser-cutting': {
    bg: 'rgba(34, 97, 146, 0.1)',
    border: 'rgba(34, 97, 146, 0.25)',
    glow: 'rgba(34, 97, 146, 0.15)',
    text: '#226192',
  },
  'sheet-metal': {
    bg: 'rgba(239, 133, 87, 0.1)',
    border: 'rgba(239, 133, 87, 0.28)',
    glow: 'rgba(239, 133, 87, 0.15)',
    text: '#EF8557',
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
      style={{ background: 'var(--color-ivory)' }}
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
        className="text-soro-blue font-bold text-lg mb-2"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {service.title}
      </h3>

      {/* Short description */}
      <p
        className="text-soro-ink text-sm leading-relaxed mb-4"
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
                className="flex items-start gap-2 text-sm text-soro-ink"
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
        className="inline-flex items-center gap-2 text-sm font-semibold mt-auto pt-4 border-t border-soro-border transition-all duration-200 hover:text-soro-coral"
        style={{ color: accent.text, fontFamily: 'Outfit, sans-serif' }}
      >
        Enquire About This Service
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default ServiceCard;
