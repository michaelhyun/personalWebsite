# Michael Hyun · Real Estate Website

A premium, editorial-luxury website for Michael Hyun — Bay Area REALTOR® (BlueDoor Realty · Compass),
serving the South Bay and Tri-Valley East Bay.

Built as a fast, dependency-light **static site** (HTML/CSS/vanilla JS) that hosts anywhere.

---

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — hero, intro, differentiators, services, valuation CTA, communities, search |
| `about.html` | Meet Michael — story, core values |
| `buy.html` | Buyers — home search + 7-step buyer experience |
| `sell.html` | Sellers — free valuation form + 7-step seller experience |
| `newsletter.html` | Newsletter sign-up page (what subscribers get + form) |
| `resources.html` | Lead magnets / guides (currently "Coming Soon" cards) |
| `contact.html` | Contact form + direct details |

## Run locally
```bash
python3 -m http.server 4173
# then open http://localhost:4173
```

## Design
- **Type:** Fraunces (display serif) + Hanken Grotesk (body) — loaded from Google Fonts
- **Palette:** warm stone canvas, ink near-black, restrained bronze accent (`assets/css/styles.css` → `:root`)
- **Motion:** Lenis smooth scroll + scroll reveals, hero parallax, count-ups, accordion, mobile menu
  (all respect `prefers-reduced-motion`)

---

## ✅ Already wired up
- **Phone:** (408) 489-6868 · **DRE#:** 02442479 — live across all pages
- **Socials:** [Instagram](https://www.instagram.com/michaelhyun__/) · [TikTok](https://www.tiktok.com/@michaelhyun_) · [YouTube](https://www.youtube.com/@michaelhyun-1)
- **Follow Up Boss tracking pixel** (`WT-RYYSCNAM`) installed in the `<head>` of every page
- **Contact + valuation forms** wired to FUB via Web3Forms (access key installed in `assets/js/main.js`),
  delivering submissions to your FUB lead email (`michael.hyun@compass.com`)
- **Newsletter** — a dedicated [newsletter.html](newsletter.html) sign-up page, plus a **pop-up**
  that appears ~4.5s after a visitor lands (once per visitor, remembered in `localStorage`). Both feed
  the same Web3Forms→FUB pipeline, tagged "Newsletter signup" so you can build your list now and plug in
  a real email tool (Mailchimp, Beehiiv, FUB campaigns…) later. Footer "Newsletter" link → the page.
  Popup timing/copy live in the `NEWSLETTER POPUP` block of `assets/js/main.js`. It re-asks **at most
  once every 7 days** per visitor (timestamp in `localStorage`); change `SHOW_EVERY` to adjust.
- **Resources** ([resources.html](resources.html)) lists lead magnets (Bay Area Vendors List + more) as
  **"Coming Soon"** cards. To launch one: build its landing page + form, then on the card swap
  `is-soon` → `is-ready`, add the `href`, and replace the badge with a "Get the guide →" link
  (instructions are in an HTML comment on the page).
- **Homepage videos** — hero + valuation band use slow architectural luxury-home footage
  (licensed [Pexels](https://www.pexels.com) clips) with a darkened tint for legibility and a
  still-image poster fallback (also used for reduced-motion users)

## ⚙️ Still using placeholders — swap when ready

1. **Home search** — the search bars currently open Compass search. To use your IDX/Compass search URL,
   edit the `data-search-form` handler in `assets/js/main.js`.
2. **Photography** — interior/community stills are licensed Unsplash placeholders
   (`images.unsplash.com/...`). The hero/band **videos** are licensed Pexels clips
   (`videos.pexels.com/...`). Swap either for your own listing media anytime for a fully owned look.
   Your portrait (`assets/img/michael-portrait.jpg`) is already in place.
3. **7-step process copy** (buy/sell) — written as strong defaults; tweak to match your exact Buyer/Seller Experience.
4. **Testimonials** (reviews page) — sample quotes; replace with real client reviews.

---

## 🔗 Connect the contact + valuation forms to Follow Up Boss (≈2 minutes)

> **Note:** the FUB **tracking pixel/widget** (`WT-RYYSCNAM`) is already installed and live on every page —
> it tracks visitors and powers your FUB chat widget. The steps below are a *separate* path that also routes
> the site's **own contact + valuation forms** into FUB. Both run together.

The forms (Contact page + Sell valuation) are ready to send leads straight into FUB. No server needed.

**Step 1 — Get your FUB lead-parsing email**
In Follow Up Boss: **Admin → Lead Sources → Add Lead Source → "Connect by email"**.
FUB gives you a unique address (e.g. `leads+xxxx@followupboss.me`). Any lead email sent there
auto-creates a contact and tags the source.

**Step 2 — Create a free form endpoint**
Sign up at **[web3forms.com](https://web3forms.com)** (free). Create an access key and, in its settings,
set the forwarding / "send a copy to" address to your FUB lead-parsing email from Step 1.

**Step 3 — Paste your key**
In `assets/js/main.js`, replace:
```js
var FUB_FORM_ENDPOINT_KEY = "YOUR-WEB3FORMS-ACCESS-KEY";
```
with your Web3Forms access key. Done — submissions now flow into Follow Up Boss automatically.

> Until a key is added, the forms gracefully fall back to opening the visitor's email client
> addressed to michael.hyun@compass.com, so nothing is ever lost.

*(Prefer Formspree, a Zapier/Make webhook, or the FUB API via a serverless function? Any of those can
replace `FUB_ENDPOINT` / the submit handler — the markup stays the same.)*

---

## Deploy
Drag the folder onto **Netlify** or **Vercel**, or push to **GitHub Pages** / **Cloudflare Pages**.
No build step required.
