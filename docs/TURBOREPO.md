# Turborepo setup for FORMA

This repo now includes a minimal `turbo.json` so the existing storefront checks can be run through Turborepo when `turbo` is installed.

Official installation reference reviewed: <https://turborepo.com/repo/docs/getting-started/installation>

## Quick start options

Create a new Turborepo starter elsewhere:

```bash
pnpm dlx create-turbo@latest
yarn dlx create-turbo@latest
npx create-turbo@latest
bunx create-turbo@latest
```

Install Turbo globally for this existing repo:

```bash
pnpm add turbo --global
yarn global add turbo
npm install turbo --global
bun install turbo --global
```

The official docs recommend installing `turbo` globally for convenient terminal usage and locally in a repo for stable team workflows. In this environment, installing the npm package returned HTTP 403, so this repo keeps the Turborepo config committed while leaving package installation to your machine/CI network.

## Commands in this repo

Without Turbo:

```bash
npm run check
npm run smoke:static
npm run dev
```

With Turbo installed:

```bash
turbo run check
turbo run smoke:static
turbo run verify:files
```

Check whether Turbo is available:

```bash
npm run turbo:doctor
```

## Why this is not a full create-turbo rewrite

`create-turbo` creates a new monorepo with multiple apps and packages. FORMA already has a static storefront, Shopify Liquid theme scaffold, Shopify Ruby adapter and deployment docs, so this change adds Turborepo orchestration without moving files or breaking the current Vercel/static workflow.


## Starter-compatible monorepo shape

The official starter describes two deployable applications and three shared libraries. FORMA now mirrors that shape while preserving the existing static root storefront:

```text
apps/
  storefront/   # deployable static storefront app
  docs/         # deployable static docs app
packages/
  ui/           # shared HTML/UI helpers
  config/       # shared brand/deployment config
  storefront-data/ # shared product/category records
```

Useful commands:

```bash
npm run check:workspaces
npm run build
turbo run build
turbo build --filter=@forma/app-docs --dry
cd apps/docs && turbo build
```

`turbo` is an alias for `turbo run`, so `turbo build` and `turbo run build` are equivalent.
