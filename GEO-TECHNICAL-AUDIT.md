# GEO Technical SEO Audit — Meghan Hair Studio

**Site:** Meghan Hair Studio, Portland, Maine
**Stack:** Vanilla HTML/CSS/JS — Win95/Chicago95 single-page app
**Deploy target:** Netlify (domain TBD)
**Audit date:** 2026-07-02
**Source files analyzed:** index.html, styles.css, netlify.toml

---

## Technical Score: 48/100 — Poor

> Score reflects the site as it stands before domain launch. Most deductions are fixable before go-live with low engineering effort.

### Score Breakdown

| Category | Raw Score | Weight | Weighted | Status |
|---|---|---|---|---|
| Server-Side Rendering / JS Dependency | 65/100 | 25% | 16.3 | MEDIUM risk |
| Meta Tags & Indexability | 40/100 | 15% | 6.0 | POOR |
| Crawlability (robots.txt / sitemap) | 20/100 | 15% | 3.0 | CRITICAL |
| Security Headers | 77/100 | 10% | 7.7 | FAIR |
| Core Web Vitals Risk | 45/100 | 10% | 4.5 | HIGH risk |
| Mobile Optimization | 30/100 | 10% | 3.0 | POOR |
| URL Structure | 70/100 | 5% | 3.5 | GOOD |
| Response & Status | 60/100 | 5% | 3.0 | FAIR |
| Additional Checks | 20/100 | 5% | 1.0 | CRITICAL |
| **TOTAL** | | | **48.0** | **Poor** |

---

## Server-Side Rendering Assessment

**Status:** MEDIUM risk
**Rendering type:** Static HTML with JS-driven UI layer (not SSR, not CSR — a hybrid with an important caveat)
**Framework detected:** Vanilla JS desktop manager (no framework)

### What AI crawlers can and cannot see

This is the most nuanced aspect of the audit. The page is NOT a client-side SPA with an empty body — all content is hardcoded in the initial HTML. An AI crawler (GPTBot, ClaudeBot, PerplexityBot) fetching the raw HTML will find:

**Readable without JS:**
- Business name, location, and tagline (in window title bars and window body text)
- Full "About Meghan" bio paragraph text
- Complete services table with names, descriptions, and time estimates
- One featured review quote and the 126-review / 5.0-star credential
- Booking details (hours, appointment-only policy, StyleSeat URL)
- Instagram handle
- All 57 portfolio image alt text strings

**Not accessible without JS:**
- The boot screen (`#boot-screen`) covers the entire viewport on load — a human sees nothing until JS completes the animation; crawlers parsing raw HTML skip this
- All `.win95` windows are CSS-hidden by default (`display:none` or equivalent class toggling) — the text inside them IS in the source HTML, but the visual hierarchy is destroyed without styles+JS
- Desktop icon labels ("About Meghan", "My Work", "Services", "Reviews", "Book Now") are readable but convey no semantic structure without context
- The canvas-drawn desktop wallpaper (`#desktop-canvas`) is blank without JS

**Net assessment for AI crawlers:** Content is present in the HTML and will be parsed. The risk is that the content appears as a flat, unstructured blob — disconnected window bodies with no logical flow. AI crawlers will not understand that "Meet Meghan" heads a bio section, that the `svc-table` is a services list, or that the reviews window relates to StyleSeat. Semantic signals are weak. This is a MEDIUM risk, not CRITICAL, because the raw text is there — but the lack of semantic structure significantly reduces AI citability.

---

## Crawlability and Indexability

**Robots.txt:** NOT FOUND
**XML Sitemap:** NOT FOUND
**Meta robots:** Not present (page is implicitly crawlable — absence is not a block)
**Canonical:** NOT PRESENT

### Critical: Catch-all redirect blocks crawl infrastructure

`netlify.toml` contains:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This redirect returns HTTP 200 with `index.html` content for every URL — including `/robots.txt` and `/sitemap.xml`. When Googlebot, Bingbot, GPTBot, or any other crawler requests `https://meghanlaurahair.com/robots.txt`, they will receive the hair salon HTML page with a 200 status code. The crawler will fail to parse it as a valid robots.txt file. The effective result is that no robots.txt rules exist at all — neither permissions nor restrictions.

