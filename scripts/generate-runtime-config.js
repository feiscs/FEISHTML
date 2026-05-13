#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function booleanFromEnv(value, fallback = false) {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

function integerFromEnv(name, fallback) {
  const rawValue = env(name, String(fallback)).replace(/[,\s_]/g, '');
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const config = {
  shopify: {
    domain: env('SHOPIFY_DOMAIN', 'feispla.myshopify.com'),
    storefrontToken: env('SHOPIFY_STOREFRONT_ACCESS_TOKEN'),
    apiVersion: env('SHOPIFY_API_VERSION', '2025-04'),
    enableRemoteProducts: booleanFromEnv(process.env.SHOPIFY_ENABLE_REMOTE_PRODUCTS, false),
    productLimit: integerFromEnv('SHOPIFY_PRODUCT_LIMIT', 50000),
  },
  supabase: {
    url: env('SUPABASE_URL', 'https://nejzzerwtgtbqawaizuo.supabase.co'),
    anonKey: env('SUPABASE_ANON_KEY', 'sb_publishable_BPOIpRJaqBftujcnHY0mvw_jh8-88Kh'),
    eventsTable: env('SUPABASE_EVENTS_TABLE', 'store_events'),
    newsletterTable: env('SUPABASE_NEWSLETTER_TABLE', 'newsletter_signups'),
  },
  chatbase: {
    botId: env('CHATBASE_BOT_ID'),
    enabled: booleanFromEnv(process.env.CHATBASE_ENABLED, false),
  },
  githubAgent: {
    provider: env('GITHUB_AGENT_PROVIDER', 'Claude'),
    repo: env('GITHUB_AGENT_REPO', 'FEISHTML'),
    workflow: env('GITHUB_AGENT_WORKFLOW', 'Plan → branch → PR → Vercel preview → review → merge'),
  },
};

const output = `// FORMA runtime configuration.\n// Generated from environment variables by scripts/generate-runtime-config.js.\n// Do not commit production tokens. Values left blank keep safe local-demo mode.\nwindow.FORMA_CONFIG = ${JSON.stringify(config, null, 2)};\n`;

const outputPath = path.resolve(process.cwd(), env('FORMA_CONFIG_OUTPUT', 'assets/config.js'));
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output);

const connected = {
  shopify: Boolean(config.shopify.domain && config.shopify.storefrontToken && config.shopify.enableRemoteProducts),
  supabase: Boolean(config.supabase.url && config.supabase.anonKey),
  chatbase: Boolean(config.chatbase.botId && config.chatbase.enabled),
};

console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
console.log(`Shopify: ${connected.shopify ? 'configured' : 'demo/disabled'} (${config.shopify.domain || 'no domain'}, ${config.shopify.apiVersion})`);
console.log(`Supabase: ${connected.supabase ? 'configured' : 'demo/disabled'}`);
console.log(`Chatbase: ${connected.chatbase ? 'configured' : 'demo/disabled'}`);
