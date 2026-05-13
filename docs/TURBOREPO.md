# Turborepo notes

This repo can run without Turborepo, but `turbo.json` documents cache boundaries and prepares the project for a future multi-package workspace.

## Install

```bash
npm install --save-dev turbo
```

The current project does not require Turbo as a dependency for normal static deployment. Use `npm run check` for the canonical validation path.

## Commands

```bash
npm run config:generate
npm run check
npm run smoke:static
npm run turbo:doctor
npm run turbo:check
npm run turbo:smoke
```

`turbo:check` and `turbo:smoke` require the Turbo CLI to be installed locally or available through your package manager.

## Tasks

- `check` depends on `verify:files` and `smoke:static`.
- `config:generate` writes `assets/config.js` from environment variables for deploy/runtime use.
- `verify:files` validates required repo files.
- `smoke:static` validates static HTML markers and referenced assets.
- `theme:spec` runs the optional Shopify theme specs.
- `dev` and `start` are persistent uncached server tasks.

## Why keep this lightweight

FORMA is intentionally static-first for Vercel. Turbo is documented here to help if the repo later grows into apps/packages for storefront, admin jobs, theme tooling, or integration workers.
