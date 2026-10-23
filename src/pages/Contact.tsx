import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(20, 'Please enter a message of at least 20 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  ) : null;

const Contact: React.FC = () => {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitState('loading');
    try {
      await new Promise((r) => setTimeout(r, 1200));
      console.log('Contact form:', data);
      setSubmitState('success');
      reset();
    } catch {
      setSubmitState('error');
    }
  };

  // TODO: Replace with verified company details
  const COMPANY_EMAIL = 'info@sorofabrications.com';
  const COMPANY_PHONE = '+91 [Phone Number]';
  const COMPANY_WHATSAPP = '+91 [WhatsApp Number]';
  const COMPANY_ADDRESS = '[Company Address, City, State, India]';
  const BUSINESS_HOURS = 'Monday – Saturday: 9:00 AM – 6:00 PM IST';

  return (
    <HelmetProvider>
      <Helmet>
        <title>Contact Us — SORO Fabrications Private Limited</title>
        <meta
          name="description"
          content="Get in touch with SORO Fabrications Private Limited. Contact us by email, phone, or WhatsApp, or use our enquiry form."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-soro relative z-10">
          <ScrollReveal>
            <div className="badge-blue mb-5 w-fit">Contact</div>
            <h1 className="text-display text-white mb-6 max-w-3xl">
              Let's Talk About{' '}
              <span className="gradient-text">Your Project</span>
            </h1>
            <p
              className="text-[#8A9DB5] text-lg max-w-2xl leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Have a question or want to discuss a project? Reach out through any of the
              channels below.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-[#0D1B2A]">
        <div className="container-soro">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <ScrollReveal>
              <div className="space-y-5">
                {/* Email */}
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="glass p-6 rounded-2xl flex items-start gap-4 hover:border-[#1E6FFF]/30 transition-colors group block"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#1E6FFF]/15 border border-[#1E6FFF]/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#1E6FFF]" />
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold text-sm mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Email
                    </h3>
                    <span
                      className="text-[#8A9DB5] text-sm group-hover:text-[#00AAFF] transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {COMPANY_EMAIL}
                    </span>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="glass p-6 rounded-2xl flex items-start gap-4 hover:border-[#1E6FFF]/30 transition-colors group block"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#1E6FFF]/15 border border-[#1E6FFF]/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#1E6FFF]" />
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold text-sm mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Phone
                    </h3>
                    <span
                      className="text-[#8A9DB5] text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {COMPANY_PHONE}
                    </span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass p-6 rounded-2xl flex items-start gap-4 hover:border-[#25D366]/30 transition-colors group block"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold text-sm mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      WhatsApp
                    </h3>
                    <span
                      className="text-[#8A9DB5] text-sm group-hover:text-[#25D366] transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Chat on WhatsApp
                    </span>
                  </div>
                </a>

                {/* Address */}
                <div className="glass p-6 rounded-2xl flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FF6B2B]/15 border border-[#FF6B2B]/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#FF6B2B]" />
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold text-sm mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Address
                    </h3>
                    <span
                      className="text-[#8A9DB5] text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {COMPANY_ADDRESS}
                    </span>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="glass p-6 rounded-2xl flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#00AAFF]/15 border border-[#00AAFF]/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#00AAFF]" />
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold text-sm mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Business Hours
                    </h3>
                    <span
                      className="text-[#8A9DB5] text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {BUSINESS_HOURS}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={0.15} className="lg:col-span-2">
              {submitState === 'success' ? (
                <div className="glass p-12 rounded-2xl text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Message Sent!
                  </h2>
                  <p className="text-[#8A9DB5] mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Thank you for reaching out. We'll get back to you within 1–2 business days.
                  </p>
                  <button onClick={() => setSubmitState('idle')} className="btn-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="glass p-8 rounded-2xl space-y-5"
                  noValidate
                >
                  <h2 className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Send Us a Message
                  </h2>
                  <div className="divider-glow" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contactName" className="input-label">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="contactName"
                        type="text"
                        className={`input-field ${errors.name ? 'error' : ''}`}
                        placeholder="Your full name"
                        {...register('name')}
                      />
                      <FieldError message={errors.name?.message} />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="input-label">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="contactEmail"
                        type="email"
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        placeholder="you@example.com"
                        {...register('email')}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactSubject" className="input-label">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contactSubject"
                      type="text"
                      className={`input-field ${errors.subject ? 'error' : ''}`}
                      placeholder="What is this about?"
                      {...register('subject')}
                    />
                    <FieldError message={errors.subject?.message} />
                  </div>

                  <div>
                    <label htmlFor="contactMessage" className="input-label">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="contactMessage"
                      rows={6}
                      className={`input-field resize-none ${errors.message ? 'error' : ''}`}
                      placeholder="Tell us how we can help…"
                      {...register('message')}
                    />
                    <FieldError message={errors.message?.message} />
                  </div>

                  {submitState === 'error' && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Failed to send your message. Please try emailing us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center py-3"
                    disabled={submitState === 'loading'}
                    id="submitContactButton"
                  >
                    {submitState === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Map Placeholder */}
              <div className="mt-6 glass rounded-2xl overflow-hidden h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-[#8A9DB5]/40 mx-auto mb-2" />
                  <p className="text-[#8A9DB5]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Map will be embedded once the verified company address is confirmed.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};

export default Contact;
