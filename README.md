# Maestro AI Solutions — Coming Soon

Ultra-clean dark landing page with a Three.js hero animation (neuron sphere + conductor batons). Built with Next.js (App Router), TypeScript, Tailwind CSS. No external fonts, no analytics.

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Three.js (no react-three-fiber)
- Playwright (smoke tests)

## Run locally
```bash
npm i
npm run dev
```
Open http://localhost:3000.

## Scripts
- `dev`: next dev
- `build`: next build
- `start`: next start
- `test`: Playwright smoke tests

## Deploy to Vercel
1. Push this repo to GitHub.
2. In Vercel, import the repo and select the Next.js framework preset.
3. Set Production branch to `main`.
4. Deploy. The app requires no env vars.
5. Attach custom domain `maestro-ai.nl`:
   - Option A (recommended): point nameservers to Vercel and add the domain in the project.
   - Option B: keep your DNS provider; add `A` (76.76.21.21) or `ALIAS/ANAME` to `cname.vercel-dns.com`.

## Accessibility & Performance
- System UI fonts only (no external font blocking).
- High-contrast neon accents on deep dark base `#0b0f14`.
- Canvas DPR clamped to 2; 60fps on mid devices.

## Tests
Playwright smoke tests verify:
- Brand text is visible
- Canvas is present and has non-zero size
- Both CTA mailto links exist

Run locally:
```bash
npm run test
```

## Notes
- Open Graph image is generated dynamically via `src/app/opengraph-image.tsx`.
- No analytics.
- Mailto CTAs: `info@maestro-ai.nl` with subject “Maestro — Early Access”.
