# Kyozo Dataroom

A password-protected dataroom for sharing Kyozo company documents — technical docs, product overviews, security reviews, and company materials. The visual language mirrors the main **KyozoVerse** product: warm cream surfaces (`#FDFCFA`), brown ink text (`#5E4B3B`), Inter typography, and gold-on-cream accents (`#A88B6A → #B8775A`). The landing page borrows the structure and motion of the **spheres-tech** marketing site (hero, features, AI-style assistant, request callout, footer) — but recolored and reworded for an internal-diligence audience.

## Highlights

- **Single shared password** for visitors, separate password for admin analytics
- **Local SQLite** for analytics — no third-party tracker, no external service
- **Per-doc analytics**: visitor identity (label entered at login), dwell time, *active* time (excludes idle / background tabs), max scroll depth, and per-section visibility (which `h2`/`h3` each visitor lingered on)
- **Markdown + HTML + JSON** docs, served from `content/`, with TOC and syntax highlighting
- **Auto-imported** docs from `KyozoVerse/docs` and `~/Desktop/kyozo-docs`
- **KyozoVerse-aligned theme** — Inter font, warm cream palette, soft brown shadows, shadcn-style cards
- **Spheres-tech landing structure** — hero, features grid, live category cards, search-as-chat assistant, request-a-doc CTA, footer

## Run it

```bash
# 1. Install
npm install

# 2. Copy landing-page media from kyozo-pro-flow (videos, parallax photos,
#    decorative PNGs, iPhone mockup, etc.) into public/
npm run copy-assets

# 3. (Optional) re-import docs from source folders
npm run import-docs

# 4. Start dev server (port 3030)
npm run dev
```

> If your local checkout of kyozo-pro-flow lives somewhere other than
> `../kyozo-pro-flow`, set `KYOZO_PRO_FLOW_PUBLIC=/path/to/its/public` before
> running `npm run copy-assets`.

Open <http://localhost:3030>. You'll be redirected to `/login`.

- **Visitor password** lives in `.env.local` as `DATAROOM_PASSWORD`
- **Admin password** lives in `.env.local` as `ADMIN_PASSWORD` — sign in at `/admin/login`

Defaults committed for convenience (rotate these before sharing!):

| Variable             | Default                |
| -------------------- | ---------------------- |
| `DATAROOM_PASSWORD`  | `kyozo-preview-2026`   |
| `ADMIN_PASSWORD`     | `kyozo-admin-2026`     |
| `AUTH_SECRET`        | (32-byte hex, in file) |

## Pages

### `/` — public marketing landing
Publicly accessible (no password required). Shows the hero with floating gradient orbs, the six-card feature grid, four category previews **without** revealing individual doc names, the "Request a doc that isn't here?" form, and the footer. A sticky top nav with "Enter the dataroom" CTA points visitors to `/login`. If a visitor already has a valid session cookie, they're auto-redirected to `/docs` so they don't have to re-enter.

### `/login` — visitor gate
Split-screen. Left panel: animated gold/rust gradient orbs over a grid mask, badge chip (*Confidential — invite only*), gradient-word headline, three feature lines (encrypted in transit / audit on every visit / revocable), and a stat row at the bottom (Categories / SOC 2 / V1 Preview). Right panel: name + password form, signed-cookie auth on submit.

### `/admin/login` — admin gate
Same hero treatment, copy adjusted for analytics. Password-only form.

### `/docs` — authenticated landing
The post-login surface inside the sidebar layout. Same visual structure as `/` but with the doc data wired up: categories list real doc names with deep-links, the assistant is a working local search over titles/descriptions/filenames, and the sidebar is visible for direct navigation. Five sections inherited from spheres-tech:

