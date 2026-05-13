# GitHub plain-text patch and diff URLs

Professional review tip: add `.patch` or `.diff` to the end of many GitHub PR, commit and compare URLs to get plain-text output that is easier to inspect, archive, quote and feed into AI agents.

## Examples

```text
https://github.com/Shopify/Timber/pull/1.patch
https://github.com/Shopify/Timber/pull/1.diff
https://github.com/Shopify/Timber/commit/<sha>.patch
https://github.com/Shopify/Timber/compare/main...branch.diff
```

## Helper script

Use the local helper to normalize a GitHub URL into a plain patch or diff URL:

```bash
scripts/github-plain-diff.js https://github.com/Shopify/Timber/pull/1 patch
scripts/github-plain-diff.js https://github.com/Shopify/Timber/pull/1 diff
```

## Why this helps agents

- Plain text avoids heavy GitHub UI markup.
- `.patch` includes commit metadata and mail-style patches.
- `.diff` is compact when you only need file changes.
- Reviewers can paste exact plain-text URLs into issues, PR comments or AI prompts.

## Suggested workflow

1. Use `.diff` for quick code review.
2. Use `.patch` when commit metadata matters.
3. Include one of these URLs in AI-agent tasks when asking for review or implementation follow-up.
