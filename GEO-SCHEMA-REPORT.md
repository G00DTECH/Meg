# GEO Schema Report — Meghan's Hair Studio

**Generated:** 2026-07-02
**Source file:** index.html (Windows 95-themed single-page site)
**Canonical URL used:** https://meghanlaurahair.com (placeholder — update when domain is live)

---

## Schema Score: 0/100 (baseline) — All gaps addressed by schema.jsonld

The site currently has zero structured data. Every score point below is a gap now filled by the generated schema.

---

## Critical Context: JavaScript Rendering Risk

This site is a pure client-side JavaScript application built as a Windows 95 desktop simulation. The entire content — services, bio, reviews, hours — is rendered inside JS-controlled window elements. **GPTBot, ClaudeBot, PerplexityBot, and most AI crawlers do not execute JavaScript.** This means without JSON-LD in the `<head>`, these crawlers see a nearly blank page with no business information whatsoever.

The JSON-LD in `schema.jsonld` must be placed in the `<head>` of `index.html` — not in the body, and not injected by JavaScript. Placing it statically in `<head>` is the only way AI crawlers will process it. This is the single highest-impact technical action available for this site.

---

## Data Extracted from index.html

| Field | Value | Source |
|---|---|---|
| Business name | Meghan's Hair Studio | win-welcome window title |
| Alternate name | Meghan Laura Hair | inferred from social handles |
| Location | Portland, Maine | win-book body, win-status bar, meta description |
| Hours | Tue–Sat, 9am–6pm | win-book body |
| Booking type | By appointment only | win-book body, win-status bar |
| StyleSeat URL | https://www.styleseat.com/m/v/meghanlaurahair | href in win-book and taskbar tray |
| Instagram handle | @meghanlaura_hair | href in win-book and win-insta windows |
| Rating | 5.0 stars | About window stat-box, win-reviews header |
| Review count | 126 verified | win-reviews title, rev-count element |
| Experience | 17+ years | About window stat-box, meta description |
| Specialty | Vivid, dimensional color | about-right bio copy |
| Background | Started on Newbury Street, Boston | about-right bio copy |
| Review quote | "Meghan is super knowledgeable..." — Anne | rev-quote-box (displayed on page) |
| Services count | 14 | win-services table |
| Street address | Not present in source | — |
| Phone number | Not present in source | — |
| Geo coordinates | Not present in source | — |
| Logo image | Not present in source | — |
| Stylist full name | Meghan Laura (inferred) | StyleSeat slug + Instagram handle |

---

## Schemas Generated

### 1. HairSalon (LocalBusiness subtype)

**Why `HairSalon` instead of `LocalBusiness`:** Schema.org has a specific `HairSalon` type that inherits from `HealthAndBeautyBusiness > LocalBusiness`. Using the most specific type gives search engines and AI models the most precise entity classification. Google supports `LocalBusiness` rich results; the `HairSalon` subtype carries full LocalBusiness eligibility.

**Properties included:**

| Property | Value | Notes |
|---|---|---|
| @id | #business fragment | Internal entity anchor for cross-referencing |
| name | Meghan's Hair Studio | Official display name from site |
| alternateName | Meghan Laura Hair | Brand name from social handles |
| url | https://meghanlaurahair.com | Canonical placeholder |
| description | Full bio-derived description | 17 years, Portland, vivid color |
| address (PostalAddress) | Portland, ME, US | No street number available |
| openingHoursSpecification | Tue–Sat 09:00–18:00 | Extracted from booking window |
| priceRange | $$ | Estimated for an independent color specialist |
| aggregateRating | 5.0, 126 reviews | Directly from stat boxes and reviews window |
| review | Anne's review | Review is displayed on the page — eligible for schema |
| employee | @id ref to Person | Links stylist entity to the business |
| hasOfferCatalog | 14 service @id refs | All services linked as named entities |
| sameAs | Instagram, StyleSeat | Both confirmed active profile URLs |

**What's missing from source (add when available):**

