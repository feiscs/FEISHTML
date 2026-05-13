// FORMA runtime configuration.
// Keep real credentials in Vercel Environment Variables or generate this file during deploy.
// Values left blank keep the storefront in safe local-demo mode.
window.FORMA_CONFIG = {
  shopify: {
    domain: '',
    storefrontToken: '',
    apiVersion: '2026-01',
    enableRemoteProducts: false,
  },
  supabase: {
    url: '',
    anonKey: '',
    eventsTable: 'store_events',
    newsletterTable: 'newsletter_signups',
  },
  chatbase: {
    botId: '',
    enabled: false,
  },
  githubAgent: {
    provider: 'Claude',
    repo: 'FEISHTML',
    workflow: 'Plan → branch → PR → Vercel preview → review → merge',
  },
};