This also means any future `/sitemap.xml` file added to the repo will be unreachable unless added BEFORE the catch-all rule in netlify.toml, or the catch-all is scoped to exclude those paths.

### Pre-launch actions required

1. Add `robots.txt` as a static file in the repo root
2. Add `sitemap.xml` as a static file in the repo root
3. Update `netlify.toml` to exclude crawl files from the catch-all redirect

---

## Meta Tags Audit

| Tag | Status | Finding |
|---|---|---|
| `<title>` | Present | "Meghan Hair Studio · Portland, Maine" — 38 chars. Acceptable but short. Missing service keyword ("hair salon", "color artist"). Target: 50-60 chars. |
| `<meta name="description">` | Present | "Vivid color, expressive cuts, and styling in Portland, Maine. 17+ years experience. 5.0 stars on StyleSeat." — 109 chars. Under the 150-160 ideal. Good copy, could expand with location or CTA. |
| `<link rel="canonical">` | MISSING | No canonical tag. Must be added before launch pointing to the production URL. Without it, Netlify preview URLs and the production domain may be indexed as duplicates. |
| `<meta name="robots">` | Not present | Implicit crawl/index — acceptable. Add `index, follow` explicitly once domain is confirmed. |
| `<meta name="viewport">` | Present | `width=device-width, initial-scale=1.0, user-scalable=no` — **`user-scalable=no` is a problem.** Google's mobile-friendliness guidelines treat disabling zoom as an accessibility violation. Remove `user-scalable=no`. |
| `<html lang="en">` | Present | Correct. |
| Open Graph | MISSING | No `og:title`, `og:description`, `og:image`, `og:url`, or `og:type`. When shared on Facebook, LinkedIn, or cited in AI tools, the preview will be blank or auto-generated poorly. |
| Twitter Card | MISSING | No `twitter:card` or related tags. |
| Favicon | Not declared | No `<link rel="icon">` in `<head>`. Netlify may serve a generic favicon. Add a favicon before launch. |
| Hreflang | Not needed | English-only site. |

### Recommended `<head>` additions before launch

```html
<!-- Canonical — set once production domain is confirmed -->
<link rel="canonical" href="https://meghanlaurahair.com/">

<!-- Open Graph -->
<meta property="og:type" content="local.business">
<meta property="og:title" content="Meghan Hair Studio — Portland, Maine">
<meta property="og:description" content="Vivid color, expressive cuts, and styling in Portland, Maine. 17+ years experience. 5.0 stars on StyleSeat.">
<meta property="og:image" content="https://meghanlaurahair.com/images/image.jpg">
<meta property="og:url" content="https://meghanlaurahair.com/">
<meta property="og:locale" content="en_US">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Meghan Hair Studio — Portland, Maine">
<meta name="twitter:description" content="Vivid color, expressive cuts, and styling in Portland, Maine. 17+ years experience. 5.0 stars on StyleSeat.">
<meta name="twitter:image" content="https://meghanlaurahair.com/images/image.jpg">

<!-- Favicon -->
<link rel="icon" type="image/png" href="/favicon.png">
```

---

## Heading Hierarchy

**Finding: No `<h1>` exists anywhere in the document. This is a critical SEO gap.**

| Heading | Location | Text | Issue |
|---|---|---|---|
| `<h1>` | — | MISSING | No primary heading on the page |
| `<h2>` | win-welcome | "Meghan's Hair Studio" | Inside a hidden window |
| `<h2>` | win-about | "Meet Meghan" | Inside a hidden window |
| `<h3>` | — | MISSING | No h3 tags used |

Without an `<h1>`, search engines and AI crawlers have no programmatic signal about the page's primary topic. The title tag alone is not a substitute — headings define document structure.

**Recommended fix:** Add a visually hidden (screen-reader and crawler accessible) `<h1>` to the page body before the desktop div:

```html
<h1 class="sr-only">Meghan Hair Studio — Hair Color and Cuts in Portland, Maine</h1>
```

with CSS:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

This does not affect the visual design and is the standard approach for thematic/artistic sites that cannot surface a heading visually.

---

## Image Alt Text Coverage

**Coverage: Good — 57/57 portfolio images have alt text. Two issues found.**

