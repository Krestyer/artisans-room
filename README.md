# The Artisan's Room – Static (Vercel-ready) Version

This is a **static frontend-only** build of *The Artisan's Room – Online Art Gallery* designed to run on **Vercel** (no PHP, no MySQL).

## Stack
- HTML5, CSS3, vanilla JavaScript
- No PHP, no Composer, no npm, no build step
- Fonts via CDN (Google Fonts + Font Awesome)
- Data simulated in the browser with `localStorage`

## What works (client-side simulation)
- Home, Artworks (search / filter / sort / load-more), Artwork detail
- Artists list + profile pages
- Exhibitions list + detail + ticket booking (seats decrement in localStorage)
- Tutorials list + detail (embedded video)
- Shop + product detail + add to cart
- Cart (add / update quantity / remove / live total)
- Checkout (simulated COD / UPI / Card) → order confirmation
- Sign in / Sign up / Logout (stored in localStorage)
- User Dashboard (profile, orders, bookings)
- Contact form (saved to localStorage)
- Privacy Policy, Terms of Service, About Us

## Admin panel (`/admin/`)
Separate admin login (`admin@artisansroom.com / Admin@123`). Simulated CRUD for artworks, artists, exhibitions, tutorials, products; view/delete users, orders (status update), bookings, contact messages. All changes persist only in `localStorage` for that browser.

## Default logins
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@artisansroom.com | Admin@123 |
| Demo User | user@demo.com | User@1234 |

## Limitations vs the PHP/MySQL version
- No real database: all data lives in `localStorage` and resets if you clear site data or use another browser/device.
- No real image upload: admin forms accept a file input but store `placeholder.svg` (Vercel has no server to save uploads).
- No real email/password hashing: passwords are stored as-is in localStorage (demo only).
- No server-side rendering: every page is a static `.html` file.

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Import the repo in Vercel (Vercel will detect it as a static site).
3. Add a `vercel.json` (included) to route extensionless URLs to `.html`.
4. Deploy. Visit your `*.vercel.app` URL.

## Folder structure
```
artisans-room-static/
├── index.html, about.html, artworks.html, artwork.html, artists.html,
│   artist-profile.html, exhibitions.html, exhibition.html, tutorials.html,
│   tutorial.html, shop.html, product.html, cart.html, checkout.html,
│   order-success.html, signin.html, signup.html, logout.html, dashboard.html,
│   contact.html, privacy-policy.html, terms.html
├── admin/            (login.html, index.html, logout.html, CRUD pages)
├── assets/
│   ├── css/ (style.css, admin.css)
│   └── js/ (data.js, common.js, main.js, validation.js, cart.js)
├── assets/images/placeholder.svg
├── vercel.json
└── README.md
```

## Project credits
TYBSc Computer Science final-year project – Vishal Santosh Shukla, S.S.T College of Arts & Commerce, Ulhasnagar. Guide: Mrs. Mayra Lachhani.
