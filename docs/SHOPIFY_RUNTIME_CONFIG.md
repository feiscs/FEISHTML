# Shopify runtime configuration

The storefront is ready for the Shopify Storefront API without committing tokens to git.

## Values for this store

Use these public/non-secret defaults:

- `SHOPIFY_DOMAIN=feispla.myshopify.com`
- `SHOPIFY_API_VERSION=2025-04`
- `SHOPIFY_ENABLE_REMOTE_PRODUCTS=true` when you want live Shopify products instead of the demo catalog.
- `SHOPIFY_PRODUCT_LIMIT=50000` as the requested catalog target. Browser Storefront API pagination is capped in this project at 25,000 products; use the Ruby/Admin path or Bulk operations for larger back-office exports.

Add the Storefront API token as `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in Vercel or in a local uncommitted `.env` file. Do not paste the token into tracked source files.

## Generate `assets/config.js`

For Vercel, set the environment variables above and run this before deploy output is served:

```bash
npm run config:generate
npm run check
```

For a one-off local test, load variables from your shell and generate the browser config:

```bash
SHOPIFY_DOMAIN=feispla.myshopify.com \
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token \
SHOPIFY_API_VERSION=2025-04 \
SHOPIFY_ENABLE_REMOTE_PRODUCTS=true \
SHOPIFY_PRODUCT_LIMIT=50000 \
npm run config:generate
```

`assets/config.js` is intentionally committed with a blank token and `enableRemoteProducts: false` so local git remains safe. The generator writes production values only in the deploy/runtime environment.

## Important distinction

The Storefront API token is used by the browser catalog integration. Shopify Admin API tokens are private server-side credentials and must only be used in the Ruby adapter or another backend runtime.

## Test without touching tracked config

Use `FORMA_CONFIG_OUTPUT` to generate a temporary file while testing the generator:

```bash
FORMA_CONFIG_OUTPUT=/tmp/forma-config.js npm run config:generate
```