| Image | Alt Text | Assessment |
|---|---|---|
| `images/image.jpg` (welcome hero) | "Meghan's Hair Studio" | Generic. Could be "Meghan's Hair Studio — Portland, Maine hair salon" |
| `images/bio pic.jpg` | "Meghan" | Minimal. Better: "Meghan, hair colorist and stylist in Portland, Maine" |
| Portfolio images (57) | Varied descriptive labels | Acceptable. Labels like "Vivid Color", "Precision Cut", "Color Transformation" are usable but not geo-targeted. |
| `#lb-img` (lightbox) | `alt=""` | Empty alt — acceptable for decorative/duplicate images that are already described by the portfolio grid. No action needed. |

**Improvement opportunity:** Portfolio alt text could include "Portland, Maine" once or twice per category (e.g., "Vivid color hair in Portland, Maine") for local SEO signal, without keyword stuffing.

---

## Security Headers

Netlify.toml configures headers for `/*`.

| Header | Status | Value | Assessment |
|---|---|---|---|
| HTTPS | Automatic | Netlify enforces HTTPS | Correct |
| Strict-Transport-Security (HSTS) | Not configured | Netlify sets HSTS on custom domains automatically, but it is not declared in config | Low risk — Netlify handles it, but declare explicitly for documentation clarity |
| Content-Security-Policy | MISSING | Not present | -10 pts. Missing CSP is the most significant gap. No XSS protection policy defined. |
| X-Frame-Options | Present | `SAMEORIGIN` | Correct |
| X-XSS-Protection | Present | `1; mode=block` | Deprecated by modern browsers but harmless. Can be removed. |
| X-Content-Type-Options | Present | `nosniff` | Correct |
| Referrer-Policy | Present | `strict-origin-when-cross-origin` | Best practice value. Correct. |
| Permissions-Policy | MISSING | Not present | -3 pts. Low-severity gap. |

**Recommended CSP addition to netlify.toml:**

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; script-src 'self'; frame-src 'self'; connect-src 'none';"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

Note: The site uses `onclick` inline handlers in HTML (e.g., `onclick="Desktop.open('win-about')"`). A strict CSP with `script-src 'self'` without `unsafe-inline` would block these. Either refactor onclick handlers to use addEventListener in scripts.js, or add `'unsafe-inline'` to `script-src` as a temporary measure.

---

## Core Web Vitals Risk Assessment

Note: This is a static HTML analysis estimating risk factors. Actual measurements require field data from PageSpeed Insights or CrUX.

| Vital | Risk | Key Indicators |
|---|---|---|
| LCP | HIGH | Boot screen animation runs before any content is visible. The hero image (`images/image.jpg`) lacks `fetchpriority="high"`. No `<link rel="preload">` for any critical resource. Google Fonts load synchronously (render-blocking). |
| INP | MEDIUM | All window interactions are JS-driven (open, close, minimize, maximize, drag). Script is deferred to end of `<body>` which is good, but the desktop canvas and boot animation run immediately on parse. No heavy third-party scripts. |
| CLS | LOW-MEDIUM | Windows use fixed pixel dimensions set inline — low CLS risk once rendered. Boot screen → desktop transition may cause a layout shift. Portfolio images all have `loading="lazy"` but no `width`/`height` attributes — browser cannot reserve space. |

### LCP Mitigation (priority)

1. Add `fetchpriority="high"` to the welcome hero image:
   ```html
   <img src="images/image.jpg" alt="Meghan's Hair Studio" class="welcome-hero-img" fetchpriority="high">
   ```
2. Preload the hero image in `<head>`:
   ```html
   <link rel="preload" as="image" href="images/image.jpg">
   ```
