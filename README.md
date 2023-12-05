# 🐀 Magawa

[![GitHub package.json dynamic](https://img.shields.io/github/package-json/version/simbo/magawa)](https://github.com/simbo/magawa/blob/main/package.json)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/simbo/magawa/CI/main)](https://github.com/simbo/magawa/actions?query=workflow%3ACI)
[![GitHub last commit](https://img.shields.io/github/last-commit/simbo/magawa/main)](https://github.com/simbo/magawa/commits/main)

> A minesweeper clone.

---

## About

Magawa is a minesweeper clone that I wrote as a just-for-fun project.

See the live version at **[simbo.codes/magawa](https://simbo.codes/magawa)**

## Features

- first click will always uncover an area and never trigger a mine (as long as
  you didn't choose too many mines in custom mode)
- auto-pause when switching tabs or apps
- start timer on first click
- flag mines using right-click or alt/shift/ctrl/meta-click
- different difficulties (_easy_, _medium_, _hard_ and _custom_)
- global and personal highscores
- save game settings in storage
- quick restart function
- responsive interface
- ~~legacy support for non-webgl plattforms~~

See [ToDo](./TODO.md) for planned features.

## Tech Stack

- [Preact](https://preactjs.com/) for DOM manipulation
- [Vite](https://vitejs.dev/) as bundler
- a selfmade, immutable, reactive and
  [small store](https://github.com/simbo/small-store)
- also Typescript, Nunjucks, SCSS, css-reset-and-normalize, date-fns and
  others...

## Development

```sh
# watch, serve and rebuild
yarn start
# serve in production mode for testing
yarn serve
# build for production
yarn build
```

## Deployment

...to GitHub Pages is done automatically using GitHub Actions when pushing
changes to main.

## Trivia

This game is named after the giant pouched rat _Magawa_, who received a gold
medal in september 2020 for its success and bravery in clearing mine fields in
Cambodia. ([Wikipedia: Magawa](https://en.wikipedia.org/wiki/Magawa))

![Magawa](./src/static/images/magawa.jpg)

## License and Author

[MIT &copy; Simon Lepel](http://simbo.mit-license.org/)
