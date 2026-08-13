# RASHMOHON Online Shop

Next.js 16 + React 19 + TypeScript ecommerce starter using:

- Tailwind CSS v4
- Zustand v5 persisted cart
- Contentful
- TanStack React Query dependency included
- Lucide React
- Ntfy order notifications
- Bengali / English translations
- Dummy fallback data

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000/en

## Contentful

Create `product` and `category` content types. The app falls back to dummy data if Contentful is not configured.

## Ntfy

Set:

```env
NTFY_TOPIC=rashmohon-orders
NTFY_SERVER=https://ntfy.sh
```

Orders are posted server-side to the topic.

## Layout

Hero is full bleed. All other page sections use `.container` spacing.

Desktop product grid = 6 columns.

Product details related products = horizontal carousel with 6 visible products per row and additional products scrolling horizontally.

## Production note

Before production, validate product prices and totals server-side against your database/CMS and persist orders to MongoDB or another authoritative database. Never trust localStorage totals.
