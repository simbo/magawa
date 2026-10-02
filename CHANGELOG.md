# Magawa

## 0.13.2

### Patch Changes

- 8ab3442: Remove legacy files and simplify Sass imports.

  - Remove obsolete Parcel configuration files and the unused GitHub SVG asset.
  - Remove unused overlay styles, Sass mixins, and the serif font variable.
  - Replace shared Sass imports with explicit `vars` namespaces.
  - Remove the duplicate context-menu handler and commented overlay code.
  - Remove the hardcoded highscore highlight.
  - Reorganize the README and remove completed tasks from the TODO list.

## 0.13.1

### Patch Changes

- bac0dff: Disable Jekyll processing on GitHub Pages so generated assets are
  served without filtering. Include the main branch and checked commit SHA in
  release workflow run names to make automated releases easier to identify.
- bac0dff: Start a new game with the same player, difficulty, and board settings
  when the win or loss overlay is clicked, instead of returning to the main
  menu.

## 0.13.0

### Minor Changes

- 32c8d2d: Introduce Changesets-based release commits and separate checks,
  release, and publish workflows using the GitHub App identity. Require
  changesets for non-draft pull requests, run regression tests in CI, verify the
  checked commit before releasing, and publish tagged builds as GitHub releases
  and GitHub Pages deployments. Add the historical changelog, support manual
  release and publish runs, and replace the previous release script with the
  automated process.
- 32c8d2d: Add a persistent developer mode that reveals mines, shows a developer
  indicator, and refreshes the field immediately when toggled. Document the game
  code with JSDoc comments. This includes the changes committed in c32c89d.

### Patch Changes

- 32c8d2d: Upgrade to Node.js 24 LTS, pnpm 12, TypeScript 6, Preact 11, and
  updated dependencies. Adopt the shared Simbo configurations for linting,
  formatting, TypeScript, spelling, and commit messages. Add regression tests
  using Node.js and jiti, modernize Vite template and HTML minification plugins,
  migrate Sass to modules, remove unused dependencies, update Umami integration
  and the API URL to the new server, and update the domain to simbo.de.
- 32c8d2d: Replace Small Store, Immer, and RxJS with a Signals-based game store
  while preserving action subscriptions and development logging. Replace Preact
  Router and History with native hash routing, including browser navigation and
  normalization of query strings and trailing slashes. Freeze the timer when a
  game ends and prevent stale highscore responses after restarting.

## 0.12.1

### Patch Changes

- c506926: Add Umami analytics to production builds.

## 0.12.0

### Patch Changes

- 335fbc3: Fix and improve highscore handling.
- 8a95192: Update dependencies.
- c16d07a: Improve highscore pagination.
- 521aad0: Improve date formatting.
- 58ca774: Fix the highscore banner condition.
- c74151d: Improve highscore table styles.

## 0.11.0

### Minor Changes

- a107521: Throttle rendering to improve performance.

## 0.10.0

### Minor Changes

- 74d33bf: Replace Parcel with Vite.
- 50ec4d5: Replace Pixi.js with a custom Canvas paint engine.
- 669cf6d: Replace store.js with native local storage.
- cf8c453: Use lazy-loaded routes with Suspense and preload view modules.

### Patch Changes

- 03f5987: Update dependencies and Node.js configuration.
- e381843: Remove deprecated lz-string type definitions.
- 4df5c63: Replace shuffle-array with array-shuffle.
- 5feabfe: Improve loading styles.
- 193249e: Simplify checks and error handling.
- 8f5b186: Use magawa as the build output directory and update configuration.
- 851b041: Add a Nunjucks template plugin for Vite.
- 199c578: Fix linting issues.
- ed98d66: Update CI and deployment workflows.
- 5ed5903: Update project documentation.
- f85b79a: Update dependencies.

## 0.9.2

### Patch Changes

- 4282787: Link the version number to its release and improve body styles.
- 3a06093: Update dependencies.

## 0.9.1

### Patch Changes

- 97c3c6d: Update dependencies.
- 56ff83c: Restore missing store effects.
- 334e8d4: Deploy version tags and create GitHub releases in CI.

## 0.9.0

### Minor Changes

- c9d65a8: Detect WebGL support and load the legacy Pixi.js renderer when
  needed.

### Patch Changes

- 0318b6c: Configure supported browsers.
- c0b7244: Update the README.

## 0.8.1

### Patch Changes

- 52ee8b3: Update dependencies.

## 0.8.0

### Minor Changes

- e977692: Replace the internal store with Small Store.

### Patch Changes

- 2792c20: Use the package version when loading Pixi.js from the CDN.
- 6c1bc95: Update dependencies.
- 0958b3d: Replace TSLint with ESLint.
- 0405742: Update code style.
- d6da9d8: Update license information.

## 0.7.2

### Patch Changes

- 543d8a8: Fix leading zeros in time formatting.

## 0.7.1

### Patch Changes

- ddf1ee2: Fix padding numbers with leading zeros.

## 0.7.0

### Minor Changes

- 2b75cd1: Add donation links.
- 0959c7b: Add an about page.

### Patch Changes

- 80843b6: Clean up styles.
- 2d91c34: Improve back buttons.
- 2478eb9: Update dependencies.
- fbfd161: Update planned features.

## 0.6.0

### Minor Changes

- c591579: Start the timer on the first click.

## 0.5.3

### Patch Changes

- e159845: Add cache-control metadata.

## 0.5.2

### Patch Changes

- 029a6b7: Fix overwriting highscores.

## 0.5.1

### Patch Changes

- f550fe8: Fix linting issues.

## 0.5.0

### Minor Changes

- df4073a: Add routing, player names, saved settings, and global and personal
  highscores.

### Patch Changes

- df4073a: Improve victory feedback, responsive layouts, loading styles, and
  bundling.
- f691313: Update linting and import sorting configuration.
- b98315a: Update dependencies.
- 5c841cb: Fix JSX class attributes.
- f5c57b4: Improve the congratulations message and victory styles.
- 6ecebac: Update the README icon.

## 0.4.1

### Patch Changes

- 3712fa9: Update the tracker ID.
- c3d2b3d: Use medium difficulty by default.
- 72ae251: Improve menu styles.

## 0.3.0

### Minor Changes

- 3bed7af: Rewrite the game using Preact, Pixi.js, and Parcel.
