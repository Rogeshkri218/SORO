import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
} from 'lucide-react';

const serviceLinks = [
  { label: 'PCB Design', path: '/pcb-design' },
  { label: 'PCB Assembly', path: '/services/pcb-assembly' },
  { label: '3D Design', path: '/services/3d-design' },
  { label: '3D Printing', path: '/services/3d-printing' },
  { label: 'Prototype Design Review', path: '/services/prototype-design-review' },
  { label: 'Manufacturing Support', path: '/services/manufacturing-support' },
];

const companyLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Industries', path: '/industries' },
  { label: 'Blog', path: '/blog' },
  { label: 'Downloads', path: '/downloads' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Get a Quote', path: '/quote' },
];

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  const COMPANY_EMAIL = 'orders@sorofabrication.in';

  return (
    <footer className="bg-soro-blue border-t border-soro-white/20 text-soro-ivory">
      <div className="container-soro py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="group mb-5 inline-flex">
              <div>
                <span
                  className="text-xl font-extrabold text-soro-ivory leading-none block"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  SORO
                </span>
                <span
                  className="text-[0.6rem] text-soro-ivory/75 tracking-widest uppercase leading-none block"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Fabrications
                </span>
                <span className="mt-2 block text-[0.55rem] uppercase tracking-[0.12em] text-soro-coral">
                  DESIGN • FABRICATE • INNOVATE
                </span>
              </div>
            </Link>

            <p
              className="text-soro-ivory/75 text-sm leading-relaxed mb-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Electronic and mechanical product development, with a focus on engineering and prototyping.
            </p>

            {/* Social links */}
          </div>

          {/* Services */}
          <div>
            <h3
              className="text-soro-ivory font-semibold text-sm mb-5 tracking-wide"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Engineering Scopes
            </h3>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-soro-ivory/75 hover:text-soro-coral text-sm transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-soro-ivory font-semibold text-sm mb-5 tracking-wide"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-soro-ivory/75 hover:text-soro-coral text-sm transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-soro-ivory font-semibold text-sm mb-5 tracking-wide"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="flex items-start gap-3 text-soro-ivory/75 hover:text-soro-ivory transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-soro-coral shrink-0" />
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {COMPANY_EMAIL}
                  </span>
                </a>
              </li>

            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-soro-white/20">
        <div className="container-soro py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-soro-ivory/75 text-xs"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            &copy; {currentYear} SORO Fabrications Private Limited. All rights
            reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
