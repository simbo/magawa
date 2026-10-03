# 🐀 Magawa - The Game!

[![package.json version](https://img.shields.io/github/package-json/version/simbo/magawa)](https://github.com/simbo/magawa/blob/main/package.json)
[![CI Workflow Status](https://img.shields.io/github/actions/workflow/status/simbo/magawa/checks.yml)](https://github.com/simbo/magawa/actions?query=workflow%3AChecks)
[![Play Magawa](https://img.shields.io/badge/play-magawa-hotpink?logo=apple-arcade)](https://simbo.de/magawa)

> A minesweeper clone.

---

## About

Magawa is a minesweeper clone that I wrote as a just-for-fun project.

Play the live version at **[`simbo.de/magawa`](https://simbo.de/magawa)**

## Features

- first click will always uncover an area and never trigger a mine  
  (as long as you didn't choose too many mines in custom mode)
- start timer on first click
- auto-pause when switching tabs or apps
- flag mines using right-click or alt/shift/ctrl/meta-click
- different difficulties (_easy_, _medium_, _hard_ and _custom_)
- global and personal highscores
- save game settings
- quick restart function

See [ToDo](./TODO.md) for planned features.

## Trivia

This game is named after the giant pouched rat _Magawa_, who received a gold
medal in september 2020 for its success and bravery in clearing mine fields in
Cambodia. ([Wikipedia: Magawa](https://en.wikipedia.org/wiki/Magawa))

![Magawa](./src/static/images/magawa.jpg)

## Development

Use the Node.js version in `.nvmrc` and PNPM pinned in `package.json`. Install
dependencies with `pnpm install`.

```sh
# run all checks, regression tests and the production build
pnpm run preflight

# watch, serve and rebuild
pnpm run dev

# serve in production mode for testing
pnpm run preview

# build for production
pnpm run build
```

The game uses Preact, a Signals-based store and a small hash router. Board
rendering uses the custom Canvas paint engine. Styles use Sass modules; saved
preferences retain their versioned, compressed local-storage format.

## Testing

Tests use Vitest with V8 coverage. Module tests live alongside source files as
`*.test.ts` or `*.test.tsx`; tests spanning multiple components and shared
helpers live in `tests/`. Build-plugin tests use the Node environment; UI and
browser-module tests use jsdom and Preact Testing Library.

```sh
# run all tests and generate coverage reports
pnpm run test

# rerun tests when files change, with coverage
pnpm run test:watch

# open the interactive Vitest UI
pnpm run test:ui

# run a single module's tests
pnpm run test -- src/scripts/lib/game-board.test.ts

# remove generated reports
pnpm run clean:coverage
```

Coverage reports are written to `coverage/index.html` and `coverage/lcov.info`.
The initial suite establishes minimum aggregate coverage of 95% for statements,
functions and lines and 90% for branches. All app modules and both build plugins
are included; type declarations, enum-only modules and the entry-point bootstrap
are excluded. Tests cover behavior, edge cases and failures, with controlled
network, image-loading and canvas boundaries. Real-browser end-to-end tests and
visual screenshot comparisons are outside this suite.

## Deployment

Add a changeset with `pnpm exec changeset` for each pull request. Successful
checks on `main` trigger the release workflow when changesets are present. It
updates the version and changelog, then pushes a release commit and version tag
using the GitHub App identity.

The publish workflow builds the tagged version, creates a GitHub release with a
`magawa.zip` archive, and deploys to GitHub Pages. Both workflows also support
manual runs; publishing an existing tag can restore a previously released site.
The GitHub App needs repository access with Contents write permission and must
be allowed to bypass the rules for `main`, `gh-pages`, and release tags.
Configure `SIMBO_GITHUB_APP_ID` and `SIMBO_GITHUB_APP_PRIVATE_KEY` as repository
secrets.

## License and Author

[MIT &copy; 2020 Simon Lepel](http://simbo.mit-license.org/@2020/)
