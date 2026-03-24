# VRAI — Fashion & Apparel Website

A modern, responsive fashion e-commerce website built with pure HTML, CSS, and vanilla JavaScript. Designed for the VRAI brand — *French for "true"* — featuring curated fashion collections, an interactive size guide, wishlist, back-in-stock notifications, and a "Complete the Look" styling feature.

## Pages

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Hero, categories, new arrivals, bestsellers, testimonials, newsletter |
| Collections | `collections.html` | Product grid with filter sidebar (category, size, color, price, material) |
| Product Detail | `product.html` | Gallery, variant pickers, size guide modal, wishlist, back-in-stock, "Complete the Look" |
| Our Story | `about.html` | Brand story, values, impact stats, newsletter CTA |

## Features

- **Size Guide / Fit Finder** — Tabbed modal with Women's & Men's sizing tables and measurement tips
- **Wishlist** — Persistent (localStorage) wishlist with slide-in drawer, heart toggle on every product card
- **Back-in-Stock Notifications** — Email notification signup for out-of-stock items
- **Complete the Look** — Curated outfit suggestions with "Add All to Cart" on product pages
- **Responsive Design** — Mobile-first with breakpoints at 480px, 768px, and 1024px
- **Accessibility** — Skip links, ARIA roles/labels, keyboard navigation, reduced-motion support
- **Scroll Animations** — Fade-in on scroll using IntersectionObserver
- **Filter & Sort** — Collection page with sidebar filters and sort controls

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties design system, Flexbox/Grid layouts, no preprocessor needed
- **Vanilla JavaScript** — No frameworks or build tools required
- **Google Fonts** — Playfair Display, Inter, Cormorant Garamond

## Getting Started

1. Clone the repository
2. Open `index.html` in a browser — no build step required
3. Or serve with any static file server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

## Project Structure

```
├── index.html              # Homepage
├── collections.html        # Product listing with filters
├── product.html            # Product detail page
├── about.html              # Brand story
├── assets/
│   ├── css/
│   │   └── styles.css      # Complete design system & component styles
│   └── js/
│       └── main.js         # All interactive modules
└── README.md
```

## License

All rights reserved. This project is proprietary.

## Shopify Theme Deployment Workflow

This repository now includes a staging-first Shopify deployment flow.

1. Configure environment variables:

```powershell
$env:SHOPIFY_STORE_DOMAIN = "vraicanada.myshopify.com"
$env:SHOPIFY_THEME_STAGING_ID = "REPLACE_WITH_STAGING_THEME_ID"
$env:SHOPIFY_THEME_LIVE_ID = "184459231527"
```

2. Deploy to staging (default):

```powershell
.\scripts\deploy-theme.ps1
```

3. Deploy selected files only:

```powershell
.\scripts\deploy-theme.ps1 -Only templates/product.json,sections/product-redesign.liquid
```

4. Deploy to live (main/master branch only):

```powershell
.\scripts\deploy-theme.ps1 -Live
```

See `docs/SHOPIFY_DEPLOY_FLOW.md` for the full branch strategy, staging QA sequence, and release checklist.