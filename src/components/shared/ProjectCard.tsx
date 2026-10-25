import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const categoryColour: Record<string, string> = {
  'pcb-design': '#226192',
  'pcb-assembly': '#EF8557',
  'embedded-systems': '#226192',
  '3d-design': '#EF8557',
  '3d-printing': '#226192',
  'cnc-fabrication': '#EF8557',
  'medical-tech': '#226192',
  iot: '#EF8557',
};

const categoryLabel: Record<string, string> = {
  'pcb-design': 'PCB Design',
  'pcb-assembly': 'PCB Assembly',
  'embedded-systems': 'Embedded Systems',
  '3d-design': '3D Design',
  '3d-printing': '3D Printing',
  'cnc-fabrication': 'CNC & Fabrication',
  'medical-tech': 'Medical Tech',
  iot: 'IoT',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const colour = categoryColour[project.category] ?? '#226192';

  return (
    <div className="card-engineering group h-full flex flex-col overflow-hidden">
      {/* Image Placeholder / Visual */}
      <div className="relative h-48 bg-soro-ivory overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Decorative placeholder */
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="bg-circuit-pattern absolute inset-0 opacity-40" />
            <div className="relative z-10 text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl"
                style={{ background: `${colour}15`, border: `1px solid ${colour}30` }}
              >
                🔧
              </div>
              <span className="text-soro-ink text-xs">Project Image</span>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${colour}20`,
              border: `1px solid ${colour}40`,
              color: colour,
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            <Tag className="w-3 h-3" />
            {categoryLabel[project.category] ?? project.category}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-soro-blue/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-soro-blue font-bold text-base mb-2 group-hover:text-soro-coral transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {project.title}
        </h3>
        <p
          className="text-soro-ink text-sm leading-relaxed mb-4 flex-1"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {project.shortDesc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs text-soro-ink bg-soro-ivory border border-soro-border"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/portfolio/${project.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
          style={{ color: colour, fontFamily: 'Outfit, sans-serif' }}
        >
          View Project
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
