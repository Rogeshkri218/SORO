import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'PCB Design', path: '/pcb-design' },
  { label: 'Engineering Capabilities', path: '/services' },
  { label: 'Projects', path: '/portfolio' },
  { label: 'About Us', path: '/about' },
  { label: 'Resources', path: '/downloads' },
  { label: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#071321]"
    >
      <div className="container-soro">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center" aria-label="SORO Fabrications Home">
            <span className="font-heading text-lg font-extrabold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              SORO <span className="font-normal text-[#AEB8C4]">FABRICATIONS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-5">
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
                  onClick={() => setIsMobileOpen(false)}
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
          <div className="hidden xl:flex items-center gap-3">
            <Link to="/quote" className="btn-orange py-2 px-5 text-sm">
              Request a Quote
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="xl:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-panel"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div id="mobile-nav-panel" className="xl:hidden bg-[#0A1628]/98 backdrop-blur-xl border-t border-[#1E3050]/60 max-h-[85vh] overflow-y-auto">
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
                          onClick={() => setIsMobileOpen(false)}
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
                  onClick={() => setIsMobileOpen(false)}
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
              <Link to="/quote" onClick={() => setIsMobileOpen(false)} className="btn-orange justify-center py-2.5">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
