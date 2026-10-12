# klaudiosinani.com

This repository contains the source code of [klaudiosinani.com](https://klaudiosinani.com).

The site is a static site. [Astro](https://astro.build) builds it, and GitHub Pages hosts it.

## Status

<div style="display: inline-flex; gap: 8px; flex-wrap: wrap;">

<a href="https://github.com/klaudiosinani/klaudiosinani.github.io/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/klaudiosinani/klaudiosinani.github.io/actions/workflows/ci.yml/badge.svg"></a>
<a href="https://github.com/klaudiosinani/klaudiosinani.github.io/actions/workflows/cd.yml"><img alt="CD" src="https://github.com/klaudiosinani/klaudiosinani.github.io/actions/workflows/cd.yml/badge.svg"></a>
<a href="https://codecov.io/gh/klaudiosinani/klaudiosinani.github.io"><img alt="Coverage" src="https://codecov.io/gh/klaudiosinani/klaudiosinani.github.io/graph/badge.svg"></a>
<a href="https://klaudiosinani.com"><img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fklaudiosinani.com&label=klaudiosinani.com&up_color=%2332C955"></a>

</div>

## Setup

Install the dependencies. The command uses the exact versions from the lockfile.

```bash
npm ci
```

One dependency is held above the version that asks for it. `@astrojs/react`
asks for `@vitejs/plugin-react` 5, which states two options that Vite 8 has
deprecated, and every run of `astro dev` said so three times. Version 6 of the
plugin states the new ones instead. The `overrides` field of `package.json`
holds it there; drop the field once `@astrojs/react` asks for 6 itself.

### Data

The development server and the build read the same live sources. Every answer
goes to `.cache/http` under the name of the request, so a later run reads
the file and reaches no network. The first `npm run dev` is slow for that
reason, and the ones after it start at once.

`import.meta.env.PROD` decides whether the cache is used: a development run
keeps its answers, a production build does not. `HTTP_CACHE=0` stops the cache,
and `HTTP_CACHE=1` keeps the answers of a build as well. Nothing expires the
files. Delete `.cache/http` to read the services again.

To read the live data, state the tokens. Copy the example file and fill it in.

```bash
cp .env.example .env
```

Or state them in the shell alone, which some prefer because the value is then
in no file:

```bash
export GITHUB_TOKEN=...
```

Both work: the build reads `.env` as well as the shell, and a value in the
shell wins over the same name in the file. `.env` is ignored by git.

Ask what the next build can read. It prints which tokens are there, never
their values, and the build prints the same list before it starts.

```bash
npm run check:tokens
```

| Variable                     | What it carries                                     | Without it                                             |
| ---------------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| `GITHUB_TOKEN`               | 5,000 requests an hour instead of 60                | The build stops part way through, at the rate limit.   |
| `GITHUB_TRAFFIC_TOKEN`       | The clones and the views of each repository         | Those figures report as unavailable, not as zero.      |
| `GITHUB_CONTRIBUTIONS_TOKEN` | Commits, the ones in private repositories with them | The commit figures count the public repositories only. |

Only the first one is necessary.

**`GITHUB_TOKEN`** — fine-grained token. Repository access **Public
Repositories (read-only)**, and no permission to select: `Metadata: Read-only`
comes with every token, and so does read-only access to all public
repositories. Every REST call this build makes on public data already answers
an anonymous request, so the token adds no read. GraphQL is the one exception:
it answers no anonymous request at all, and the issue, pull request and commit
counts come from there. A token with no permission over any account is a token
a leak costs nothing.

**`GITHUB_TRAFFIC_TOKEN`** — fine-grained token. Repository access **Only
select repositories** (the ones to report on), repository permission
**`Administration: Read-only`**. The traffic interface answers the owner of the
repository alone; an anonymous request gets 401. `Administration` is a real
grant over the settings of those repositories, so keep this token off a machine
you share.

**`GITHUB_CONTRIBUTIONS_TOKEN`** — a **classic** token with the **`read:user`**
scope alone, and notably not `repo`. The count of private contributions comes
from `restrictedContributionsCount` in GraphQL, and no fine-grained permission,
of a repository or of an account, covers contributions.

No other service needs a token. npm, PyPI, Homebrew and the Snap Store all
answer an anonymous request for the figures this site shows.

The one exception is the snap installed base, which the store gives to an
authenticated publisher alone. The build holds no credential for it: it reads
`snap-metrics.json`, which a scheduled workflow is to write. **That workflow
does not exist yet**, so this figure reports as unavailable everywhere, in CI
as much as on your machine.

## Commands

Start the development server. Then open `localhost:4321`.

```bash
npm run dev
```

Build the site and look at the result. With the tokens in place this is the
live data, the same the deployed site carries. It reads every repository, so it
takes about eight minutes.

```bash
npm run build && npm run preview
```

Do all the quality checks. Run this command before you commit.

```bash
npm run check && npm test && npm run lint && npm run format:check
```

Hold every built page to the rules of the metadata: one title of a length a
result holds, one description, a canonical address, a share card that exists,
one first-level heading, no heading level skipped, and structured data that
reads as JSON. Run it after a build.

```bash
npm run build && npm run audit:seo
```

The table that follows shows each script.

| Script                | Function                                                  |
| --------------------- | --------------------------------------------------------- |
| `dev` / `start`       | Starts the development server on port `4321`.             |
| `build`               | Builds the site into the `dist` directory.                |
| `preview`             | Shows the built site on a local server.                   |
| `check`               | Checks the types in the `.astro`, `.ts` and `.tsx` files. |
| `test` / `test:watch` | Runs the tests with Vitest.                               |
| `coverage`            | Runs the tests and makes a v8 coverage report.            |
| `lint`                | Examines the code with ESLint.                            |
| `format`              | Applies the code style with Prettier.                     |
| `format:check`        | Checks that the files agree with the code style.          |
| `sync`                | Makes the content collection types again.                 |
| `check:tokens`        | States which sources the next build can read.             |
| `audit:seo`           | Holds every built page to the rules of the metadata.      |

## Layout

Each feature directory contains the code for one part of the site. The `shared` directory contains the code that more
than one feature uses.

```
src
├── config                # site settings
├── content               # markdown collections
├── features              # code for one part of the site
│   ├── activity
│   ├── impact
│   ├── pagination
│   ├── press
│   ├── publication
│   ├── repository
│   ├── search
│   └── software
├── pages                 # routes
│   ├── index.astro
│   └── <section>
└── shared                # code that more than one feature uses
    ├── assets
    ├── components
    ├── layouts
    ├── scripts
    ├── services
    ├── styles
    └── utils
```

## Composition

Every class does one thing, and every collaborator it needs arrives through
its constructor:

```ts
public constructor(
  repositories: RetrievalService<RepositoryData> = RepositoryDataRetrievalService.shared(),
  releases: RepositoryReleaseProvider = new RepositoryReleaseProvider(),
  commits: RepositoryCommitProvider = new RepositoryCommitProvider()
) { ... }
```

The default states what the class works with in a build. The parameter lets a
page compose it differently, and lets a test answer it without the network. A
class never reaches for a collaborator inside a method.

Three kinds of class follow from that rule:

- a **provider** makes one kind of request and states what came back;
- a **retrieval service** holds the answer for the whole build and hands it to
  everybody who asks;
- a **factory**, a **resolver** and a **formatter** hold no state and make no
  request: they take data and give data, so they are static.

The pages are where the parts are put together. A factory makes each provider
and holds one instance of it, and nothing below the page knows where the answer
came from: the services, or the cache on the machine.

## Design

The colours, the type and the components of the site are stated in one place:
[`docs/design-language.md`](docs/design-language.md). Read it before you add a
component, and add to it when you make a decision that a later component
should follow.

## Assets

Some parts of a page draw a file only where the file is there. Where the file
is not there, the page states nothing, and no picture breaks.

| File                            | The page that draws it  | How to make it                                     |
| ------------------------------- | ----------------------- | -------------------------------------------------- |
| `public/portrait.<type>`        | About                   | The build reads it from GitHub. See below.         |
| `public/casts/<repository>.svg` | The page of the project | A recording of the tool in a terminal. See below.  |
| `public/snap-metrics.json`      | Impact                  | The report of the Snap Store. See [Setup](#setup). |

The photograph needs nothing from you. Before it renders a page, the build
reads the picture of your GitHub account, which GitHub serves at the address
of the account with `.png` after it, and writes it to `public`. It is held
under the ending of the type GitHub answers with, which is `jpg` for most
accounts, because the address ends in `.png` and the answer does not. Change
the picture on GitHub and the next build carries it.

The build states one line for it, and it never fails: a build that cannot
reach GitHub keeps the picture of the build before it, and a build that never
had one draws no picture. The file is written by the build, so it is not held
in this repository.

To record a tool in a terminal, install
[`asciinema`](https://asciinema.org) and
[`svg-term-cli`](https://github.com/marionebl/svg-term-cli), then:

```sh
asciinema rec taskbook.cast --cols 88 --rows 24
# Run the commands you want to show, then press Ctrl+D.
svg-term --in taskbook.cast --out public/casts/taskbook.svg --window --width 88 --height 24
```

Keep the recording under 30 seconds, and type slowly: the animation plays at
the speed you typed at. Name the file with the name of the repository, in
lower case.

## Team

- Klaudio Sinani [(@klaudiosinani)](https://klaudiosinani.com)

## License

[MIT](license.md)
