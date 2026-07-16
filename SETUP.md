# OpRisk Watch — Frontend (Next.js + shadcn/ui)

The Python app is now a **backend API** (`api.py`, FastAPI) and this is the
**frontend** (Next.js App Router + shadcn/ui). Components use shadcn *semantic*
tokens (`bg-background`, `text-primary`, `border`, …), so dropping them into your
existing Cardinal app makes them inherit your theme automatically.

## 1. Run the backend

In the Python project folder:

```bash
pip install -r requirements-api.txt
uvicorn api:app --reload --port 8000
```

Check it: open http://localhost:8000/stats — you should see JSON.
(Populate the DB first with `python fetch_job.py` if you haven't.)

## 2. Create the Next.js app + shadcn

If you're adding to your **existing** Cardinal app, skip to step 3 and just copy
the files in. For a **fresh** app:

```bash
npx create-next-app@latest oprisk-web --typescript --tailwind --app --eslint
cd oprisk-web
npx shadcn@latest init            # pick your Cardinal theme / base color
npx shadcn@latest add card badge button input skeleton
```

## 3. Drop in these files

Copy from this bundle into the app (same paths):

```
lib/types.ts
lib/api.ts
components/item-card.tsx
components/filter-bar.tsx
app/page.tsx
```

`@/lib/utils` (the `cn` helper) already exists from `shadcn init`.

## 4. Point the frontend at the API

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 5. Run

```bash
npm run dev
```

Open http://localhost:3000 — cards, filters, badges, all in your shadcn theme.

## Deploy (later)

- **Frontend → Vercel**: push the Next app to a repo, import in Vercel, set
  `NEXT_PUBLIC_API_URL` to your API's public URL.
- **API → a small host** (Render / Railway / Fly): `uvicorn api:app --host 0.0.0.0
  --port $PORT`; set `CORS_ORIGINS` to your Vercel domain.
- Persistence: SQLite is fine to start, but on ephemeral hosts add a scheduled
  fetch + a mounted volume or external DB (Phase 6).

## What's here vs. next

Built: API client, types, item card, filter bar, dashboard page.
Next: data table view, deadline timeline, detail drawer, source-health panel,
PDF/CSV export — all as shadcn components against the same API.
