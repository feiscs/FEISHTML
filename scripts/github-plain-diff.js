#!/usr/bin/env node

const input = process.argv[2];
const format = process.argv[3] || 'patch';

if (!input || !['patch', 'diff'].includes(format)) {
  console.error('Usage: scripts/github-plain-diff.js <github-url> [patch|diff]');
  console.error('Example: scripts/github-plain-diff.js https://github.com/Shopify/Timber/pull/1 patch');
  process.exit(64);
}

let url;
try {
  url = new URL(input);
} catch (error) {
  console.error(`Invalid URL: ${input}`);
  process.exit(65);
}

if (url.hostname !== 'github.com') {
  console.error('Only github.com URLs are supported.');
  process.exit(66);
}

url.hash = '';
url.search = '';
url.pathname = url.pathname.replace(/\.(patch|diff)$/i, '');
url.pathname = `${url.pathname}.${format}`;

console.log(url.toString());
