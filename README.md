# Whiskey Chronicles

A weekly whiskey-history site. The **oldest 5 stories are free** for
every visitor; every story after that requires an active Wix Pricing
Plan. Members log in with their Wix account, subscribe to a plan
(checkout is Wix-hosted), and the site checks their order status before
unlocking each gated story.

## How it's wired

- **Content** — each weekly story is a markdown file in `content/stories/`
  with frontmatter (`title`, `date`, `excerpt`, `region`, `image`) plus a
  markdown body of ~1,000–1,400 words (a 5–7 minute read at ~200 wpm —
  `lib/stories.ts` estimates and displays `readMinutes` per story). The
  body can embed inline images with standard `![caption](url)` markdown;
  `app/components/StoryMarkdown.tsx` renders those as full-width figures
  with the alt text shown as a caption underneath.
- **Free tier** — `lib/stories.ts`'s `getFreeSlugs()` sorts stories
  oldest-first and takes the first `FREE_STORY_COUNT` (5) slugs. Both the
  home page and story pages union that set with `hasActivePlan()` to
  decide what's unlocked, so the free tier always tracks the 5 oldest
  stories as new ones get published — no manual flagging per file.
- **Images** — each story has a hero `image` in frontmatter (card
  thumbnail + page hero, via `next/image`) plus 1–2 inline images in the
  body (see above). `next.config.ts` allowlists `images.unsplash.com` —
  swap in your own CDN/domain there if you host images elsewhere.
- **Interactivity** — `app/components/StoryBrowser.tsx` is a client
  component with a region filter (button chips) over the story grid, plus
  hover states on cards. It's the one client component in the app;
  everything else stays server-rendered.
- **Auth** — `@wix/sdk`'s `OAuthStrategy` drives a standard OAuth/PKCE
  flow: `/login` starts it, `/callback` exchanges the code for member
  tokens, `/logout` clears them. Tokens live in an httpOnly cookie
  (`lib/session.ts`) — nothing touches localStorage.
- **Gating** — `lib/access.ts` calls `orders.memberListOrders({ orderStatuses: ["ACTIVE"] })`
  from `@wix/pricing-plans` for the logged-in member. Any active order
  unlocks every gated story; no active order shows the excerpt plus a
  subscribe CTA.
- **Checkout** — `/plans` lists public pricing plans
  (`plans.listPublicPlans()`), sorted cheapest first, with the priciest
  plan badged "Best value". `lib/format-price.ts` turns each plan's
  `pricing` object (amount + billing cycle) into a display string like
  `$5.00 / month` or `$50.00 / year`. Selecting a plan posts to
  `/api/checkout`, which opens a Wix-hosted Pricing Plans checkout via
  `redirects.createRedirectSession({ paidPlansCheckout: { planId } })`
  and redirects back to `/` on completion.

## One-time setup

1. **Create the Wix Headless OAuth app.** In the Wix dashboard, add an
   OAuth app (Headless / custom site) to the Wix site that owns your
   Pricing Plans. Copy its **Client ID**.
2. **Create the Pricing Plans.** In that same Wix site's dashboard, go to
   Business Solutions → Pricing Plans → Plans & Pricing → **Add a
   Plan**, and create the two subscription tiers this site expects:
   - **Monthly** — recurring, **$5.00 / month**, no end date (billed
     until canceled).
   - **Annual** — recurring, **$50.00 / year**, no end date.

   Both plans must be marked **public** (visible to site visitors and
   members) or they won't show up on `/plans`. This app doesn't create
   or edit plans — pricing lives entirely on the Wix side, and `/plans`
   just lists and sorts whatever public plans it finds. Changing the
   price later is likewise a Wix dashboard change, not a code change.
3. Copy `.env.example` to `.env.local` and set:
   ```
   WIX_CLIENT_ID=<your OAuth app client id>
   ```
4. Install and run:
   ```bash
   npm install
   npm run dev
   ```
5. Open <http://localhost:3000>. Logging in redirects to your Wix site's
   hosted login; subscribing redirects to the hosted Pricing Plans
   checkout. Both redirect back into this app when done.

## Publishing a new weekly story

Add `content/stories/YYYY-MM-DD-slug.md`:

```markdown
---
title: "Story Title"
date: "2026-07-06"
excerpt: "One or two sentences shown to everyone, including non-subscribers."
region: "Region name"
image: "https://images.unsplash.com/photo-XXXXXXXXXXXXX-XXXXXXXXXXXX?auto=format&fit=crop&w=1200&q=70"
---

Full story body here.
```

It appears automatically on the home page, newest first, and at
`/stories/<slug>`. The 5 oldest stories by `date` stay free permanently;
every story published after those first 5 is gated behind a plan. Change
`FREE_STORY_COUNT` in `lib/stories.ts` to adjust the free-tier size.

## Notes / known gaps

- `plans.listPublicPlans()` is marked deprecated in the current SDK in
  favor of a v3 query API; kept here since it's the simplest working
  call today. Worth revisiting if Wix removes it.
- No local caching/ISR on the stories list — fine at this content volume,
  reconsider if the archive grows large.
- Sample story images are hot-linked from Unsplash for the demo content —
  replace with your own hosted/licensed images before shipping publicly.
  Where the actual brand has a real, verifiable photo on Unsplash (Jack
  Daniel's, Crown Royal, Jameson, Nikka, plus real Kentucky/Scottish
  distillery barrel shots), the sample content uses it; where no such
  photo exists (Bushmills specifically, Amrut, Suntory/Yamazaki), the
  sample uses the closest genuine whiskey photo available rather than an
  unrelated stock image — swap these for your own brand photography.
