# Cube11 — AI video, made simple

A clean, beginner-friendly AI video creation platform built for creators in India and Southeast Asia. Cube11 wins on three things competitors keep getting wrong:

1. **Free preview, paid commit** — every generation produces a low-res preview at zero cost. Credits only burn when you accept the HD render. Failed renders are auto-refunded and visible in the credit log.
2. **Three-step generation** — pick a template (or type an idea) → pick a vibe word → generate. No "guidance scale", no "Pikaframes".
3. **Region-first templates** — Reels, Shorts, TikTok, **WhatsApp Status**, Vertical YouTube Long, Facebook Ads, with a pinned "Trending in your region" row. Multilingual subtitles default to Hindi, Tamil, Bahasa, Vietnamese, Tagalog, Thai and more.

## Tech

- **Next.js 15** (App Router, RSC) + **React 19**
- **TypeScript strict**
- **Tailwind v4** + **shadcn/ui** (custom dark/indigo theme)
- **Zustand** for client state, **TanStack Query v5** for server state
- **@dnd-kit** for the vertical clip reorder
- **Framer Motion** for micro-interactions
- **lucide-react** icons
- PWA-installable on mobile

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The app redirects to `/projects`. State is persisted in `localStorage` so you can refresh and pick up where you left off.

## Folder structure

```
src/
├── app/
│   ├── (app)/                 # Authenticated app shell
│   │   ├── projects/          # List + workspace + per-clip editor
│   │   ├── templates/         # Big-card template gallery + regional row
│   │   ├── videos/            # Rendered videos library
│   │   ├── account/           # Profile + transparent credits log
│   │   └── new/               # 3-step generation flow
│   ├── api/                   # Mocked route handlers
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── shell/                 # Sidebar / BottomNav / TopBar / CreditMeter
│   ├── projects/              # ProjectCard, ClipList, ClipCard
│   ├── templates/             # TemplateGrid, RegionalRow, TemplateCard
│   ├── generate/              # 3-step flow
│   └── editor/                # 4-tab editor (Subtitles, Music, Text, Trim & Speed)
├── lib/
│   ├── api/                   # React Query hooks
│   ├── stores/                # Zustand stores (projects, credits, editor, generation)
│   ├── data/                  # Seed templates, styles, languages, projects
│   └── utils.ts
├── hooks/                     # use-media-query, use-region
└── types/
```

## Design rules

- Dark base, indigo accents, generous whitespace
- Sidebar (desktop) collapses to a bottom tab bar (mobile) with a centered "+ New" floating action button
- Mobile-first responsive. PWA-installable.
- Plain language everywhere ("Cinematic / Cute / Bold / Clean / Trendy" — no jargon)
- Credit Meter is always visible and itemized — refunds are explicit, not hidden

## What's mocked

- `POST /api/generate` returns a sample video URL after ~1.8 s
- `POST /api/render` returns success ~95% of the time (the 5% failure path triggers an auto-refund)
- Projects, templates and credits are persisted in `localStorage`

To plug in a real provider (Runway, Kling, Pika, MiniMax, Hailuo, Sora, etc.), implement the same response shapes inside the route handlers and the React Query hooks under `src/lib/api/`.

## License

Proprietary — © Cube11.
