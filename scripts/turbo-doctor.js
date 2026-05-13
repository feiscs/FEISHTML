#!/usr/bin/env node
const { spawnSync } = require('child_process');

const result = spawnSync('turbo', ['--version'], { encoding: 'utf8' });

if (result.error) {
  console.log('Turbo is not installed in this environment.');
  console.log('Install globally with one of:');
  console.log('  pnpm add turbo --global');
  console.log('  yarn global add turbo');
  console.log('  npm install turbo --global');
  console.log('  bun install turbo --global');
  console.log('Or scaffold a new starter with:');
  console.log('  pnpm dlx create-turbo@latest');
  console.log('  yarn dlx create-turbo@latest');
  console.log('  npx create-turbo@latest');
  console.log('  bunx create-turbo@latest');
  process.exit(0);
}

if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout);
  process.exit(result.status || 1);
}

console.log(`Turbo installed: ${result.stdout.trim()}`);
console.log('Try: turbo run check');
