# SORO Fabrications Private Limited — Official Website

A responsive engineering and product-development website built with React, Vite, TypeScript, and Tailwind CSS.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ⚙️ Environment Configuration

1. Copy `.env.example` to `.env`.
2. Create an EmailJS service and quote/contact templates.
3. Set `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_QUOTE_TEMPLATE_ID`, `VITE_EMAILJS_CONTACT_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` in `.env` and in the Vercel project settings.
4. Restart the development server after changing environment variables.

The contact and quote forms report success only after EmailJS confirms delivery. Without these values, submission shows an error and provides the company email as a fallback. File uploads are not enabled.

### PCB project form

The form at `/pcb-design` currently provides a local, multi-step review only. Project details and selected file objects are not sent to SORO, and selecting files does not upload them. The form supports files up to 500 MB total for local selection and validates their extensions.

Enabling real project submissions requires a secured server endpoint with server-side input validation, file type and size enforcement, private storage permissions, and a confirmed delivery workflow. Do not treat the browser-only review state as an enquiry received by SORO.

---

## 📁 Project Structure

```
SORO/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── layout/     ← Navbar, Footer, Layout
│   │   ├── ui/         ← ScrollReveal
│   │   ├── shared/     ← ServiceCard, ProjectCard
│   │   └── 3d/         ← HeroScene (Three.js)
│   ├── data/
│   │   ├── services.ts      ← Edit service details here
│   │   ├── projects.ts      ← Add/edit portfolio projects
│   │   ├── industries.ts    ← Edit industry descriptions
│   │   └── testimonials.ts  ← Add real testimonials
│   ├── pages/          ← All 11 pages
│   ├── router/         ← React Router v6 config
│   ├── types/          ← TypeScript interfaces
│   └── main.tsx
├── .env.example
├── index.html
└── vite.config.ts
```

---

## 📝 Content Required Before Launch

| Item | Status |
|---|---|
| Company email mailbox verification | Needs confirmation |
| Business phone, WhatsApp, and address | Not supplied |
| Official logo and SF favicon artwork | Not present in workspace |
| Verified project records and approved photography | Not supplied |
| Team, certification, and testimonial details | Not supplied |
| Published resource documents | In preparation |
| Production domain | Confirm before updating sitemap and Vercel |

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npx vercel deploy
# For a production deployment after linking the project:
npx vercel --prod
```
Set environment variables in Vercel → Settings → Environment Variables.

### Netlify
Add `public/_redirects` with: `/* /index.html 200`

### Manual (any static host)
```bash
npm run build
# Upload dist/ to your server
```
Configure server to serve `index.html` for all routes (SPA routing).

---

## 📮 EmailJS Setup

1. Create account at [emailjs.com](https://www.emailjs.com)
2. Connect your email (Gmail/Outlook)
3. Create two templates — Quote and Contact
4. Copy Service ID, Template IDs, and Public Key to `.env`
5. Configure the four `VITE_EMAILJS_*` variables in the hosting provider.

---

## 🔒 Security

- Never commit `.env` to git (already in `.gitignore`)
- Do not add phone, address, or WhatsApp details until verified
- File attachments require a secure backend and are currently unavailable

---

## 📦 Tech Stack

React 19 · Vite 8 · TypeScript 5 · Tailwind CSS 4 · React Router 7 · Framer Motion · React Three Fiber / Three.js · React Hook Form · Zod · Lucide React · EmailJS · React Helmet Async
