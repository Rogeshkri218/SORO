import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Cpu } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Services',
    path: '/services',
    children: [
      { label: 'PCB Design', path: '/services/pcb-design' },
      { label: 'PCB Assembly', path: '/services/pcb-assembly' },
      { label: 'Embedded Systems', path: '/services/embedded-systems' },
      { label: '3D Design', path: '/services/3d-design' },
      { label: '3D Printing', path: '/services/3d-printing' },
      { label: 'CNC Machining', path: '/services/cnc-machining' },
      { label: 'Laser Cutting', path: '/services/laser-cutting' },
      { label: 'Sheet Metal', path: '/services/sheet-metal' },
    ],
  },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Industries', path: '/industries' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileOpen
          ? 'bg-[#0A1628]/95 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-[#1E3050]/60'
          : 'bg-transparent'
      }`}
    >
      <div className="container-soro">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="SORO Fabrications Home">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E6FFF] to-[#00AAFF] rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
              <Cpu className="relative w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-800 text-lg tracking-tight text-white leading-none block" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
                SORO
              </span>
              <span className="text-[0.6rem] text-[#8A9DB5] tracking-widest uppercase leading-none block" style={{ fontFamily: 'Inter, sans-serif' }}>
                Fabrications
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="nav-link flex items-center gap-1 py-2"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                      <div className="glass-navy rounded-xl border border-[#1E3050]/80 overflow-hidden shadow-2xl shadow-black/50 min-w-[220px]">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) =>
                              `block px-5 py-2.5 text-sm font-medium transition-colors ${
                                isActive
                                  ? 'text-[#00AAFF] bg-[#1E6FFF]/10'
                                  : 'text-[#8A9DB5] hover:text-white hover:bg-white/5'
                              }`
                            }
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link py-2 ${isActive ? 'active text-white' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/downloads" className="btn-secondary py-2 px-4 text-sm">
              Downloads
            </Link>
            <Link to="/quote" className="btn-primary py-2 px-5 text-sm">
              Get a Quote
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-[#0A1628]/98 backdrop-blur-xl border-t border-[#1E3050]/60 max-h-[85vh] overflow-y-auto">
          <div className="container-soro py-4 flex flex-col gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-[#8A9DB5] hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-4 mt-1 flex flex-col gap-0.5">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `px-4 py-2.5 text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'text-[#00AAFF] bg-[#1E6FFF]/10'
                                : 'text-[#8A9DB5] hover:text-white hover:bg-white/5'
                            }`
                          }
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-white bg-[#1E6FFF]/15 border border-[#1E6FFF]/30'
                        : 'text-[#8A9DB5] hover:text-white hover:bg-white/5'
                    }`
                  }
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {item.label}
                </NavLink>
              )
            )}
            <div className="pt-4 pb-2 flex flex-col gap-3 border-t border-[#1E3050]/60 mt-2">
              <Link to="/downloads" className="btn-secondary text-center py-2.5">
                Downloads
              </Link>
              <Link to="/quote" className="btn-primary text-center py-2.5">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
