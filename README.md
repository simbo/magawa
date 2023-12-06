# 🐀 Magawa - The Game!

[![package.json version](https://img.shields.io/github/package-json/version/simbo/magawa)](https://github.com/simbo/magawa/blob/main/package.json)
[![CI Workflow Status](https://img.shields.io/github/actions/workflow/status/simbo/magawa/ci.yml)](https://github.com/simbo/magawa/actions?query=workflow%3ACI)
[![Play Magawa](https://img.shields.io/badge/play-magawa-hotpink?logo=apple-arcade)](https://simbo.codes/magawa)

> A minesweeper clone.

---

## About

Magawa is a minesweeper clone that I wrote as a just-for-fun project.

Play the live version at **[simbo.codes/magawa](https://simbo.codes/magawa)**

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

...to GitHub Pages is done automatically using GitHub Actions when creating a
new version tag.

Use `./release.sh` to create version tags conventiently.

## Trivia

This game is named after the giant pouched rat _Magawa_, who received a gold
medal in september 2020 for its success and bravery in clearing mine fields in
Cambodia. ([Wikipedia: Magawa](https://en.wikipedia.org/wiki/Magawa))

![Magawa](./src/static/images/magawa.jpg)

## License and Author

[MIT &copy; 2020 Simon Lepel](http://simbo.mit-license.org/@2020/)
