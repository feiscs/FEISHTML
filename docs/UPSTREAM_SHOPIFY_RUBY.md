# Contributing upstream to Shopify/shopify-api-ruby

Yes — this project is prepared to help create focused upstream contributions for `Shopify/shopify-api-ruby`.

Upstream repository: <https://github.com/Shopify/shopify-api-ruby>

## What I can do from this workspace

- Inspect the FORMA Shopify adapter and identify issues that may belong upstream.
- Create a clean reproduction script or failing test against `shopify_api`.
- Prepare a patch branch in a local clone of `Shopify/shopify-api-ruby` or your fork.
- Draft the upstream PR title, body, test evidence and migration notes.

## What I need from you before opening an upstream PR

1. Your GitHub fork URL, for example:
   - `git@github.com:<your-user>/shopify-api-ruby.git`
   - or `https://github.com/<your-user>/shopify-api-ruby.git`
2. The issue or improvement you want to contribute.
3. Confirmation that I can work in a sibling directory outside this storefront repo.
4. Any Shopify app/test-store context needed to reproduce the issue, without sharing secrets in git.

## Recommended upstream workflow

```bash
# From this repo root
scripts/prepare-shopify-upstream.sh git@github.com:<your-user>/shopify-api-ruby.git

cd ../shopify-api-ruby-upstream
git checkout -b forma/<short-change-name>
bundle install
bundle exec rake test
```

Then implement the smallest possible change, add/update tests, run the project checks and push to your fork:

```bash
git push -u fork forma/<short-change-name>
```

Open the PR against `Shopify/shopify-api-ruby:main`.

## PR quality checklist

- [ ] The PR solves one clear upstream problem.
- [ ] The PR includes a failing test or regression coverage when possible.
- [ ] The PR does not include FORMA-specific product/business code.
- [ ] The PR does not include secrets, store domains, tokens or private payloads.
- [ ] The PR body includes reproduction steps and test output.
- [ ] The PR follows the upstream repository style instead of this storefront style.

## Good contribution candidates

- Documentation improvements discovered while wiring `ShopifyAPI::Context`.
- Clear examples for Admin GraphQL or Storefront GraphQL clients.
- Better error messages or guards around configuration.
- Test coverage for client behavior that is currently unclear.

## Not good upstream candidates

- FORMA storefront UI, catalog data, Supabase integration or Chatbase integration.
- Private Shopify app credentials or store-specific behavior.
- Large refactors without an issue or maintainer alignment.

## Current environment note

This container could not read the upstream Git remote directly because the network tunnel returned HTTP 403. If you provide a fork and the environment allows SSH/HTTPS Git access, the helper script can prepare the workspace. If not, I can still draft patches and PR text for you to apply locally.
