const fs = require('fs');
const path = require('path');

const root = process.cwd();
const htmlPath = path.join(root, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

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
  'Bolso Arc Cognac',
  'Vela Santal 300g',
  'Tote Weekend',
  'Pañuelo Seda Grid',
  'Trench Lino Arena',
  'data-runtime-status',
];

const missingMarkers = requiredMarkers.filter((marker) => !html.includes(marker));
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

const config = fs.readFileSync(path.join(root, 'assets/config.js'), 'utf8');
const demoMode = [
  "domain: ''",
  "storefrontToken: ''",
  'enableRemoteProducts: false',
  "url: ''",
  "anonKey: ''",
  "botId: ''",
  'enabled: false',
].every((marker) => config.includes(marker));

console.log(`Verified ${assetRefs.length} local asset references and ${requiredMarkers.length} storefront markers.`);
console.log(demoMode
  ? 'Runtime integrations are intentionally in demo mode. Configure assets/config.js or deploy-time env generation for Shopify/Supabase/Chatbase.'
  : 'Runtime integration config appears customized.');
