const fs = require('fs');
const path = require('path');

const root = process.cwd();
const htmlPath = path.join(root, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const storeScript = fs.readFileSync(path.join(root, 'assets/store.js'), 'utf8');
const config = fs.readFileSync(path.join(root, 'assets/config.js'), 'utf8');
const searchableStaticText = `${html}\n${storeScript}\n${config}`;

const requiredMarkers = [
  'assets/config.js',
  'assets/integrations.js',
  'assets/store.js',
  'assets/store.css',
  'data-product-grid',
  'data-cart-drawer',
  'data-wishlist-drawer',
  'data-product-modal',
  'data-integration-status="shopify"',
  'data-integration-status="supabase"',
  'data-integration-status="chatbase"',
  'productLimit',
  'Bolso Arc Cognac',
  'Vela Santal 300g',
  'Tote Weekend',
  'Pañuelo Seda Grid',
  'Trench Lino Arena',
];

const missingMarkers = requiredMarkers.filter((marker) => !searchableStaticText.includes(marker));
if (missingMarkers.length) {
  console.error(`Missing required storefront markers:\n${missingMarkers.map((marker) => `- ${marker}`).join('\n')}`);
  process.exit(1);
}

const assetRefs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map((match) => match[1]);
const missingAssets = assetRefs.filter((asset) => !fs.existsSync(path.join(root, asset)));
if (missingAssets.length) {
  console.error(`Missing referenced assets:\n${missingAssets.map((asset) => `- ${asset}`).join('\n')}`);
  process.exit(1);
}

const storefrontTokenBlank = /["']?storefrontToken["']?\s*:\s*["']["']/.test(config);
const chatbaseBotBlank = /["']?botId["']?\s*:\s*["']["']/.test(config);
const remoteProductsDisabled = /["']?enableRemoteProducts["']?\s*:\s*false/.test(config);
const supabasePublishableKey = /sb_publishable_[A-Za-z0-9_-]+/.test(config);
const supabaseConfigured = config.includes('https://nejzzerwtgtbqawaizuo.supabase.co') && supabasePublishableKey;

console.log(`Verified ${assetRefs.length} local asset references and ${requiredMarkers.length} storefront markers.`);
console.log(storefrontTokenBlank && chatbaseBotBlank && remoteProductsDisabled ? 'Runtime Shopify/Chatbase secrets are not committed.' : 'Runtime integrations include non-demo values; verify secrets are not committed.');
console.log(supabaseConfigured ? 'Supabase publishable browser config is present; confirm RLS policies before production traffic.' : 'Supabase remains in demo mode.');
