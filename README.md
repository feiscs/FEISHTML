# FORMA storefront

FORMA is a static-first editorial ecommerce storefront with integration hooks for Shopify, Supabase, Chatbase, GitHub AI workflows, and Vercel previews/production.

See `docs/GO_LIVE_CHECKLIST.md` to deploy and connect integrations.

## Turborepo

See `docs/TURBOREPO.md` for installing and running Turbo with this repo.

## Runtime config

Shopify public defaults are set for `feispla.myshopify.com` and API version `2025-04`, but the Storefront API token stays out of git. Use `npm run config:generate` with environment variables before serving production config. See `docs/SHOPIFY_RUNTIME_CONFIG.md`.

The Shopify runtime defaults also include a `SHOPIFY_PRODUCT_LIMIT=50000` target; browser hydration is paginated and capped for safety, while larger exports belong in server-side Admin/Bulk workflows.

Supabase is configured for `https://nejzzerwtgtbqawaizuo.supabase.co` with the provided publishable browser key; apply the migrations in `supabase/migrations/` so RLS insert-only policies protect the public endpoints.
