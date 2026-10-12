import { existsSync } from "node:fs";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const TOKENS = [
  {
    name: "GITHUB_TOKEN",
    held: "5,000 requests an hour",
    absent: "60 requests an hour: the build stops part way through",
  },
  {
    name: "GITHUB_TRAFFIC_TOKEN",
    held: "clones and views",
    absent: "clones and views report as unavailable",
  },
  {
    name: "GITHUB_CONTRIBUTIONS_TOKEN",
    held: "commits, private repositories with them",
    absent: "commit counts fall back to the public repositories",
  },
  {
    name: "SNAPCRAFT_STORE_CREDENTIALS",
    held: "the snap installed base",
    absent: "the snap installed base reports as unavailable",
  },
];

const state = (name, holds, source) =>
  `  ${name.padEnd(30)}${(holds ? "set" : "absent").padEnd(9)}${source}`;

const report = () => {
  const lines = TOKENS.map(({ name, held, absent }) =>
    state(name, Boolean(process.env[name]), process.env[name] ? held : absent)
  );

  const missing = TOKENS.filter(({ name }) => !process.env[name]).length;

  console.log("What the build can read");
  lines.forEach(line => console.log(line));

  if (!process.env.GITHUB_TOKEN) {
    console.log(
      "\n  No GITHUB_TOKEN. Copy .env.example to .env and state one, or export\n" +
        "  it in the shell. Without it this build stops at the rate limit."
    );
  } else if (missing > 0) {
    console.log(
      `\n  ${missing} of ${TOKENS.length} tokens are absent. The build runs; the` +
        " figures they\n  carry report as unavailable. See .env.example."
    );
  }
};

report();
