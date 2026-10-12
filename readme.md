# klaudiosinani.com

This repository holds the source code of [klaudiosinani.com](https://klaudiosinani.com), the personal site of Klaudio Sinani.

## Commands

```sh
npm install
npm run dev
npm run build
npm test
```

## Environment

The build reads these variables from `.env`.

- `GITHUB_TOKEN` raises the rate limit of the GitHub API.
- `GITHUB_TRAFFIC_TOKEN` reads the clones and the views of each repository.
- `GITHUB_CONTRIBUTIONS_TOKEN` also counts the commits in private repositories.
- `SNAPCRAFT_STORE_CREDENTIALS` reads the installed base of each snap.

## License

[MIT](license.md)
