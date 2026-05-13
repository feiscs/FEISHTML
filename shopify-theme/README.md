# FORMA Shopify Liquid theme scaffold

This folder mirrors the classic Shopify/Timber theme layout so the static FORMA storefront can be ported into a Shopify Liquid theme.

Reference reviewed:

- `Shopify/Timber`: <https://github.com/Shopify/Timber>
- Shopify theme architecture: <https://shopify.dev/docs/storefronts/themes/architecture>

## Structure

```text
shopify-theme/
├── assets/      # JavaScript, CSS, and theme images
├── layout/      # theme.liquid and optional alternate layouts
├── snippets/    # reusable Liquid snippets
├── spec/        # structure tests and helpers
├── templates/   # page, collection, product, cart, blog, search, customer templates
├── config/      # Shopify theme settings schema/data
└── config.yml   # legacy Theme Kit style config placeholder
```

## Validate

```bash
ruby shopify-theme/spec/theme_structure_spec.rb
```

Optional Timber-style specs require Bundler gems:

```bash
cd shopify-theme
bundle install
bundle exec rspec
```

## Notes

- This is a minimal migration scaffold, not a full Timber copy.
- Keep static Vercel assets in the repo root and Shopify Liquid assets under `shopify-theme/`.
- Shopify theme upload tools expect the theme root to contain supported directories such as `assets`, `layout`, `snippets`, `templates`, `config`, `locales`, and related theme folders.
- Timber-inspired additions include `timber.js.liquid`, `ajax-cart.js.liquid`, `breadcrumb`, `collection-sorting`, onboarding snippets, comment snippet, `oldIE-js`, and `gift_card.liquid`.
