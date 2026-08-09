# klaudiosinani.com

Source code of [klaudiosinani.com](https://klaudiosinani.com).

## Status

<div style="display: inline-flex; gap: 8px; flex-wrap: wrap;">

<a href="https://github.com/klaudiosinani/klaudiosinani.github.io/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/klaudiosinani/klaudiosinani.github.io/actions/workflows/ci.yml/badge.svg"></a>
<a href="https://github.com/klaudiosinani/klaudiosinani.github.io/actions/workflows/cd.yml"><img alt="CD" src="https://github.com/klaudiosinani/klaudiosinani.github.io/actions/workflows/cd.yml/badge.svg"></a>
<a href="https://codecov.io/gh/klaudiosinani/klaudiosinani.github.io"><img alt="Coverage" src="https://codecov.io/gh/klaudiosinani/klaudiosinani.github.io/graph/badge.svg"></a>
<a href="https://klaudiosinani.com"><img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fklaudiosinani.com&label=klaudiosinani.com&up_color=%2332C955"></a>

</div>

## Setup

```bash
npm ci # install exact-pinned dependencies
```

## Commands

```bash
npm run dev      # localhost:4321
npm run build && npm run preview
npm run check && npm test && npm run lint && npm run format:check
```

| Script                    | Does                                |
| ------------------------- | ----------------------------------- |
| `dev` / `start`           | Dev server on `:4321`               |
| `build` / `preview`       | Build to `dist/`                    |
| `check`                   | Type check `.astro`, `.ts`, `.tsx`  |
| `test` / `test:watch`     | Vitest                              |
| `coverage`                | Vitest & v8 report                  |
| `lint`                    | ESLint                              |
| `format` / `format:check` | Prettier                            |
| `sync`                    | Regenerate content collection types |

## Layout

```
src
├── config                # settings
├── pages                 # routes
│   ├── index.astro
│   └── <section>
├── content               # markdown collections
├── features              # application
│   ├── pagination
│   ├── press
│   ├── publication
│   ├── search
│   └── software
└── shared                # reused logic
    ├── components
    ├── layouts
    ├── services
    ├── scripts
    ├── utils
    ├── styles
    └── assets
```

## Team

- Klaudio Sinani [(@klaudiosinani)](https://klaudiosinani.com)

## License

[MIT](license.md)
