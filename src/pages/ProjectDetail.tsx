import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ChevronLeft, ArrowRight, Tag } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { projects } from '@/data/projects';

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

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/portfolio" replace />;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{project.title} — SORO Fabrications Portfolio</title>
        <meta name="description" content={project.shortDesc} />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-16 bg-soro-ivory overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-soro relative z-10">
          <ScrollReveal>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-soro-ink hover:text-soro-blue text-sm mb-6 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>

            <div className="flex flex-wrap gap-3 mb-5">
              <span className="badge-blue">
                <Tag className="w-3 h-3" />
                {categoryLabel[project.category] ?? project.category}
              </span>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-soro-ivory border border-soro-border/60 rounded-full text-xs text-soro-ink"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-display text-soro-blue mb-6 max-w-3xl">
              {project.title}
            </h1>
            <p
              className="text-soro-ink text-lg max-w-2xl leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {project.shortDesc}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-16 bg-soro-ivory">
        <div className="container-soro">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal>
                <div className="glass p-7 rounded-2xl">
                  <h2
                    className="text-soro-blue font-bold text-lg mb-4"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Project Overview
                  </h2>
                  <p
                    className="text-soro-ink leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {project.description}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="glass p-6 rounded-2xl">
                    <h3
                      className="text-soro-blue font-bold text-base mb-4"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Problem Statement
                    </h3>
                    <p
                      className="text-soro-ink text-sm leading-relaxed"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {project.problemStatement}
                    </p>
                  </div>
                  <div className="glass p-6 rounded-2xl">
                    <h3
                      className="text-soro-blue font-bold text-base mb-4"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Our Solution
                    </h3>
                    <p
                      className="text-soro-ink text-sm leading-relaxed"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {project.solution}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Image Placeholder */}
              <ScrollReveal delay={0.15}>
                <div className="glass rounded-2xl overflow-hidden h-56 flex items-center justify-center">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-3 text-soro-coral">🔧</div>
                      <p
                        className="text-soro-ink/70 text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Project images will be added when photography is available.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <ScrollReveal delay={0.1}>
                <div className="glass p-6 rounded-2xl">
                  <h3
                    className="text-soro-blue font-bold text-sm mb-4 uppercase tracking-wide"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-soro-ivory border border-soro-border/60 rounded text-xs text-soro-ink"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="glass p-6 rounded-2xl">
                  <h3
                    className="text-soro-blue font-bold text-sm mb-4 uppercase tracking-wide"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Hardware Used
                  </h3>
                  <ul className="space-y-2">
                    {project.hardware.map((hw) => (
                      <li
                        key={hw}
                        className="flex items-start gap-2 text-sm text-soro-ink"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-soro-blue shrink-0 mt-1.5" />
                        {hw}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {project.software.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <div className="glass p-6 rounded-2xl">
                    <h3
                      className="text-soro-blue font-bold text-sm mb-4 uppercase tracking-wide"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Software & Firmware
                    </h3>
                    <ul className="space-y-2">
                      {project.software.map((sw) => (
                        <li
                          key={sw}
                          className="flex items-start gap-2 text-sm text-soro-ink"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-soro-coral shrink-0 mt-1.5" />
                          {sw}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}

              <ScrollReveal delay={0.25}>
                <div className="glass p-6 rounded-2xl">
                  <p
                    className="text-soro-ink text-sm mb-5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Have a similar project in mind? We'd love to discuss how we can help.
                  </p>
                  <Link to="/quote" className="btn-primary w-full justify-center text-sm">
                    Request a Quote
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};

export default ProjectDetail;