1. **Hero** — chip + gradient headline + lede + two CTAs (Start reading / Browse by category) + stat row, with two floating orbs and a stylised doc-preview card on the right (shimmer-animated skeleton lines, opinion callout box).
2. **Features** — six cards (curated reading order, engineering depth, audit on every visit, search assistant, encrypted in transit, always-current). Hover lifts the card, gold-borders it, and scales the icon tile.
3. **Categories** — live grid of the four shelves (Technical, Company, Legal, Finance), each surfacing its top five docs as deep-links.
4. **Assistant** — the spheres-tech chat-widget UI, repurposed as on-page search. Typing a query searches across doc titles / descriptions / filenames and the bot replies with markdown-linked matches.
5. **Request callout** — re-purposed waitlist card with email + request-text form and a zoom-in success state.
6. **Footer** — four-column lockup with brand, room links, legal callouts, contact.

### `/docs/[slug]` — doc article
Back link, category chip in the gold-soft style, large heading, lede, meta row (updated date + reading-time estimate, both with gold icons). The prose has bordered `h2` separators, gold list markers, accent-gold inline links. Sticky TOC on the right tracks which heading is in view.

### `/admin` — analytics dashboard
KPI tiles, tabs, top-pages bar chart, visitor table, page table, hottest sections, recent activity — all in the warm cream theme.

## Adding documents

Drop files into `content/<category>/`:

```
content/
  technical/   ← code, APIs, architecture
  company/     ← strategy, competitive analysis
  legal/       ← runbooks, policies
  finance/     ← forecasts, cap tables
```

Supported file types:

- `.md` — rendered with syntax highlighting and a TOC. Optional frontmatter:
  ```yaml
  ---
  title: My Doc
  description: One-line tagline
  order: 1
  ---
  ```
- `.html` — rendered in a sandboxed iframe (good for full-fidelity exports from Notion, Google Docs, etc).
- `.json` — pretty-printed in a code block.

Add a new category by creating `content/<category>/` and adding it to `CATEGORY_META` in `src/lib/content.ts`.

## Re-importing from source folders

`npm run import-docs` will copy from:

- `../KyozoVerse/docs/` → `content/technical/`
- `~/Desktop/kyozo-docs/` → `content/technical|company|legal/` (auto-routed by filename)

Override paths with `KYOZOVERSE_DOCS` and `DESKTOP_DOCS` env vars.

## Design system

All design tokens live in **`src/styles/tokens.css`** — palette, type stack, radii, shadows, transitions. Tweak there and everything else picks it up.

```css
/* The KyozoVerse palette, ported */
--background-color:  #FDFCFA;   /* page content bg */
--page-bg:           #F9FAFB;   /* outer app bg */
--text-color:        #5E4B3B;   /* body text */
--heading-color:     #88796E;   /* headings */
--primary:           #E5DFD1;   /* button bg */
--accent:            #D4C5B4;   /* hover, active rail */
--accent-gold:       #A88B6A;   /* highlights */
--accent-rust:       #B8775A;   /* secondary highlights */
--border-color:      #E7E7E6;
--border-color-strong: #D4C5B4;
```

Typography is **Inter** loaded via `next/font/google`. Border radius scale is `0.25 / 0.375 / 0.5 / 0.75 / 1rem` — same as KyozoVerse / shadcn. Shadows are soft warm-brown tints (`rgba(94, 75, 59, …)`) rather than black.

## Brand assets

- **`public/favicon.svg`** — generated "K" mark on cream, gold gradient stroke
- **`src/components/Logo.tsx`** — inline brand lockup (mark + wordmark, optional `Dataroom` subtitle). Renders the same generated mark used in the favicon.

To swap in the official KyozoVerse logo, copy `KyozoVerse/public/logo.svg` (and/or `favicon.svg`) into this project's `public/`, then update `Logo.tsx` to render `<Image src="/logo.svg" />` instead of the inline SVG. The official files are large because they wrap a PNG — for an internal dataroom the inline mark is lighter and self-contained.

## How analytics work

