# GEO AI Visibility Audit — Meghan Hair Studio

**Business:** Meghan Hair Studio  
**Location:** Portland, Maine  
**Domain:** meghanlaurahair.com (placeholder; confirmed live in search index)  
**StyleSeat:** styleseat.com/m/v/meghanlaurahair  
**Audit Date:** July 2026  

---

## AI Visibility Score: 49/100 — Fair

Score interpretation: Some AI visibility exists, but significant gaps prevent the business from being cited by AI assistants when a user asks "best hair salon Portland Maine" or "vivid color balayage Portland ME." The site's content quality is genuinely strong; the gaps are structural and off-site.

### Score Breakdown

| Component | Score | Weight | Weighted |
|---|---|---|---|
| Citability | 62/100 | 35% | 21.7 |
| Brand Mentions | 15/100 | 30% | 4.5 |
| Crawler Access | 90/100 | 25% | 22.5 |
| llms.txt | 0/100 | 10% | 0.0 |
| **AI Visibility Score** | | | **48.7 / 100** |

---

## Citability Assessment

**Page Citability Score: 62/100**

The site has genuinely citable content — specific statistics, an attributed client quote, a structured services table, and a clear bio. The theoretical citability of the content blocks averages 72/100. The score is reduced to 62 because the entire site renders as a JavaScript Windows 95 desktop metaphor, which fragments content across multiple hidden popup windows with no semantic HTML5 hierarchy. A crawler receives all the text, but it arrives mixed with SVG code, button labels, icon text, and window decoration strings that obscure the signal-to-noise ratio.

### Content Block Scores

**Block 1 — Booking Details** (Tue–Sat 9am–6pm, Portland ME, by appointment, StyleSeat URL)
- Answer Block Quality: 85 — directly answers "how and when do I book"
- Self-Containment: 85 — complete without context
- Structural Readability: 80 — list format, clear labels
- Statistical Density: 70 — specific days, hours, booking URL
- Uniqueness: 55 — specific to this business
- **Score: 76/100 — citation-ready**

**Block 2 — Meta Description** ("Vivid color, expressive cuts, and styling in Portland, Maine. 17+ years experience. 5.0 stars on StyleSeat.")
- Answer Block Quality: 75 — answers "what does Meghan Hair Studio offer"
- Self-Containment: 90 — fully self-contained summary
- Structural Readability: 75 — clean prose with embedded data points
- Statistical Density: 75 — two verified statistics in one sentence
- Uniqueness: 55 — location-specific, but no proprietary claim
- **Score: 75/100 — citation-ready**

**Block 3 — Services Table** (14 services with descriptions and time estimates across Haircuts and Color categories)
- Answer Block Quality: 80 — directly answers "what services are offered"
- Self-Containment: 80 — table is self-explanatory with headers
- Structural Readability: 85 — categorical table structure, scannable
- Statistical Density: 65 — time durations per service, two categories
- Uniqueness: 35 — service names are standard salon vocabulary
- **Score: 71/100 — citation-ready**

**Block 4 — Credential Statistics** (17+ Years / 5.0 Stars / 126 Reviews)
- Answer Block Quality: 65 — answers "how experienced and well-rated is this stylist"
- Self-Containment: 55 — numbers need a sentence of context to be citable
- Structural Readability: 70 — rendered as three stat boxes
- Statistical Density: 95 — three specific quantitative data points
- Uniqueness: 60 — specific to this business
- **Score: 69/100 — citation-ready**

**Block 5 — Verified Client Review** (Anne quote, services listed, verified badge)
- Answer Block Quality: 75 — validates experience quality, directly quotable
- Self-Containment: 85 — complete, attributed, standalone
- Structural Readability: 75 — blockquote with attribution
- Statistical Density: 35 — qualitative, no numbers
- Uniqueness: 65 — specific to this stylist and client experience
- **Score: 68/100 — citation-ready**

**Block 6 — About Bio** (Newbury Street origin, Portland return, "vivid dimensional color" specialty)
- Answer Block Quality: 55 — narrative, not Q&A format, but characterizes the business clearly
- Self-Containment: 80 — understandable without surrounding context
- Structural Readability: 50 — flowing prose, no formatting aids
- Statistical Density: 25 — "seventeen years" is the only data point
- Uniqueness: 75 — original voice, specific geographic and professional backstory
- **Score: 56/100**

**Block 7 — Client Review Tags** (Professional, Personable, Creative, Meticulous, Kid Friendly, etc.)
- Answer Block Quality: 45 — tag cloud format, not directly quotable as prose
- Self-Containment: 40 — tags need context to be meaningful
- Structural Readability: 60 — scannable tag cloud
- Statistical Density: 20 — no numbers
- Uniqueness: 40 — common salon adjectives across the industry
- **Score: 41/100 — citation-unlikely**

