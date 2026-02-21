# Ski Scrapper

> **This is a freelancing project developed for a travel agency** to help their customers and agents easily discover, compare, and track ski resort information, packages, and pricing from across the web — all in one place.

---

## 📋 Project Overview

Ski Scrapper is a web scraping and aggregation platform built for a travel agency that specializes in ski and winter sports holidays. It automates the collection of ski resort data, package deals, and availability information, saving agents countless hours of manual research.

---

## 🛠️ Technical Details

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Runtime** | Node.js |
| **Font** | [Geist](https://vercel.com/font) via `next/font` |

### Key Features

- 🔍 **Web Scraping** — Automated scraping of ski resort websites for up-to-date pricing and availability
- 📊 **Data Aggregation** — Consolidates data from multiple sources into a single, unified view
- ⚡ **Server-Side Rendering** — Leverages Next.js SSR for fast, SEO-friendly pages
- 📱 **Responsive UI** — Mobile-first design for use by agents on any device
- 🔄 **Auto-Updates** — Pages auto-refresh as underlying data changes

### Project Structure

```
├── app/              # Next.js App Router pages & layouts
│   ├── page.tsx      # Main entry point
│   └── layout.tsx    # Root layout
├── components/       # Reusable UI components
├── lib/              # Scraping logic & utilities
├── public/           # Static assets
└── styles/           # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Adbhut07/Ski-Scrapper.git
cd Ski-Scrapper

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you make edits.

---

## 🏗️ Build & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy on Vercel

The easiest way to deploy this Next.js app is via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) — features and API reference
- [Learn Next.js](https://nextjs.org/learn) — interactive tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

---

*Built with ❤️ as a freelancing project for a travel agency.*