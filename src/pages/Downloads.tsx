import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { FileText, Download, Clock, Mail } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Document {
  title: string;
  description: string;
  status: 'available' | 'unpublished';
  fileType?: string;
  fileSize?: string;
  downloadUrl?: string;
}

const documents: Document[] = [
  {
    title: 'Company Brochure',
    description: 'Company overview and verified service information.',
    status: 'unpublished',
  },
  {
    title: 'Engineering Capabilities Statement',
    description: 'A confirmed summary of project scopes and engineering deliverables.',
    status: 'unpublished',
  },
  {
    title: 'PCB Design Requirements',
    description: 'Technical information customers may prepare for a PCB design enquiry.',
    status: 'unpublished',
  },
  {
    title: 'File Format Requirements',
    description: 'File formats for design review, fabrication outputs, or assembly coordination, where agreed.',
    status: 'unpublished',
  },
  {
    title: 'Product Datasheets',
    description: 'Datasheets will be listed when SORO product status and specifications are confirmed.',
    status: 'unpublished',
  },
  {
    title: 'Approved Project Documentation',
    description: 'Project material will be published only when details and image approvals are available.',
    status: 'unpublished',
  },
];

const Downloads: React.FC = () => (
  <HelmetProvider>
    <Helmet>
      <title>Downloads — SORO Fabrications Private Limited</title>
      <meta
        name="description"
        content="Request company and engineering documents from SORO Fabrications Private Limited. Only approved files are offered for download."
      />
    </Helmet>

    {/* Hero */}
    <section className="relative pt-36 pb-20 bg-[#0A1628] overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="container-soro relative z-10">
        <ScrollReveal>
          <div className="badge-blue mb-5 w-fit">Downloads</div>
          <h1 className="text-display text-white mb-6 max-w-3xl">
            Company <span className="gradient-text">Resources</span>
          </h1>
          <p
            className="text-[#8A9DB5] text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Request company information and engineering documents. Files are offered for download only when approved for publication.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Documents */}
    <section className="py-16 bg-[#0D1B2A]">
      <div className="container-soro">
        <ScrollReveal>
          <div className="glass p-5 rounded-xl border border-[#1E6FFF]/20 mb-10">
            <p className="text-[#8A9DB5] text-sm text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Only published files include a download action. The documents below are not published;
              contact SORO to request a specific document.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc, i) => (
            <ScrollReveal key={doc.title} delay={i * 0.07}>
              <div className="card-engineering p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: doc.status === 'available' ? 'rgba(30,111,255,0.15)' : 'rgba(255,107,43,0.1)',
                      border: doc.status === 'available' ? '1px solid rgba(30,111,255,0.3)' : '1px solid rgba(255,107,43,0.25)',
                    }}
                  >
                    <FileText
                      className="w-5 h-5"
                      style={{ color: doc.status === 'available' ? '#60A5FA' : '#FFA07A' }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-white font-semibold text-sm mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {doc.title}
                    </h3>
                    {doc.status === 'available' ? (
                      <span className="badge-blue text-xs">Available</span>
                    ) : (
                      <span className="badge-orange text-xs">
                        <Clock className="w-3 h-3" /> Not published
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className="text-[#8A9DB5] text-sm leading-relaxed flex-1 mb-5"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {doc.description}
                </p>

                {doc.status === 'available' && doc.downloadUrl ? (
                  <a
                    href={doc.downloadUrl}
                    download
                    className="btn-primary text-sm py-2 justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Download {doc.fileType} {doc.fileSize && `(${doc.fileSize})`}
                  </a>
                ) : (
                  <a
                    href={`mailto:orders@sorofabrication.in?subject=${encodeURIComponent(`Document request: ${doc.title}`)}`}
                    className="btn-secondary justify-center text-sm"
                  >
                    <Mail className="w-4 h-4" /> Contact to request
                  </a>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 text-center">
          <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-white font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Need a Specific Document?
            </h3>
            <p className="text-[#8A9DB5] text-sm mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Contact SORO to ask whether an approved technical document or capability statement is available for your needs.
            </p>
            <a href="mailto:orders@sorofabrication.in" className="btn-primary">
              Contact Us
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </HelmetProvider>
);

export default Downloads;
