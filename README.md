# kandidatstudent-web

Frontend for [kandidatstudent.com](https://kandidatstudent.com) — an aggregator of all accredited university programmes in Bulgaria.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router, PPR) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript 5 |
| Hosting | Vercel |
| Data | REST API from the [`kandidatstudent`](https://github.com/cargopete/kandidatstudent) backend |

## Architecture

Server-first Next.js app using Partial Prerendering (PPR). All data fetching happens on the server via `src/lib/api.ts`, which calls the Rust backend over HTTP. Pages use `"use cache"` + `cacheLife("hours")` for server-side caching and `<Suspense>` boundaries for streaming.

No client-side state. No auth. No client-side data fetching. The only env var the app needs is `API_URL`.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — stats, institution grid, fields preview |
| `/institutions` | All 51 accredited HEIs, grouped by city |
| `/institutions/[slug]` | Institution detail — info cards + programmes |
| `/professional-fields` | All 52 professional fields, grouped by area |
| `/professional-fields/[code]` | Field detail — specialties + universities offering each |

## Local Development

**Prerequisites:** Node.js ≥ 20.9, backend API running locally on port 8082.

```bash
npm install
API_URL=http://localhost:8082 npm run dev
```

App starts at `http://localhost:3000`.

Or create `.env.local`:

```
API_URL=http://localhost:8082
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `API_URL` | Yes | Base URL of the backend API (no trailing slash) |

In production this is set in Vercel project settings and consumed at build time.

## Deployment

Pushes to `main` trigger an automatic Vercel deployment.

Manual deploy:

```bash
vercel deploy --prod --yes --scope nbgn
```

## Data Types

The frontend consumes four types from the backend, defined in `src/lib/api.ts`:

- **`Institution`** — university record (slug, names in BG/EN, city, ownership, URLs)
- **`ProfessionalField`** — one of 52 fields from ПМС 125/2002 (code, area, names)
- **`Specialty`** — canonical specialty (linked to a professional field by ID)
- **`Program`** — a degree offering at a specific institution (OKS level, study form, tuition, funding)

The `/api/v1/programs` endpoint is Meilisearch-backed and returns a paginated envelope:
```json
{ "hits": [...], "total": 0, "page": 1, "page_size": 50, "facets": {} }
```
All other endpoints return plain JSON arrays.

## Next.js PPR Notes

- Detail pages (`[slug]`, `[code]`) use `unstable_instant = false` to opt out of build-time instant validation — this conflicts with dynamic `generateMetadata` accessing async `params`.
- List and home pages use `unstable_instant = { prefetch: "static", unstable_disableValidation: true }` to keep prefetching without triggering the validator.
- The `params` prop in dynamic routes is a `Promise` in Next.js 16 — it must be awaited or passed into a `<Suspense>`-wrapped async component via `params.then(...)`.
