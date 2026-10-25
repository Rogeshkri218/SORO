import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProjectCard from '@/components/shared/ProjectCard';
import { projects } from '@/data/projects';
import type { ProjectCategory } from '@/types';

type FilterType = ProjectCategory | 'all';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'pcb-design', label: 'PCB Design' },
  { id: 'pcb-assembly', label: 'PCB Assembly' },
  { id: 'embedded-systems', label: 'Embedded Systems' },
  { id: '3d-design', label: '3D Design' },
  { id: '3d-printing', label: '3D Printing' },
  { id: 'cnc-fabrication', label: 'CNC & Fabrication' },
  { id: 'medical-tech', label: 'Medical Tech' },
  { id: 'iot', label: 'IoT' },
];

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Portfolio — SORO Fabrications Private Limited</title>
        <meta
          name="description"
          content="Explore SORO Fabrications' engineering portfolio: PCB designs, embedded systems, 3D printing, medical devices, IoT projects, and more."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-soro-ivory overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-soro relative z-10">
          <ScrollReveal>
            <div className="badge-blue mb-5 w-fit">Portfolio</div>
            <h1 className="text-display text-soro-blue mb-6 max-w-3xl">
              Engineering <span className="gradient-text">Projects & Prototypes</span>
            </h1>
            <p
              className="text-soro-ink text-lg max-w-2xl leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Case studies will be published when project details, SORO's contribution, and approved
              images are confirmed.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Bar */}
      {projects.length > 0 && <section className="sticky top-16 lg:top-20 z-30 bg-soro-ivory/95 backdrop-blur-xl border-b border-soro-border/60 py-4">
        <div className="container-soro">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            <Filter className="w-4 h-4 text-soro-ink shrink-0" />
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  activeFilter === filter.id
                    ? 'bg-soro-blue text-soro-white shadow-lg shadow-soro-blue/20'
                    : 'text-soro-ink bg-soro-ivory border border-soro-border/60 hover:text-soro-blue hover:border-soro-blue/40'
                }`}
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>}

      {/* Projects Grid */}
      <section className="py-16 bg-soro-ivory min-h-[500px]">
        <div className="container-soro">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-soro-ink" style={{ fontFamily: 'Inter, sans-serif' }}>
                No verified case studies are available for publication yet. Contact SORO to discuss your project.
              </p>
            </div>
          ) : (
            <div className="grid-projects">
              {filtered.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.07}>
                  <ProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-soro-ivory">
        <div className="container-soro text-center">
          <ScrollReveal>
            <h2
              className="text-soro-blue font-bold text-2xl mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Have a Similar Project?
            </h2>
            <p
              className="text-soro-ink mb-8"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Share your requirements and we'll provide a detailed engineering quotation.
            </p>
            <Link to="/quote" className="btn-primary">
              Request a Quote
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </HelmetProvider>
  );
};

export default Portfolio;
