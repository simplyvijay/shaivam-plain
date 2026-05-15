# AGENTS.md

## Project Overview

Static HTML website for **Shaivam Philosophy** (shaivam.info), hosted on **Firebase Hosting**. No build step, no bundler, no framework — plain HTML/CSS/JS served directly from the `public/` directory.

## Architecture

- **`public/`** — the entire deployed site; maps 1:1 to what Firebase serves
- **Folder-based routing** — each page lives at `{section}/index.html` (e.g., `about/index.html`, `blog/dual-monism/index.html`). Firebase rewrites all routes to `/index.html` as a fallback.
- **Single shared stylesheet** — `public/style.css` used by every page via relative paths
- **Single shared script** — `public/script.js` loaded by every page
- **No templating** — the navbar, footer, and `<head>` boilerplate are **duplicated in every HTML file**. When changing shared elements (nav links, footer, meta CDN versions), you must update ALL `index.html` files.

## Key Conventions

### Asset Paths Are Relative by Depth
- Root page: `images/logo.png`, `style.css`
- 1-level deep (e.g., `about/`): `../images/logo.png`, `../style.css`
- 2-levels deep (e.g., `blog/dual-monism/`): `../../images/logo.png`, `../../style.css`

### Google Analytics
Every page must include the GA4 snippet as the **first thing inside `<head>`** (before `<meta charset>`). The measurement ID is `G-ZM6ST4KGKX`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZM6ST4KGKX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-ZM6ST4KGKX');
</script>
```

### SEO — Every Page Requires Full Meta
Each page must include: `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`), Twitter Card tags, `<link rel="canonical">`, and a `<script type="application/ld+json">` block with appropriate Schema.org type (`WebPage`, `Blog`, `BlogPosting`, `ContactPage`, etc.). See `public/index.html` for the complete pattern.

### data-testid Attributes
All interactive and landmark elements carry `data-testid` attributes (e.g., `data-testid="main-navbar"`, `data-testid="hero-begin-journey-btn"`). Preserve these on any element you modify or add.

### CSS Design Tokens
Theming uses CSS custom properties defined in `:root` in `style.css`:
- `--primary: #D35400` (saffron), `--accent: #1A237E` (indigo), `--secondary: #FAF9F6` (off-white)
- Button classes: `.btn-saffron`, `.btn-outline-saffron`
- Typography: headings use `Cormorant Garamond`, body uses `Lato`, brand uses custom `Samarkan` font

### Nav Active State
Active nav link is set via `data-page` attribute + JS detection in `script.js` (lines 209–217). The detection extracts the first path segment (e.g., `/blog/dual-monism/` → `blog`), so all blog posts activate the same nav link. When adding pages, add a matching `data-page` value to the nav link.

## CDN Dependencies (no npm runtime deps used in browser)
- Bootstrap 5.3.2 (CSS + JS bundle)
- Font Awesome 6.5.0
- Google Fonts: Cormorant Garamond, Lato

## Adding a New Page
1. Create `public/{section}/index.html`
2. Copy the full `<head>` block, navbar, footer, and script includes from an existing peer page
3. Ensure the GA4 snippet (`G-ZM6ST4KGKX`) is the first thing inside `<head>` (see "Google Analytics" above)
4. Adjust all relative paths (`../` or `../../`) based on directory depth
4. Set the correct `<link rel="canonical">`, OG tags, and JSON-LD
5. Add the navbar link (with `data-page` attribute) across **all** existing `index.html` files
6. Add the URL to `public/sitemap.xml`

## Adding a Blog Post
Create `public/blog/{slug}/index.html`. Use `public/blog/dual-monism/index.html` as the template — it includes the `post-header`, `post-content`, sidebar, and related-posts sections. Update the blog listing in `public/blog/index.html` and the "Recent Blog Posts" section on `public/index.html` if desired.

## Special Pages

### Privacy Policy
`public/privacy/index.html` is a non-indexed page with special navbar configuration. Note:
- Uses `id="navbarNav"` (not `mainNav`) for collapse target
- Omits GA4 snippet (no tracking on this page)
- Uses `btn-nav-cta` class on Connect button (not `btn btn-saffron btn-sm`)
- Include breadcrumb navigation linking back to `/contact/`

### Newsletter Form
The homepage includes an email subscription form. Pattern:
```html
<form class="newsletter-form" data-testid="newsletter-form" onsubmit="handleNewsletterSubmit(event)">
  <input type="email" placeholder="Your email address" aria-label="Email address" required data-testid="newsletter-email-input">
  <button type="submit" class="btn-saffron" data-testid="newsletter-submit-btn">Subscribe</button>
</form>
```
The `handleNewsletterSubmit` function (in `script.js`) handles form submission.

### Footer Structure
All pages include a 4-column footer with:
1. **Brand column** — logo, tagline, description
2. **Navigate** — links to all main pages (Home, About, Videos, Blog, Contact, Privacy)
3. **Philosophy** — anchor links to `/about/` sections  
4. **Wisdom** — inspirational quote and mantra

Always include a privacy link at the bottom: `<a href="privacy/">Privacy Policy</a>`

## Blog RSS Feed
The RSS feed is at `public/blog/feed.xml`. Every page includes:
```html
<link rel="alternate" type="application/rss+xml" title="Shaivam Philosophy Blog" href="https://shaivam.info/blog/feed.xml">
```
Update `feed.xml` when adding or modifying blog posts.

## Deployment
```bash
firebase deploy --only hosting:shaivam-8bd79-30558
```
No build or compilation required — deploys the `public/` folder directly. The Firebase site target is `shaivam-8bd79-30558`.

## Files to Know
| File | Purpose |
|---|---|
| `public/style.css` | All site styles, CSS variables, responsive breakpoints |
| `public/script.js` | Initialization of interactive modules: Goal Achievement Cycle (GAC) carousel, wisdom quote carousel, scroll animations, navbar scroll behavior, nav link active state, newsletter form submission |
| `firebase.json` | Hosting config — `public` directory, SPA rewrite rule |
| `public/sitemap.xml` | All indexed URLs — update when adding pages |
| `public/robots.txt` | Crawl rules and sitemap reference |
| `public/blog/feed.xml` | RSS feed for blog posts — update when publishing new content |

