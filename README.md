# Mithran Ezhilarasan — Portfolio

Personal portfolio site. Data engineering projects, experience, and published research.

**Live:** _not deployed yet_ · **Contact:** ezhilarasan.m@northeastern.edu

---

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 14 (App Router), TypeScript |
| 3D / canvas | React Three Fiber, Three.js, `@react-three/drei` |
| Motion | GSAP + ScrollTrigger, Framer Motion, Lenis (smooth scroll) |
| Styling | Tailwind CSS, CSS custom properties |
| State | Zustand |

## Running locally

```bash
npm install
npm run dev
```

Opens on [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
npx tsc --noEmit  # type check (next.config.mjs ignores build-time TS errors)
```

## Structure

```
src/
├── app/                  # App Router entry, global styles
├── components/
│   ├── sections/         # Hero, Terminal, FeaturedVideo, Philosophy,
│   │                     #   Services, About, Experience, Projects,
│   │                     #   Research, Contact
│   ├── ui/               # DetailModal, Navbar, CustomCursor, LoadingScreen,
│   │                     #   PipelineDiagram, StreamMonitor, StarCanvas, …
│   └── providers/        # ClientShell, SmoothScrollProvider
├── data/                 # projects.ts, experience.ts, publications.ts, skills.ts
├── hooks/                # scroll progress, mouse position, reduced motion
├── lib/                  # gsap setup, constants, section themes, hero media
└── types/                # shared interfaces
```

Content lives in `src/data/` — editing a project, role, or publication means
editing data, not components. `DetailModal` provides the shared modal shell used
by Projects, Experience, and Research.

## Notes for future me

A few things in here are deliberate and easy to break by "tidying":

- **Modal `z-index` is 9990 and must stay below 9999.** `globals.css` sets
  `* { cursor: none !important }`, so the cursor *is* the `CustomCursor` canvas
  at `z-index: 9999`. A modal above it hides the pointer entirely.
- **Modals are portalled to `<body>`.** The sections live inside `main`
  (`z-10`), which is a stacking context, so a z-index set from inside it can
  never beat the fixed `z-50` navbar.
- **Modal wheel scrolling is handled manually.** Lenis owns wheel events
  document-wide and keeps calling `preventDefault` even while stopped, so
  native scrolling inside an overlay is not dependable.
- **Section glow gradients must fade out before their box edges.** Centring one
  at `50% 0%` makes it peak exactly where it gets clipped, which renders as a
  hard horizontal seam.
- **Project card width has a single source of truth.** The CSS and the GSAP
  horizontal-scroll distance must agree or the track overshoots the last card.

## License

All rights reserved. Code is public for reference; content, copy, and design
are not licensed for reuse.
