# GitHub plain diffs and patches

When a GitHub pull request page is hard to review in an agent or terminal environment, use the plain-text `.patch` or `.diff` URL.

## Pull requests

```text
https://github.com/OWNER/REPO/pull/NUMBER.patch
https://github.com/OWNER/REPO/pull/NUMBER.diff
```

## Commits

```text
https://github.com/OWNER/REPO/commit/COMMIT_SHA.patch
https://github.com/OWNER/REPO/commit/COMMIT_SHA.diff
```

## Helper script

Use the helper to convert a normal GitHub URL into a plain patch/diff URL:

```bash
node scripts/github-plain-diff.js https://github.com/feiscs/FEISHTML/pull/5 patch
node scripts/github-plain-diff.js https://github.com/feiscs/FEISHTML/commit/f82cb3de3372fbb476924bcb4283c7a654c8654a diff
```

Prefer `.patch` when you need commit metadata and `.diff` when you only need file changes.
