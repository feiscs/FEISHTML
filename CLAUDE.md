# Claude/GitHub agent instructions for FORMA

- Keep the storefront deployable as a static Vercel site unless a task explicitly adds a backend.
- Do not commit production secrets. Use `assets/config.js` only with blank/demo values in git.
- Prefer adding integration hooks in `assets/integrations.js` and UI behavior in `assets/store.js`.
- Run `npm run check` before every PR.
- For visual changes, attach a Vercel preview link or screenshot evidence in the PR.
- Keep Shopify as the commerce source of truth, Supabase as the CRM/event store, and Chatbase as the support assistant.