- `telephone` — add phone number if Meghan has a business line or wants to display one
- `streetAddress` — street address unlocks map pack eligibility and local pack ranking
- `geo` (GeoCoordinates) — latitude/longitude improves local search precision
- `logo` — add an ImageObject with the logo URL once one exists
- `image` — a primary photo of the studio or Meghan improves rich result display

---

### 2. Person (Meghan Laura)

**Why a Person schema:** E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is a core ranking and citation signal. A `Person` schema linked to the business via `employee`/`worksFor` tells AI models that this is an identifiable expert with 17+ years in the field. When someone asks an AI "who is the best hair colorist in Portland Maine," the Person schema provides the named entity data needed to surface Meghan specifically.

**Properties included:**

| Property | Value |
|---|---|
| @id | #meghan fragment |
| name | Meghan Laura |
| jobTitle | Color Artist and Hair Stylist |
| description | 17+ year experience, Newbury Street background, Portland |
| url | https://meghanlaurahair.com |
| image | /images/bio%20pic.jpg (URL-encoded path) |
| worksFor | @id ref to HairSalon |
| knowsAbout | 7 topic areas matching her specialty |
| sameAs | Instagram, StyleSeat |

**Note on name:** The source HTML uses only "Meghan" throughout. The full name "Meghan Laura" is inferred from the StyleSeat slug (`meghanlaurahair`) and Instagram handle (`meghanlaura_hair`). Confirm this is her actual name before deploying.

**What would strengthen this schema:**
- Add LinkedIn profile URL to `sameAs` if one exists
- Add a personal website or portfolio URL to `sameAs` if separate from the studio site

---

### 3. WebSite

**Why included:** The `WebSite` schema establishes the site as a named web entity and links it to the business. It is required groundwork for potential Sitelinks Search Box eligibility (which requires a `SearchAction` on `WebSite`). No `SearchAction` was added because the site has no search functionality — adding a fake one would cause a Google validation error.

**Properties included:** `@id`, `url`, `name`, `description`, `publisher` (ref to HairSalon)

---

### 4. Service Schemas (14 services)

**Why individual `Service` entities:** Google uses service structured data to understand what a local business actually offers. More importantly, AI models queried with questions like "does anyone in Portland do full balayage" or "who offers color correction near me" rely on named service entities to match business capabilities to intent. Each service is a first-class entity with its own `@id` so it can be cross-referenced from the HairSalon's `hasOfferCatalog`.

**Services generated:**

| Service | Category | Duration | @id |
|---|---|---|---|
| Bang Trim | Haircuts | 15 min | #service-bang-trim |
| 30 Min Clean Up | Haircuts | 30 min | #service-30min-cleanup |
| Maintenance Cut | Haircuts | 1 hour | #service-maintenance-cut |
| Revival Cut | Haircuts | 1.5 hours | #service-revival-cut |
| Transformation Cut | Haircuts | 2 hours | #service-transformation-cut |
| Root Touch Up | Color | 45 min | #service-root-touch-up |
| All Over Color | Color | 45 min | #service-all-over-color |
| Partial Balayage | Color | 1 hr 15 min | #service-partial-balayage |
| Partial Custom Blonding | Color | 1 hour | #service-partial-custom-blonding |
| Full Foil Highlights | Color | 2 hours | #service-full-foil-highlights |
| Bleach & Tone | Color | 2 hours | #service-bleach-tone |
| Full Balayage | Color | 2 hours | #service-full-balayage |
| Color Correction | Color | Varies | #service-color-correction |
| Hair Consultation | Consultation | 15 min | #service-consultation |

Each Service includes:
- `serviceType` (Haircut / Hair Color / Consultation)
- `category` (matching the table header categories from the site)
- `description` (copied verbatim from the services window)
- `provider` (ref to HairSalon entity)
- `offers` with booking URL and availability
- `additionalProperty` for appointment duration (where fixed)

**Pricing note:** No prices are shown on the site ("Pricing available on StyleSeat"). Service schemas include the StyleSeat URL as the `Offer.url` so users can get exact quotes there. Do not add placeholder prices — inaccurate price data in schema markup can cause Google to suppress rich results.

