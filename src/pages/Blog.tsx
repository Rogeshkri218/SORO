import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Tag, Search } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  author: string;
  readTime: number;
  tags: string[];
}

type BlogCategory =
  | 'all'
  | 'pcb-design'
  | 'embedded-systems'
  | '3d-printing'
  | 'cnc-machining'
  | 'product-development'
  | 'engineering-prototyping';

const categories: { id: BlogCategory; label: string }[] = [
  { id: 'all', label: 'All Articles' },
  { id: 'pcb-design', label: 'PCB Design' },
  { id: 'embedded-systems', label: 'Embedded Systems' },
  { id: '3d-printing', label: '3D Printing' },
  { id: 'cnc-machining', label: 'CNC Machining' },
  { id: 'product-development', label: 'Product Development' },
  { id: 'engineering-prototyping', label: 'Prototyping' },
];

// Empty by design — articles will be added when the company is ready to publish.
const posts: BlogPost[] = [];

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <HelmetProvider>
      <Helmet>
        <title>Engineering Blog — SORO Fabrications Private Limited</title>
        <meta
          name="description"
          content="Engineering articles and insights from SORO Fabrications on PCB design, embedded systems, 3D printing, CNC machining, and product development."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-soro relative z-10">
          <ScrollReveal>
            <div className="badge-blue mb-5 w-fit">Blog</div>
            <h1 className="text-display text-white mb-6 max-w-3xl">
              Engineering <span className="gradient-text">Insights & Articles</span>
            </h1>
            <p
              className="text-[#8A9DB5] text-lg max-w-2xl leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Technical articles, engineering guides, and project insights from the SORO
              Fabrications team.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-16 lg:top-20 z-30 bg-[#0D1B2A]/95 backdrop-blur-xl border-b border-[#1E3050]/60 py-4">
        <div className="container-soro">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9DB5]" />
              <input
                type="search"
                placeholder="Search articles…"
                className="input-field pl-9 py-2 text-sm w-52"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 flex-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-[#1E6FFF] text-white'
                      : 'text-[#8A9DB5] bg-[#1C2A3A] border border-[#1E3050]/60 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-[#0A1628] min-h-[400px]">
        <div className="container-soro">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-[#1C2A3A] border border-[#1E3050]/60 flex items-center justify-center mx-auto mb-6">
                <Tag className="w-8 h-8 text-[#8A9DB5]/40" />
              </div>
              <h2
                className="text-white font-bold text-xl mb-3"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                No Articles Yet
              </h2>
              <p
                className="text-[#8A9DB5] max-w-md mx-auto mb-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Engineering articles and technical content will be published here. Check back soon,
                or sign up to be notified when we publish.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/services" className="btn-primary text-sm">
                  Explore Our Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/quote" className="btn-secondary text-sm">
                  Request a Quote
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.07}>
                  <article className="card-engineering p-6 h-full flex flex-col group">
                    <div className="badge-blue mb-4 w-fit text-xs">
                      {categories.find((c) => c.id === post.category)?.label}
                    </div>
                    <h2
                      className="text-white font-bold text-lg mb-3 group-hover:text-[#00AAFF] transition-colors"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="text-[#8A9DB5] text-sm leading-relaxed flex-1 mb-5"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#8A9DB5]/70 mb-4 pt-4 border-t border-[#1E3050]/40">
                      <span style={{ fontFamily: 'Inter, sans-serif' }}>{post.date}</span>
                      <span className="flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Clock className="w-3 h-3" />
                        {post.readTime} min read
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E6FFF] hover:gap-3 transition-all"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </HelmetProvider>
  );
};

export default Blog;