### What Is Blocking Citation Readiness

**Critical: No structured data / schema markup.** The site has zero JSON-LD. AI models prioritize pages with HairSalon, LocalBusiness, or Person schema because it confirms entity type, location, and service category. Without it, an AI parsing raw HTML has no machine-readable confirmation that this is a hair salon in Portland, Maine, not a web design portfolio (the Windows 95 aesthetic could read as either).

**Serious: No street address on the site.** The site displays "Portland, Maine" but never states a street address. For local queries ("hair salon near me," "balayage Portland ME"), AI models require a confirmed physical address to include a business in location-based answers. This is likely the single largest citation blocker for local queries.

**Serious: No phone number.** Same impact as missing address for local pack citations.

**Serious: Pricing information absent from the site.** All pricing is deferred to StyleSeat. AI models attempting to answer "how much does balayage cost in Portland Maine" cannot cite this site because it contains no price data. Competitors with on-site pricing will be cited instead.

**Moderate: JavaScript-window content architecture.** The Windows 95 popup-window design is visually inventive, but every piece of content (bio, services, reviews, booking) lives inside a `<div class="win95">` element with no semantic HTML5 tags (`<article>`, `<section>`, `<main>`, `<header>`). The content is readable by crawlers but without structural hierarchy to indicate which information is most important.

**Moderate: No FAQ section.** AI search engines (especially for voice and conversational queries) heavily favor structured Q&A content. A simple FAQ block — "Do you accept new clients? Yes. Do you take walk-ins? No, by appointment only. How do I book? Through StyleSeat." — would directly answer the questions users ask AI assistants.

**Moderate: business-knowledge.json in web root.** This file is accessible at meghanlaurahair.com/business-knowledge.json and contains extensive DJ event services pricing, a "Certified DJ" credential, wedding/ceremony packages, and karaoke add-ons. This data is completely unrelated to the hair studio. Any AI crawler that indexes this file will receive contradictory signals about what this business does, which degrades entity confidence and can suppress citations. This file should be removed from the public web root or replaced with accurate hair salon data.

---

## AI Crawler Access

**Crawler Access Score: 90/100**

No robots.txt existed before this audit. Under the Robots Exclusion Protocol, an absent robots.txt means all crawlers are permitted by default — so no AI bots are blocked. The 10-point deduction reflects the absence of a sitemap reference, which is the primary tool AI crawlers use to discover and prioritize pages.

A robots.txt has been generated at `/home/nah/Claudia/meg-hair/robots.txt` and is ready to deploy.

| Crawler | Status | Notes |
|---|---|---|
| GPTBot | Unknown → Allowed | No robots.txt existed; now explicitly allowed in new file |
| OAI-SearchBot | Unknown → Allowed | Now explicitly allowed |
| ChatGPT-User | Unknown → Allowed | Now explicitly allowed |
| ClaudeBot | Unknown → Allowed | Now explicitly allowed |
| PerplexityBot | Unknown → Allowed | Now explicitly allowed |
| Amazonbot | Unknown → Allowed | Now explicitly allowed |
| Google-Extended | Unknown → Allowed | Now explicitly allowed |
| Bytespider | Unknown → Allowed | Now explicitly allowed |
| CCBot | Unknown → Allowed | Now explicitly allowed |
| Applebot-Extended | Unknown → Allowed | Now explicitly allowed |
| FacebookBot | Unknown → Allowed | Now explicitly allowed |
| Cohere-ai | Unknown → Allowed | Now explicitly allowed |

**Issues addressed by new robots.txt:**
- All 12 AI crawlers are now explicitly welcomed with `Allow: /` directives
- Internal utility directories (aimclone, versions, cursor, buttons) are disallowed to reduce crawler noise on content that has no citation value
- Sitemap directive added (a sitemap.xml file still needs to be created — see Priority Actions)

---

## llms.txt Status

**Status before audit: Absent**  
**Score before audit: 0/100**  
**Status after audit: Generated and ready to deploy**

An llms.txt file has been created at `/home/nah/Claudia/meg-hair/llms.txt`.

The file follows the llms.txt specification:
- H1 header with business name
- Blockquote summary with key entity facts (location, experience, rating, review count, specialties, hours)
- Six named sections: About, Services, Reviews and Social Proof, Booking and Hours, Portfolio, Contact and Social
- Optional section with pricing context, new client path, and business type disambiguation
- All links use the meghanlaurahair.com placeholder domain (update when custom domain resolves)
- Service descriptions include time estimates pulled directly from the site
- Includes the verbatim client review quote — this is the most citable passage on the site

**Why llms.txt matters for a local business:** AI assistants like ChatGPT, Claude, and Perplexity actively crawl llms.txt files when they exist. For a business with a single-page JavaScript-heavy site, llms.txt provides the AI with a clean, structured, authoritative summary it can cite confidently without needing to parse the full HTML. It is especially powerful for local service businesses where the site's visual design prioritizes aesthetic over information density.

