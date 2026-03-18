# website_builder-
# WebBuilder Platform 🚀

A full-stack website builder platform for creating and publishing course landing pages. Built with React, NestJS, PostgreSQL, and Next.js.

![WebBuilder](https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=400&fit=crop)

## Overview

WebBuilder is a drag-and-drop website builder specifically designed for online course creators. Build beautiful landing pages visually, attach course data, and publish as a static site or server-rendered page.

---

## Architecture

```
react_env/
├── admin/          → Drag & drop builder (React + Vite + TypeScript)
├── backend/        → REST API (NestJS + Prisma + PostgreSQL)
├── learner/        → Course site renderer (Next.js SSR)
└── cli/            → Static site generator (Node.js CLI)
```

---

## Features

### 🎨 Admin Builder
- Drag and drop visual editor
- 20+ components (Navbar, Hero, Pricing, Testimonials, FAQ, Progress bars etc.)
- Real-time property editing
- Template save and load
- Preview mode
- Export as JSON
- Move components up/down
- Duplicate and delete components
- Works in all browsers including Brave

### ⚙️ Backend API
- RESTful API built with NestJS
- PostgreSQL database with Prisma ORM
- Full CRUD for Templates, Websites, Courses, Lessons
- Template variable injection (`{{course.title}}`, `{{course.price}}` etc.)
- Slug-based website routing

### 🌐 Learner Site
- Server-side rendered with Next.js
- Fetches template + course data from API
- Injects course variables into layout
- SEO-ready with meta tags
- Lists all published websites

### 🖥 CLI Tool
- Pull any website by slug
- Build static HTML from layout + course data
- Deploy instructions for Netlify, Vercel, GitHub Pages
- Works completely offline after pull

---

## Tech Stack

| Layer | Technology |
|---|---|
| Admin UI | React 19, Vite, TypeScript, Zustand |
| Styling | Inline styles + Tailwind CSS |
| Drag & Drop | Pure mouse events (works in Brave) |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Learner Site | Next.js, SSR |
| CLI | Node.js, Commander.js |
| HTTP Client | Axios |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 16
- npm

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/webbuilder.git
cd webbuilder
```

### 2. Setup PostgreSQL
```bash
brew install postgresql@16
brew services start postgresql@16
createdb webbuilder
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/webbuilder"
npx prisma migrate dev --name init
npm run start:dev
```

Backend runs at `http://localhost:5000/api`

### 4. Setup Admin Builder
```bash
cd admin
npm install
# Create .env file
echo 'VITE_API_URL=http://localhost:5000/api' > .env
npm run dev
```

Admin runs at `http://localhost:5173`

### 5. Setup Learner Site
```bash
cd learner
npm install
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000/api' > .env.local
npm run dev -- --port 3000
```

Learner site runs at `http://localhost:3000`

### 6. Setup CLI
```bash
cd cli
npm install
```

---

## CLI Usage

```bash
# Pull a website by slug
node bin/site-cli.js pull <slug>

# Build static HTML
node bin/site-cli.js build -d ./<slug>

# Get deploy instructions
node bin/site-cli.js deploy -d ./<slug>

# Open in browser
open ./<slug>/dist/index.html
```

---

## API Endpoints

### Templates
| Method | Route | Description |
|---|---|---|
| POST | /api/templates | Create template |
| GET | /api/templates | List all templates |
| GET | /api/templates/:id | Get template |
| PUT | /api/templates/:id | Update template |
| DELETE | /api/templates/:id | Delete template |

### Websites
| Method | Route | Description |
|---|---|---|
| POST | /api/websites | Create website |
| GET | /api/websites | List all websites |
| GET | /api/websites/slug/:slug | Get by slug |
| PUT | /api/websites/:id/publish | Publish website |
| DELETE | /api/websites/:id | Delete website |

### Courses
| Method | Route | Description |
|---|---|---|
| POST | /api/courses | Create course |
| GET | /api/courses | List all courses |
| PUT | /api/courses/:id | Update course |
| POST | /api/courses/:id/lessons | Add lesson |
| DELETE | /api/courses/lessons/:id | Delete lesson |

---

## Template Variables

Use these placeholders in your templates — they get replaced with real course data automatically:

| Variable | Description |
|---|---|
| `{{course.title}}` | Course title |
| `{{course.description}}` | Course description |
| `{{course.instructor}}` | Instructor name |
| `{{course.price}}` | Course price |
| `{{course.duration}}` | Course duration |
| `{{course.level}}` | Skill level |
| `{{course.thumbnail}}` | Thumbnail image URL |

---

## Available Components

### Layout
- Section, Container, Grid, Columns, Spacer, Divider

### Content
- Heading, Text, Image, Button, Video, Badge, Code Block

### Composite
- Testimonial, Pricing Card, FAQ, Progress Bar, Icon + Text

### Website
- Navbar, Hero, Footer

---

## How Drag & Drop Works

We use **pure mouse events** (`mousedown`, `mousemove`, `mouseup`) instead of drag libraries because:

1. Works in all browsers including Brave
2. Full control over nested tree structure
3. Pixel-level drop positioning (before/after detection)
4. Zero dependencies
5. Same approach used by Figma and Webflow

---

## Project Structure

```
admin/src/
├── types/builder.ts          → TypeScript interfaces
├── store/
│   ├── builderStore.ts       → Zustand state + tree operations
│   └── dragState.ts          → Global drag tracker
├── components/
│   ├── layout/
│   │   ├── Builder.tsx       → Main layout
│   │   ├── ComponentPanel.tsx → Left panel
│   │   ├── Canvas.tsx        → Center canvas
│   │   ├── CanvasNode.tsx    → Node renderer + drag
│   │   └── PropertiesPanel.tsx → Right panel
│   └── common/
│       ├── NodeRenderer.tsx  → Visual component renderer
│       ├── Toolbar.tsx       → Top toolbar
│       ├── PreviewModal.tsx  → Preview mode
│       └── TemplatesModal.tsx → Templates list
├── services/
│   └── templateService.ts   → API calls
└── api/
    └── axiosInstance.ts     → Axios config
```

---

## Screenshots

### Admin Builder
> Drag and drop interface with component panel, canvas, and properties panel

### Learner Site
> Beautiful course landing page with all course data injected

### CLI Output
> Static HTML generated from template + course data

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**Amit Prasad**
- GitHub: [@amitprasad](https://github.com/amitprasad)

---

## Roadmap

- [ ] Authentication (JWT)
- [ ] Multi-page websites
- [ ] Custom domain support
- [ ] Media library
- [ ] More component types
- [ ] Mobile responsive editor
- [ ] Team collaboration
- [ ] Analytics dashboard