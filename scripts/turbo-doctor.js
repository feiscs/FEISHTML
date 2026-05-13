#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const turboJsonPath = path.join(root, 'turbo.json');

if (!fs.existsSync(turboJsonPath)) {
  console.error('Missing turbo.json');
  process.exit(1);
}

const turboJson = JSON.parse(fs.readFileSync(turboJsonPath, 'utf8'));
const requiredScripts = ['check', 'verify:files', 'smoke:static', 'config:generate', 'turbo:check', 'turbo:smoke'];
const missingScripts = requiredScripts.filter((script) => !packageJson.scripts?.[script]);
const requiredTasks = ['check', 'verify:files', 'smoke:static', 'config:generate', 'theme:spec', 'dev', 'start'];
const missingTasks = requiredTasks.filter((task) => !turboJson.tasks?.[task]);

if (missingScripts.length || missingTasks.length) {
  if (missingScripts.length) console.error(`Missing package scripts:\n${missingScripts.map((script) => `- ${script}`).join('\n')}`);
  if (missingTasks.length) console.error(`Missing turbo tasks:\n${missingTasks.map((task) => `- ${task}`).join('\n')}`);
  process.exit(1);
}

console.log(`Turbo config looks ready with ${requiredTasks.length} tasks.`);
