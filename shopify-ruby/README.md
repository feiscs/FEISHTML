# FORMA Shopify Ruby scaffold

This folder is a small adapter for the official Shopify Ruby API gem from `git@github.com:Shopify/shopify-api-ruby.git` / `https://github.com/Shopify/shopify-api-ruby`.

It is not a vendored copy of Shopify's repository. It is the app-side code FORMA needs to organize Shopify Admin and Storefront API access while the storefront remains deployable on Vercel.

## What it includes

- `Gemfile` with `shopify_api` and `dotenv`.
- `config/shopify_context.rb` to initialize `ShopifyAPI::Context` with environment variables.
- `lib/forma_shopify/admin_client.rb` for GraphQL Admin API product reads.
- `lib/forma_shopify/storefront_client.rb` for Storefront API product reads.
- `scripts/list_products.rb` as a smoke test for Admin API credentials.

## Setup

```bash
cd shopify-ruby
cp .env.example .env
bundle install
SHOPIFY_PRODUCT_LIMIT=50000 bundle exec ruby scripts/list_products.rb
```

## Required environment variables

| Variable | Purpose |
| --- | --- |
| `SHOPIFY_API_KEY` | Custom app API key. |
| `SHOPIFY_API_SECRET` | Custom app API secret. |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Admin API access token for GraphQL Admin calls. |
| `SHOPIFY_SHOP_DOMAIN` | Shop domain, configured here as `feispla.myshopify.com`. |
| `SHOPIFY_API_VERSION` | Admin API version, configured here as `2025-04`. |
| `SHOPIFY_SCOPES` | Comma-separated app scopes. |
| `SHOPIFY_STOREFRONT_PUBLIC_TOKEN` / `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | Optional Storefront API tokens. |
| `SHOPIFY_PRODUCT_LIMIT` | Optional product listing/sync target, for example `50000`; requests are paginated in pages of 250. |

## Notes

- New Shopify apps should prefer GraphQL Admin API over REST.
- Do not commit `.env` or production tokens.
- Use this Ruby adapter for secure server-side Admin API work, and keep `assets/integrations.js` limited to safe browser-side Storefront API/demo behavior.