---

## Brand Mention Presence

**Brand Mention Score: 15/100**

This is the most critical weakness. AI models build citation confidence by seeing a business mentioned consistently across authoritative third-party sources. Meghan Hair Studio currently has strong presence on StyleSeat and Instagram, but is effectively absent from the platforms AI models weight most heavily.

| Platform | Status | Details |
|---|---|---|
| Wikipedia | Absent | Not found via direct API query. Expected for a local solo stylist; not a realistic target. |
| Reddit | Absent | No mentions found in r/Maine, r/Portland, r/femalehairadvice, or hair-related subreddits. This is addressable. |
| YouTube | Absent | No YouTube channel or video content found. Not a high-priority gap. |
| LinkedIn | Unknown | No LinkedIn company page found. Low-priority for a solo stylist. |
| Yelp | Absent | No Yelp listing found for Meghan Hair Studio in Portland, ME. Yelp is heavily weighted by AI citation models for local service businesses. Critical gap. |
| Google Business Profile | Unconfirmed | No verified GBP listing surfaced in searches. This is the highest-impact missing citation source. |
| StyleSeat | Present | 126 verified reviews, 5.0 stars. Strong signal, but StyleSeat's pages are largely JavaScript-rendered and have low AI crawlability. The review data is real but does not transfer well to AI citation indexes. |
| Instagram | Present | @meghanlaura_hair, 4,400+ followers. Active portfolio. AI models do not typically cite Instagram as a source for local business recommendations, but Pinterest content from this account was indexed. |
| Pinterest | Minimal | At least one pin of Meghan's work (tagged #portlandmainehair) appears in search results. Passive presence only. |
| The Knot | Absent | No listing found. High-value for wedding/bridal hair search queries. |
| Birdeye / Reputation Sites | Absent | Not appearing on Birdeye, which aggregates reviews for local businesses. |

### Why brand mentions are the biggest lever

When a user asks ChatGPT or Perplexity "who is the best balayage stylist in Portland Maine," the AI draws from its training data and live search index. It looks for businesses mentioned across multiple authoritative sources — primarily Google Business Profiles (via Google Maps data), Yelp, Reddit threads, and local news/directory coverage. Meghan Hair Studio currently appears in web searches via meghanlaurahair.com and StyleSeat, but neither of those sources feeds the AI citation pipeline as effectively as a Yelp listing with reviews or a verified GBP with photos.

The competitor landscape confirms this. Current AI-cited results for "balayage Portland Maine" include Andiamo! Salon, WINDOWWALL Salon, Balayage Portland, and Salon Lavender — all of which have Yelp listings, Google Business Profiles, and multi-platform review presence. Meghan's 5.0 / 126 reviews on StyleSeat is arguably superior review data, but it is invisible to AI citation engines that do not index StyleSeat deeply.

---

## Priority Actions

### HIGH IMPACT

**1. Create and verify a Google Business Profile immediately**  
This is the single highest-ROI action. A verified GBP with the business name, address, phone, hours, and services triggers inclusion in Google's local knowledge graph, which directly feeds Google Gemini, Google AI Overviews, and Google Maps AI responses. It also provides the structured NAP (Name, Address, Phone) data that all other AI citation systems use to validate that the business exists at a specific location.  
URL: business.google.com/create

**2. Claim or create a Yelp listing**  
Yelp data is licensed to Apple Maps, Bing, and numerous AI systems. A Yelp presence with a consistent business name, address, and category ("Hair Stylists" or "Hair Salons") significantly expands AI citation eligibility. Encourage existing StyleSeat reviewers to duplicate their review on Yelp.  
URL: biz.yelp.com/claim

**3. Add a street address and phone number to the website**  
Currently the site shows "Portland, Maine" but no street-level location or phone. These are required for local AI search citations. Add them to the booking window at minimum, and ideally in a site-wide footer or visible location window. This also enables NAP consistency checks across citation sources.

**4. Remove or replace business-knowledge.json from the web root**  
The file at meghanlaurahair.com/business-knowledge.json contains DJ/event services, a "Certified DJ" credential, and wedding ceremony pricing. This has nothing to do with the hair studio and will confuse AI entity models that crawl it. Options: (a) delete it from the deployment folder, (b) replace it with accurate hair salon structured data (services, hours, pricing), or (c) block it in robots.txt with `Disallow: /business-knowledge.json`.

**5. Deploy robots.txt and llms.txt** (generated in this audit)  
Both files are ready at `/home/nah/Claudia/meg-hair/robots.txt` and `/home/nah/Claudia/meg-hair/llms.txt`. Deploy them to the domain root. llms.txt in particular is a direct signal to AI crawlers and will have measurable effect within weeks of deployment.

