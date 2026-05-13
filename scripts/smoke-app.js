const fs = require('fs');
const path = require('path');

const appDir = process.argv[2];
if (!appDir) {
  console.error('Usage: node scripts/smoke-app.js <app-dir>');
  process.exit(64);
}

const indexPath = path.join(process.cwd(), appDir, 'index.html');
const pkgPath = path.join(process.cwd(), appDir, 'package.json');

for (const file of [indexPath, pkgPath]) {
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8').trim().length === 0) {
    console.error(`Missing or empty app file: ${file}`);
    process.exit(1);
  }
}

const html = fs.readFileSync(indexPath, 'utf8');
const missing = ['<!doctype html>', '<main', 'data-app-records'].filter((marker) => !html.includes(marker));
if (missing.length) {
  console.error(`App ${appDir} is missing markers: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Verified deployable app: ${appDir}`);