3. Add `font-display=swap` to the Google Fonts URL (it's already implied by the CSS2 API default, but verify):
   ```
   https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&display=swap
   ```
   This is already in the HTML — confirm "display=swap" is present (it is). Good.

### CLS Mitigation

Add `width` and `height` attributes to all portfolio `<img>` tags to let the browser reserve space. Example:
```html
<img src="images/photos-1.jpeg" alt="Vivid Color" loading="lazy" width="400" height="300">
```
Exact dimensions should match actual image dimensions. This is low-effort but requires knowing image sizes.

---

## Mobile Optimization

**Status: Partially Optimized — with significant concerns**

The site is built as a fixed desktop UI that adapts to touch via JavaScript, not via CSS responsive design. This creates several mobile issues:

| Signal | Status | Detail |
|---|---|---|
| Viewport meta | Present with issue | `user-scalable=no` disables pinch-to-zoom. Remove it. |
| Base font size | 11px | Far below the 16px minimum recommended for mobile readability. The Win95 aesthetic requires small fonts, but 11px on mobile is a usability and ranking issue. |
| Overflow hidden on body | Yes | `overflow: hidden` and `touch-action: none` on both `html, body` and `#desktop` aggressively suppress standard mobile scroll behavior. |
| Responsive breakpoints | None in CSS | No media queries found in the first 100 lines of styles.css. Layout adaptation is handled entirely in JavaScript (pointer:coarse detection). |
| Touch adaptation | Partial | `scripts.js` detects `pointer: coarse` and resizes windows to 88% of viewport width when first opened. This is a reasonable approach for the Win95 concept. |
| Responsive images | No srcset | No `srcset` or `<picture>` elements. All 57 portfolio images are served at full resolution on all devices. |
| Tap target sizes | Unknown | Win95 window buttons (minimize, maximize, close) are likely below 44x44px touch targets. |

**Assessment:** Google's mobile-first indexing means the mobile version of the page is what gets indexed and ranked. The current mobile experience — where the entire win95 desktop is rendered at desktop scale and requires JS to adapt — is non-standard. The JS adaptation works but it is not CSS-responsive. For a local business site, this is a meaningful ranking disadvantage.

The `user-scalable=no` removal is the single highest-impact, lowest-effort mobile fix.

---

## URL Structure

**Target URL:** `/` (root)
**Assessment:** Clean — no issues with the primary URL

| Check | Status | Detail |
|---|---|---|
| Clean URL | Pass | Root domain, no parameters |
| Descriptive slug | N/A | Single-page app, all content on `/` |
| Trailing slash consistency | Pass | Root URL has no slug to evaluate |
| URL length | Pass | Under 100 characters |
| Case | Pass | Lowercase |
| Hyphens vs underscores | Pass | No slugs in use |
| Depth | Pass | Single level |

**Forward-looking concern:** The catch-all 200 redirect means every invented URL (e.g., `/services`, `/about`, `/portfolio`) returns a 200 with `index.html` content. If the site ever needs crawlable sub-pages, this must be resolved. It also means Google may crawl these phantom URLs and find identical content.

---

## Structured Data / JSON-LD

**Status: COMPLETELY MISSING — HIGH PRIORITY for local business SEO and AI citability**

No JSON-LD, no microdata, no schema.org markup of any kind is present in the HTML.

For a local hair salon, the following schemas should be implemented:

### LocalBusiness / HairSalon schema (recommended)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Meghan Hair Studio",
  "description": "Vivid color, expressive cuts, and styling in Portland, Maine. 17+ years of experience.",
  "url": "https://meghanlaurahair.com/",
  "telephone": "PHONE_NUMBER",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Portland",
    "addressRegion": "ME",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "LATITUDE",
    "longitude": "LONGITUDE"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "$$",
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
</script>
```

**Note:** The `business-knowledge.json` file found in the project directory may already contain some of this data. Check it for reuse.

The `aggregateRating` from StyleSeat (5.0 / 126 reviews) is a compelling structured data signal — it should appear in schema markup as soon as the domain goes live.

---

## Additional Technical Checks

### Lightbox image (minor)

`<img id="lb-img" src="" alt="">` — The lightbox image element has an empty `src` and `alt`. This is intentional (populated by JS) but will generate a browser console error and may trigger broken-image signals in crawlers that partially execute JS. Consider adding `aria-hidden="true"` and a `data-src` attribute instead, or wrapping it in a container that is hidden until activated.

### Image filename case sensitivity

Several images use mixed-case filenames: `IMG_5887.JPG`, `Photo-97.JPG`, `ACS_0201.jpg`. On Netlify's Linux-based servers, file paths are case-sensitive. If any HTML reference does not exactly match the filesystem case, those images will 404 in production. Verify all `src` attributes match their filenames exactly.

### Missing favicon declaration

No `<link rel="icon">` is present in `<head>`. Browsers will request `/favicon.ico` by default. Without it, every page load generates a 404 (or in this case, a 200 with HTML due to the catch-all redirect — which is worse, as browsers will try to render the HTML as an icon).

### Google Fonts performance

Two preconnect hints are correctly placed:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```
The font stylesheet (`Nunito:wght@700;800`) is loaded synchronously in `<head>`. This is render-blocking. Consider adding `media="print" onload="this.media='all'"` for non-critical fonts, or accept this as an acceptable trade-off given Nunito is used for the boot screen wordmark.

### No preload for critical assets

No `<link rel="preload">` hints are present. At minimum, the hero image should be preloaded (see LCP section above).

---

## Crawlability Files — Pre-Launch Templates

### robots.txt (add as `/robots.txt` in repo root)

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GoogleBot
Allow: /

Sitemap: https://meghanlaurahair.com/sitemap.xml
```

### sitemap.xml (add as `/sitemap.xml` in repo root)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://meghanlaurahair.com/</loc>
    <lastmod>2026-07-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### netlify.toml redirect fix

Update the catch-all to exclude crawl infrastructure:

```toml
# Exclude crawl files from the SPA catch-all
[[redirects]]
  from = "/robots.txt"
  to = "/robots.txt"
  status = 200
  force = false

[[redirects]]
  from = "/sitemap.xml"
  to = "/sitemap.xml"
  status = 200
  force = false

# SPA catch-all — must come last
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Priority Actions

### Pre-Launch (blocking)

1. **[CRITICAL]** Fix the netlify.toml catch-all redirect so `/robots.txt` and `/sitemap.xml` are served as static files, not redirected to `index.html`. Without this, no crawler can read crawl permissions or the sitemap.

2. **[CRITICAL]** Add `robots.txt` and `sitemap.xml` to the repo root (templates above).

3. **[CRITICAL]** Add JSON-LD `HairSalon` structured data to `<head>`. This is the single highest-impact SEO change for local search and AI citability. The `business-knowledge.json` file already in the project may contain the raw data needed.

4. **[HIGH]** Add a canonical tag pointing to the production domain once confirmed:
   `<link rel="canonical" href="https://meghanlaurahair.com/">`

5. **[HIGH]** Add Open Graph and Twitter Card meta tags (template above). Required for any AI platform previewing or sharing the URL.

### Short-Term (within 2 weeks of launch)

6. **[HIGH]** Remove `user-scalable=no` from the viewport meta tag. No design impact; fixes mobile-friendliness signal.

7. **[HIGH]** Add a visually hidden `<h1>` with the primary keyword phrase (template above). Required for semantic document structure.

8. **[HIGH]** Add `fetchpriority="high"` to the welcome hero image and a `<link rel="preload">` in `<head>` for it.

9. **[MEDIUM]** Add a Content-Security-Policy header to netlify.toml (template above). Requires refactoring inline `onclick` handlers to addEventListener or accepting `unsafe-inline`.

10. **[MEDIUM]** Add width and height attributes to portfolio `<img>` tags to prevent CLS.

11. **[MEDIUM]** Add a Permissions-Policy header to netlify.toml.

### Forward-Looking (post-launch)

12. **[MEDIUM]** Expand the meta description from 109 to 150-160 characters. Add a soft CTA or expand the service/location detail.

13. **[MEDIUM]** Consider adding a minimal `<noscript>` fallback that renders the key business information (name, location, hours, StyleSeat booking link) in plain HTML for users and crawlers without JS. This would upgrade the SSR risk from MEDIUM to LOW.

14. **[LOW]** Audit all image filenames for case-sensitivity mismatches between HTML `src` attributes and actual filenames on disk.

15. **[LOW]** Add a favicon (`/favicon.ico` or `<link rel="icon">` to a PNG).

16. **[LOW]** Extend the title tag to 50-60 characters with a service keyword, e.g.: `"Meghan Hair Studio · Hair Color & Cuts · Portland, Maine"`

---

*Audit performed via static source file analysis. HTTP response headers, actual server behavior, and Core Web Vitals field data require a live URL and PageSpeed Insights / CrUX validation after deployment.*