- Login records the visitor in SQLite with the optional name they typed (e.g. *"Jane Doe — Acme Ventures"*) and creates a session.
- Every page mount opens a `page_view`; a heartbeat updates dwell + scroll every 20s; on tab close `navigator.sendBeacon` flushes the final numbers.
- Section-visibility uses `IntersectionObserver` against each `h2`/`h3`. Time spent with a section in view is summed into `section_views`.
- The admin dashboard at `/admin` shows total visitors, top pages, top sections, per-visitor breakdown, and recent activity.

The DB lives at `data/analytics.db` — wipe it any time to start fresh.

## File map

```
src/
  app/
    layout.tsx                   root html shell, loads Inter
    page.tsx                     redirects → /docs
    login/                       visitor password gate (hero left, form right)
    admin/                       admin login + analytics dashboard
    docs/
      layout.tsx                 sidebar + header + Tracker
      page.tsx                   landing entry — passes data to LandingClient
      LandingClient.tsx          hero / features / categories / assistant / request / footer
      landing.module.css         all landing styling
      [slug]/                    doc article renderer
        page.tsx
        DocBody.tsx              back link, category chip, body, TOC
        doc.module.css
    api/
      auth/login                 POST password → set signed cookie
      auth/logout                POST clear cookies
      track/pageview             POST open/heartbeat/close
      track/event                POST section dwell + arbitrary events
  components/
    Logo.tsx                     mark + wordmark brand lockup
    Sidebar.tsx                  fixed nav, search, footer
    Header.tsx                   sticky chrome with Confidential badge
    Tracker.tsx                  client-side analytics beacon
  lib/
    auth.ts        cookie signing + password check (WebCrypto HMAC, edge-compatible)
    db.ts          better-sqlite3 + schema
    content.ts     filesystem doc loader
    markdown.ts    marked + highlight.js renderer with TOC
    analytics.ts   admin queries
  middleware.ts    routes the cookie gate
  styles/
    tokens.css     the entire design system (palette, type, radii, shadows)
    globals.css    base styles, prose, scrollbar, card primitive
content/           your docs, grouped by category
data/              SQLite db lives here (gitignored)
scripts/           import-docs.mjs
public/
  favicon.svg      generated K mark
```

## Customising the look

The dark theme is gone — this is a light-only product. To shift the palette:

1. Open `src/styles/tokens.css` and adjust the `:root` block. The whole app picks it up.
2. To switch fonts, change the `Inter` import in `src/app/layout.tsx` (also adjust the `--font-family` token).
3. To change the accent (currently warm gold→rust), update `--accent-gold`, `--accent-rust`, and `--accent-gold-soft` — those three drive every chip, eyebrow, link, gradient, and active state.

## Capturing screenshots

A Playwright recipe ships at `scripts/snapshots.mjs`. After `npm install` it'll work out-of-the-box:

```bash
# first time only — download the headless Chromium
npx playwright install chromium

# 1. Start the dev server
npm run dev

# 2. In a separate terminal, capture all five pages
npm run snap
```

Outputs land in `public/screenshots/`:

| File              | Page              |
| ----------------- | ----------------- |
| `login.png`       | `/login` (visitor gate) |
| `landing.png`     | `/docs` (post-login landing) |
| `doc.png`         | The first doc in the sidebar |
| `admin-login.png` | `/admin/login` |
| `admin.png`       | `/admin` (analytics dashboard) |

The script reads `DATAROOM_PASSWORD` and `ADMIN_PASSWORD` from `.env.local` to log in. Override the base URL with `SNAP_BASE_URL=https://your.dataroom.url npm run snap`.

## Deploying

The default config uses `better-sqlite3`, which only works on a long-running Node server. For Vercel-style serverless you'd need to swap `src/lib/db.ts` for Postgres or Vercel KV. For self-hosting (Render, Fly, a VPS), `npm run build && npm start` is enough.

---

**Confidential — invite only.** Everything inside is non-public.
# data-room
