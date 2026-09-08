# Warm Loaf Digital

Build a modern, warm, and appetizing e-commerce website for a Kenyan bakery business called [BAKERY NAME]. The brand feel should be cozy and artisanal — warm cream/beige tones, soft browns, and an accent color like terracotta or soft pink, with elegant serif headings paired with a clean sans-serif body font. Avoid generic stock "bakery" clichés — make it feel handcrafted, local, and premium.

Pages/sections needed:

Home — Hero section with a strong tagline, featured/best-selling products carousel, a short "our story" teaser, and a call-to-action to shop or view the menu.

Menu/Shop — Categorized product grid (Breads, Cakes, Pastries, Custom Cakes, Snacks) with images, prices in KES, and short descriptions. Include category filters and a search bar.

Product Detail Page — Larger image, full description, quantity selector, "Add to Cart" button, and related products.

Custom Cake Orders — A form for custom cake requests: occasion, size, flavor, design notes, budget range, and preferred pickup/delivery date, feeding into the same cart/checkout flow as a line item.

Cart & Checkout — Cart drawer/page with quantity edit and remove options, order summary, delivery or pickup selection, customer details (name, phone, address/area), and M-Pesa STK Push as the primary payment method (with a note for card/cash-on-delivery as secondary options if useful).

Order Confirmation — Confirmation screen/page showing order number, M-Pesa payment status, and estimated ready/delivery time.

About — Story of the bakery, founder, and what makes it different (fresh daily, local ingredients).

Gallery — Masonry/grid layout of product photos.

Contact/Location — Map embed, phone, WhatsApp button, opening hours, and a contact form.

Functionality:

Fully responsive, mobile-first (majority of customers will browse and pay via phone)

Cart persists across pages (use app state; note where this would connect to Supabase for persistence)

M-Pesa Daraja API integration point clearly structured — an STK Push request form (phone number + amount) with placeholder logic for the backend call, and a payment status callback area

WhatsApp "Chat to Order" floating button as a fallback alongside the cart flow

Simple admin view (or clearly marked section) to manage products, view orders, and see payment status

Smooth scroll animations and hover effects on product cards

Tech/Data:

Use placeholder product data (name, price in KES, image, category, description) for at least 12 items across 4 categories

Structure code cleanly so products, orders, and payments can be connected to Supabase and the M-Pesa Daraja API later

Keep the overall vibe inviting and trustworthy — like a well-loved neighborhood bakery that's gone digital without losing its personality.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1372829d-c7c6-49ca-854d-9425cac37359).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
