# FORMA go-live checklist

If the page exists on GitHub but you do not see the storefront working, the missing step is usually deployment/configuration rather than more files.

## What works immediately

The static demo storefront works with local demo data when served from the repo root:

```bash
npm ci
npm run check
npm run dev
# open http://127.0.0.1:4173/
```

You should see:

- Product cards rendered by `assets/store.js`.
- Category filters and sort controls.
- Wishlist drawer.
- Product detail modal.
- Quick Add and cart drawer.
- Newsletter confirmation message.

## What does not work just by pushing a branch

Pushing the branch to GitHub does **not** automatically activate these systems:

| Area | Why it still looks inactive | Required next step |
| --- | --- | --- |
| Public website | GitHub branch is code storage, not necessarily hosting. | Connect the repo/branch to Vercel or enable GitHub Pages. |
| Shopify product sync | `assets/config.js` ships blank credentials and `enableRemoteProducts: false`. | Generate runtime config from Vercel env vars or edit demo config locally. |
| Shopify checkout | The current static demo cart is client-side only. | Connect Storefront Cart API/checkout URL or use the Liquid theme in Shopify. |
| Supabase events/newsletter | Supabase URL and anon key are blank. | Create project, run migration, add URL/key to runtime config. |
| Chatbase widget | Chatbase bot ID is blank and `enabled: false`. | Create bot, add bot ID and set enabled true. |
| Shopify Liquid theme | Files in `shopify-theme/` are not active until uploaded to Shopify. | Upload with Shopify CLI/Theme Kit or copy into a Shopify theme repo. |
| Ruby Shopify adapter | It needs gems and Shopify Admin env vars. | `cd shopify-ruby`, `bundle install`, fill `.env`, run smoke script. |

## Vercel deployment path

1. Push branch to GitHub.
2. Import the repo in Vercel.
3. Select the branch you pushed.
4. Framework preset: **Other** / static.
5. Build command: optional `npm run check`.
6. Output directory: repo root (`.`).
7. Deploy and open the Vercel preview URL.

## Runtime config path

For production, do not commit secrets to `assets/config.js`. Instead generate the file during deploy or replace placeholders using Vercel environment variables.

Minimum values to turn integrations from demo to connected:

```js
window.FORMA_CONFIG = {
  shopify: {
    domain: 'your-store.myshopify.com',
    storefrontToken: 'public-storefront-token',
    apiVersion: '2026-01',
    enableRemoteProducts: true,
  },
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'public-anon-key',
    eventsTable: 'store_events',
    newsletterTable: 'newsletter_signups',
  },
  chatbase: {
    botId: 'your-chatbase-bot-id',
    enabled: true,
  },
};
```

## Shopify theme path

The static Vercel store and the Shopify Liquid theme are separate deliverables:

- Static storefront: repo root `index.html` + `assets/`.
- Shopify theme: `shopify-theme/`.

To make the Shopify theme visible inside Shopify, upload or connect `shopify-theme/` with Shopify tooling, then preview it from Shopify Admin.

## Quick diagnosis

Run:

```bash
npm run smoke:static
```

This checks that `index.html` references the required storefront scripts/styles and that all referenced local assets exist.