---

### Why No BreadcrumbList

This is a single-page application. There is no URL hierarchy, no interior pages, and no navigation paths to represent. A BreadcrumbList with a single node (the homepage) would be technically valid but provides no semantic value and would not render as a rich result. Omitted intentionally.

---

### Why No FAQ Schema

The site does not contain FAQ-style content. The services window is a table, not a Q&A structure. FAQPage schema since August 2023 only generates rich results for government and health authority sites — adding it here would provide no search benefit. Omitted intentionally.

---

## JSON-LD Structure

The generated schema uses a single `@graph` array inside one `<script>` tag. This is the recommended pattern when multiple entities on the same page need to cross-reference each other using `@id` fragments. All entity links (employee, worksFor, provider, publisher) use `{"@id": "..."}` pointer syntax rather than duplicating data, keeping the markup DRY.

---

## Implementation Instructions

1. Open `/home/nah/Claudia/meg-hair/index.html`
2. Locate the closing `</head>` tag (currently at line 12)
3. Copy the full contents of `schema.jsonld`
4. Paste immediately before `</head>` — the `<script type="application/ld+json">` block goes directly in the HTML document head
5. Do not wrap it in any additional JavaScript or defer/async attributes — it must be present in the initial HTML response

**Example placement in index.html:**
```html
  <link rel="stylesheet" href="styles.css">

  <script type="application/ld+json">
  { ... full @graph block ... }
  </script>
</head>
```

---

## What to Update When Available

These fields were left out because the data does not exist in the current source. Fill them in as soon as the information is confirmed:

| Field | Where to add | Priority |
|---|---|---|
| Street address | `address.streetAddress` in HairSalon | Critical — required for map pack |
| Phone number | `telephone` in HairSalon | High |
| Geo coordinates | `geo.latitude` / `geo.longitude` in HairSalon | High |
| Logo URL | `logo` in HairSalon | Medium |
| Instagram profile URL for Person | additional entry in Person.sameAs | Medium |
| Stylist name confirmation | verify "Meghan Laura" in Person.name | Required before deploy |

---

## sameAs Gap Analysis

The `sameAs` array is the primary mechanism by which AI models resolve that the Instagram profile, the StyleSeat profile, and the website are all the same real-world entity. Currently the schema links to two platforms. The following would strengthen entity resolution significantly:

| Platform | Status | Action |
|---|---|---|
| Instagram | Linked | Done |
| StyleSeat | Linked | Done |
| Facebook | Not linked | Add if business page exists |
| Yelp | Not linked | Add Yelp business page URL if listed |
| Google Business Profile | Not linked | Add GBP URL once claimed/verified |
| Wikipedia | Not applicable | Individual stylist studio unlikely to have a Wikipedia page |

---

## Priority Actions

1. **CRITICAL** — Paste schema.jsonld into `<head>` of index.html before deploying to the custom domain. Without this, AI crawlers see zero content from this JavaScript-rendered site.

2. **CRITICAL** — Add a street address to the schema and to the site's visible content. Without a street address, the business cannot appear in Google's local map pack for "hair salon near me" queries in Portland.

3. **HIGH** — Verify that "Meghan Laura" is the correct full name for the Person schema. The bio uses only "Meghan" and the name is inferred from handles. If her last name is something other than "Laura," update `Person.name` before deploying.

4. **HIGH** — Add a phone number to both the schema (`telephone`) and the visible HTML. StyleSeat-only contact is a conversion bottleneck and a local SEO weakness.

5. **HIGH** — Claim and verify a Google Business Profile. The GBP URL should then be added to `HairSalon.sameAs`. GBP is the strongest local SEO signal and is independent of this schema work.

6. **MEDIUM** — Add a logo image to the HairSalon schema and to the `<head>` as an Open Graph image tag. The site currently has no shareable image metadata.

7. **LOW** — Once the custom domain is live and the Netlify URL is retired, confirm that canonical redirects are in place (301 from Netlify URL to meghanlaurahair.com) so the schema's `@id` URLs remain authoritative.