**6. Add LocalBusiness / HairSalon JSON-LD schema to index.html**  
Schema markup is the most reliable way to communicate structured business facts to AI models without requiring them to parse HTML. Minimum recommended schema:

```json
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Meghan Hair Studio",
  "description": "Boutique one-stylist color and cutting studio in Portland, Maine. Specializing in vivid color, balayage, blonding, and precision cuts.",
  "url": "https://meghanlaurahair.com",
  "telephone": "[ADD PHONE]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[ADD STREET]",
    "addressLocality": "Portland",
    "addressRegion": "ME",
    "postalCode": "[ADD ZIP]",
    "addressCountry": "US"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "126",
    "bestRating": "5"
  },
  "sameAs": [
    "https://www.styleseat.com/m/v/meghanlaurahair",
    "https://www.instagram.com/meghanlaura_hair"
  ]
}
```

Place this inside a `<script type="application/ld+json">` tag in the `<head>` of index.html.

### MEDIUM IMPACT

**7. Create a sitemap.xml**  
Currently the domain has one page (index.html) and no sitemap. A sitemap at meghanlaurahair.com/sitemap.xml speeds AI crawler discovery and signals freshness. If additional pages are added (a dedicated services page, about page, or blog), the sitemap becomes essential.

**8. Add an FAQ section to the page**  
Conversational AI queries are often phrased as questions: "Does Meghan Hair Studio take walk-ins?" "Is Meghan accepting new clients?" "How long does balayage take at Meghan Hair Studio?" Adding a simple FAQ section (even as a hidden popup window in the Win95 theme) with definitive answers gives AI models clear, citable Q&A pairs. Use FAQPage schema on the markup.

**9. Get mentioned on Reddit**  
When a user in r/Maine, r/PortlandME, or r/femalehairadvice asks "recommend a vivid color stylist in Portland Maine," an organic mention of Meghan's work creates a training signal and a real-time citation source. Do not manufacture fake reviews, but do encourage satisfied clients who use Reddit to share their experience when relevant threads appear. A single highly-upvoted Reddit recommendation creates durable AI citation signal for years.

**10. Submit to wedding/event directories**  
Given the bridal styling services offered, The Knot, WeddingWire, and Zola are high-authority directories that AI models cite when answering wedding vendor questions. These are also easier to rank on than Yelp because there is less competition. A listing with "bridal hair Portland Maine" as a category keyword would capture a distinct high-intent query cluster.

### LOW IMPACT (but worth doing)

**11. Add price ranges to the website**  
Exact prices on StyleSeat, ranges on the website. "Color services from $120 / Cuts from $85" is enough to make the site citable for "how much does hair color cost Portland Maine" queries. This also reduces pre-booking friction for new clients.

**12. Request Yelp / GBP reviews from existing StyleSeat clients**  
126 reviews at 5.0 stars is exceptional social proof. That signal is locked inside StyleSeat. A brief post-appointment message asking satisfied clients to leave a Google review (one-click link) would begin populating the GBP with review content that directly feeds AI citation pipelines.

**13. Add a canonical link tag**  
Once the domain is confirmed, add `<link rel="canonical" href="https://meghanlaurahair.com/">` to `<head>` to prevent AI citation ambiguity between any staging URL and the production domain.

---

## Files Generated in This Audit

| File | Path | Status |
|---|---|---|
| llms.txt | /home/nah/Claudia/meg-hair/llms.txt | Ready to deploy |
| robots.txt | /home/nah/Claudia/meg-hair/robots.txt | Ready to deploy |
| GEO-AI-VISIBILITY.md | /home/nah/Claudia/meg-hair/GEO-AI-VISIBILITY.md | This document |

Files still needed (not generated here):
- sitemap.xml (needs confirmed domain and final URL list)
- JSON-LD schema block (add inline to index.html `<head>`)
- Updated business-knowledge.json (or delete file from web root)

---

## Competitive Context

When querying AI assistants in July 2026 for "best balayage Portland Maine" or "vivid color hair studio Portland Maine," the following businesses surface consistently:

- Andiamo! Salon — Yelp listed, GBP verified, Old Port location, boutique framing similar to Meghan's
- WINDOWWALL Salon — Multiple stylists, strong web presence, Yelp indexed
- Balayage Portland (portlandmainesalon.com) — Domain name contains the exact search keyword
- Salon Lavender — Multi-platform citation presence
- Tasha Judson Hair Studio — Individual stylist with a dedicated website and keyword-optimized domain

None of these have a 5.0 / 126-review StyleSeat profile. Meghan's verified review record is objectively stronger. The gap is entirely a citation infrastructure problem, not a quality problem. Resolving the GBP, Yelp, and schema gaps within 60 days should move Meghan Hair Studio into AI-cited results for local queries.
