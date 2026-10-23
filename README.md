# SORO Fabrications Private Limited — Official Website

A production-ready, fully responsive engineering company website built with React, Vite, TypeScript, and Tailwind CSS.

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

1. Copy `.env.example` to `.env`
2. Fill in your EmailJS credentials and company details (see `.env.example`)
3. Sign up at [emailjs.com](https://www.emailjs.com) and create quote/contact templates

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
| Company email, phone, WhatsApp | ⏳ Pending |
| Company address | ⏳ Pending |
| Official logo file | ⏳ Pending |
| Google Maps embed URL | ⏳ Pending |
| Real project photos | ⏳ Pending |
| Team/leadership profiles | ⏳ Pending |
| Certifications & awards | ⏳ Pending |
| Real testimonials | ⏳ Pending |
| Company brochure PDF | ⏳ Pending |
| Social media links | ⏳ Pending |
| Domain name | ⏳ Pending |

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npx vercel deploy
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
5. Uncomment the `emailjs.send()` call in `Quote.tsx` and `Contact.tsx`

---

## 🔒 Security

- Never commit `.env` to git (already in `.gitignore`)
- Update WhatsApp placeholder before launch
- For production file uploads, implement a secure backend

---

## 📦 Tech Stack

React 19 · Vite 8 · TypeScript 5 · Tailwind CSS 4 · React Router 7 · Framer Motion · React Three Fiber / Three.js · React Hook Form · Zod · Lucide React · EmailJS · React Helmet Async
