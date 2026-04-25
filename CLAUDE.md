# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 설정

모든 응답은 **한국어**로 작성한다.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
- `OPENAI_API_KEY` — GPT-4o story generation
- `REPLICATE_API_TOKEN` — Flux image generation
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` — Toss Payments (Korean payment gateway)

## Architecture

**BabyPet** is a Next.js 16 App Router app that generates AI images and emotional stories showing what a pet looked like as a baby. Primary audience is adopted pet owners in South Korea.

### User Flow (linear, multi-step)

```
/ (landing) → /upload → /info → /select → /generating → /result/[id]
```

State flows through a **Zustand store** (`src/store/petStore.ts`) persisted to localStorage. This is the single source of truth across all steps — photo file, pet metadata, selected plan, and generation results all live here.

### API Routes (`src/app/api/`)

| Route | Purpose |
|---|---|
| `generate-image/route.ts` | Calls Replicate → `black-forest-labs/flux-schnell`, returns baby pet image URLs |
| `generate-story/route.ts` | Calls OpenAI GPT-4o with JSON mode, returns structured emotional story |
| `payment/route.ts` | Toss Payments integration (stubbed, not fully wired) |

Both generation routes are called in parallel from `/generating/page.tsx`.

### Story Response Shape

GPT-4o returns a structured JSON: `title`, `story`, `wishMessage`, `closingLine`, `socialText`. The system prompt is crafted for emotional copywriting in Korean.

### Image Generation

Replicate Flux outputs WebP at 1:1 aspect ratio. Free plan watermarks images client-side; paid plans don't. The number of images depends on the selected plan (1 / 3 / 6 / 10+).

### Component Organization

- `src/components/landing/` — Marketing page sections (hero, problem, pricing, etc.)
- `src/components/result/` — Image carousel + story display + share card (uses `html2canvas`)
- `src/components/ui/` — Atomic UI: Button, Card, Modal, Toast

### Styling

Tailwind CSS with a custom warm/earthy theme defined in `tailwind.config.ts`:
- Colors: `cream` (#FAF7F2), `beige`, `warm-brown`, `deep-brown`, `soft-brown`
- Font: Pretendard (body), serif (headings)
- Animations: Framer Motion throughout

### Path Alias

`@/*` resolves to `./src/*` (configured in `tsconfig.json`).

## Key Constraints

- **No database** — the app is stateless; results are not persisted server-side. The `result/[id]` route uses a client-generated ID stored in Zustand.
- **Mobile-first** — max-width constrained layouts, touch-friendly interactions.
- **Korean market** — copy, payment gateway (Toss), and emotional framing are Korea-specific.
- **Brand tone** — warm, emotional, nostalgic. Avoid clinical or technical language in any user-facing copy.
