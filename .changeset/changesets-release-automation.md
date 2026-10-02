---
'magawa': minor
---

Introduce Changesets-based release commits and separate checks, release, and
publish workflows using the GitHub App identity. Require changesets for
non-draft pull requests, run regression tests in CI, verify the checked commit
before releasing, and publish tagged builds as GitHub releases and GitHub Pages
deployments. Add the historical changelog, support manual release and publish
runs, and replace the previous release script with the automated process.
