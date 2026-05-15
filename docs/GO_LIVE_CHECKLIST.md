# FORMA go-live checklist

Use this checklist before connecting production APIs or shipping the storefront.

## 1. Local validation

- [ ] Run `npm ci`.
- [ ] Run `npm run check`.
- [ ] Confirm no production secrets are committed.
- [ ] Confirm `assets/config.js` has blank/demo values in git unless it is generated during deploy.

## 2. Shopify Storefront API

Create a Shopify custom app or sales-channel compatible storefront token, then collect:

- `SHOPIFY_DOMAIN` — configured for this store as `feispla.myshopify.com`.
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — Storefront API public token.
- `SHOPIFY_API_VERSION` — configured for this store as `2025-04`.
- `SHOPIFY_ENABLE_REMOTE_PRODUCTS` — set to `true` only when Shopify products should replace the demo catalog.
- `SHOPIFY_PRODUCT_LIMIT` — requested target is `50000`; browser Storefront API hydration is capped at 25,000 and larger back-office exports should use server-side Admin/Bulk workflows.

The browser storefront only needs Storefront API access. Do not place private Admin API secrets in browser-delivered files.

## 3. Supabase

- [ ] Create a Supabase project.
- [ ] Run the Supabase migrations in `supabase/migrations/`.
- [ ] Confirm row-level security policies in the migration are applied before production traffic; they allow anonymous inserts only, with basic length/shape checks.
- [ ] Collect:
  - `SUPABASE_URL` — configured as `https://nejzzerwtgtbqawaizuo.supabase.co`.
  - `SUPABASE_ANON_KEY` — configured with the provided `sb_publishable_...` browser key.
  - `SUPABASE_EVENTS_TABLE` — default `store_events`.
  - `SUPABASE_NEWSLETTER_TABLE` — default `newsletter_signups`.

## 4. Chatbase

- [ ] Create or choose a Chatbase bot.
- [ ] Train it with brand, product, shipping, return, and FAQ content.
- [ ] Collect:
  - `CHATBASE_BOT_ID`.
  - `CHATBASE_ENABLED` — set to `true` only when the widget should load.

## 5. Shopify Admin Ruby adapter, optional server-side work

Only use these server-side values outside the browser, for example in `shopify-ruby/.env` or a private runtime:

- `SHOPIFY_SHOP`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN`.
- `SHOPIFY_API_VERSION`.
- `SHOPIFY_PRODUCT_LIMIT` for the sample listing script.

## 6. Vercel

- [ ] Import the GitHub repo into Vercel.
- [ ] Use no build command for a static deploy, or use `npm run check` as a preflight.
- [ ] Set output directory to the repo root.
- [ ] Add the public runtime environment values if you generate `assets/config.js` during deployment.
- [ ] Run `npm run config:generate` in the deploy/build step after Vercel environment variables are available.
- [ ] Review a Vercel preview URL before merging UI changes.

## APIs currently needed

Send these values when you are ready to connect production services:

1. Shopify: shop domain, Storefront API token, API version, remote products flag, and product limit target.
2. Supabase: project URL, anon key, events table name, and newsletter table name.
3. Chatbase: bot ID and enabled flag.
4. Optional Shopify Admin Ruby: shop domain and Admin API access token for server-side scripts only.

