// FORMA runtime configuration.
// Keep real credentials in Vercel Environment Variables or generate this file during deploy.
// Public Shopify defaults are prefilled; token stays blank so local git remains safe/demo.
window.FORMA_CONFIG = {
  shopify: {
    domain: 'feispla.myshopify.com',
    storefrontToken: '',
    apiVersion: '2025-04',
    enableRemoteProducts: false,
    productLimit: 50000,
  },
  supabase: {
    url: 'https://nejzzerwtgtbqawaizuo.supabase.co',
    anonKey: 'sb_publishable_BPOIpRJaqBftujcnHY0mvw_jh8-88Kh',
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
