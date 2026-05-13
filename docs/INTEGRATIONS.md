# FORMA integration map

This storefront is intentionally static-first so it can ship quickly to Vercel, while still exposing clean hooks for commerce, CRM, support and AI-assisted maintenance.

## Runtime configuration

Edit `assets/config.js` locally for demos, or generate it during Vercel builds from environment variables. Never commit real production tokens.

| Area | Config keys | Purpose |
| --- | --- | --- |
| Shopify | `shopify.domain`, `shopify.storefrontToken`, `shopify.apiVersion`, `shopify.enableRemoteProducts` | Reads products and variants through the Shopify Storefront API. |
| Supabase | `supabase.url`, `supabase.anonKey`, `supabase.eventsTable`, `supabase.newsletterTable` | Stores storefront events and newsletter signups. |
| Chatbase | `chatbase.botId`, `chatbase.enabled` | Loads the Chatbase support widget only when enabled. |
| GitHub AI | `githubAgent.provider`, `githubAgent.workflow` | Documents the expected Claude-style GitHub agent workflow. |

## Shopify path

1. Create a Shopify custom app with Storefront API access.
2. Enable product read permissions and copy the Storefront access token.
3. Set `shopify.domain` to the shop domain, for example `forma.myshopify.com`.
4. Set `shopify.enableRemoteProducts` to `true`.
5. For the current Shopify store, use `feispla.myshopify.com` with Storefront API version `2025-04`; keep `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in Vercel/local environment variables, not in git.
6. Set `SHOPIFY_PRODUCT_LIMIT=50000` as the requested product limit target. The browser Storefront path paginates safely and caps hydration at 25,000 products; use server-side Admin/Bulk workflows for larger exports.
7. The storefront falls back to the local demo catalog if Shopify is not configured or fails.



## Shopify Liquid theme scaffold

The `shopify-theme/` directory mirrors the classic Timber-style theme structure requested for Shopify theme work:

- `assets/` for JavaScript, CSS and theme images.
- `layout/theme.liquid` as the base HTML document.
- `snippets/` for reusable Liquid components.
- `templates/` for Shopify page types, including cart, collection, product, search, blog and customer templates.
- `spec/` for a structure smoke test plus Timber-style i18n/HTML helper specs using Nokogiri, HTMLEntities and RSpec.
- `config.yml` as a legacy Theme Kit style placeholder.

Validate it with:

```bash
ruby shopify-theme/spec/theme_structure_spec.rb
```

Optional full theme specs after installing Ruby gems:

```bash
cd shopify-theme
bundle install
bundle exec rspec
```

This is a migration scaffold inspired by Timber, not a vendored copy of Timber. It includes Timber-style files such as `timber.js.liquid`, `ajax-cart.js.liquid`, `breadcrumb`, `collection-sorting`, onboarding snippets, `comment`, `oldIE-js`, and `gift_card.liquid`.

## Shopify Ruby Admin adapter

Reference repository: https://github.com/Shopify/shopify-api-ruby

If you want to contribute changes back to the upstream Shopify Ruby API gem, use `docs/UPSTREAM_SHOPIFY_RUBY.md` and `scripts/prepare-shopify-upstream.sh` to prepare a clean fork-based workspace.

The `shopify-ruby/` folder contains the FORMA-side Ruby adapter for secure Shopify Admin API operations. Use it when you need server-side tasks such as product syncs, order operations, inventory workflows or private Admin GraphQL calls that must not run in the browser.

Quick start:

```bash
cd shopify-ruby
cp .env.example .env
bundle install
SHOPIFY_PRODUCT_LIMIT=5 bundle exec ruby scripts/list_products.rb
```

The static Vercel storefront can keep using `assets/integrations.js` for safe Storefront/demo behavior, while this Ruby adapter handles private Admin API work.

## Supabase path

1. Create a Supabase project.
2. Run the Supabase migrations in `supabase/migrations/`; it enables RLS and anonymous insert-only policies with basic length/shape checks.
3. Put the project URL and anon key into runtime config. The current project URL is `https://nejzzerwtgtbqawaizuo.supabase.co` and the browser key is the provided `sb_publishable_...` key.
4. The storefront will insert:
   - `cart_add` events into `store_events`.
   - `newsletter_signup` rows into `newsletter_signups`.

## Chatbase path

Reference: https://www.chatbase.co/docs/developer-guides/javascript-embed

1. Create a Chatbase bot trained with product, shipping, return and brand FAQs.
2. Copy the bot ID into `chatbase.botId`.
3. Set `chatbase.enabled` to `true`.
4. The widget script is injected at runtime by `assets/integrations.js`.

## GitHub AI agent workflow

Use Claude, Copilot Workspace or another GitHub agent with this loop:

1. Create an issue using `.github/ISSUE_TEMPLATE/ai-agent-task.md`.
2. Ask the agent to create a branch from the issue.
3. Require a PR with screenshots or Vercel preview evidence for UI changes.
4. Review the PR using the checklist in `.github/pull_request_template.md`.
5. Merge only after `npm run check` and Vercel preview pass.

## Vercel path

1. Import the GitHub repo into Vercel.
2. Use no build command for the static storefront, or set `npm run check` as an optional preflight in CI.
3. Output directory should be the repo root.
4. Add production env vars if generating `assets/config.js` during deploy.
5. Vercel previews should be used for every GitHub PR.
