import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUTPUT = "dist";

const TITLE = { least: 30, most: 60 };
const DESCRIPTION = { least: 110, most: 165 };

const rules = {
  title: (page, report) => {
    const title = one(page.head, /<title>([^<]*)<\/title>/);

    if (!title) {
      return report("no title");
    }

    if (title.length < TITLE.least || title.length > TITLE.most) {
      report(`title of ${title.length} characters: ${title}`);
    }
  },

  description: (page, report) => {
    const description = attribute(page.head, "name", "description");

    if (!description) {
      return report("no description");
    }

    if (
      description.length < DESCRIPTION.least ||
      description.length > DESCRIPTION.most
    ) {
      report(`description of ${description.length} characters`);
    }
  },

  canonical: (page, report) => {
    const canonical = one(page.head, /rel="canonical" href="([^"]*)"/);

    if (!canonical) {
      return report("no canonical address");
    }

    if (page.hidden) {
      return;
    }

    if (!canonical.endsWith(page.path)) {
      report(`canonical ${canonical} is not the address of the page`);
    }
  },

  card: (page, report) => {
    const card = one(page.head, /property="og:image" content="([^"]*)"/);

    if (!card) {
      return report("no share card");
    }

    if (!page.files.has(card.replace(/^https?:\/\/[^/]+/, ""))) {
      report(`the share card ${card} was not built`);
    }
  },

  robots: (page, report) => {
    if (!attribute(page.head, "name", "robots")) {
      report("no robots rule");
    }
  },

  feed: (page, report) => {
    if (!page.head.includes('type="application/rss+xml"')) {
      report("no link to the feed");
    }
  },

  headings: (page, report) => {
    const levels = [...page.html.matchAll(/<h([1-6])[ >]/g)].map(match =>
      Number(match[1])
    );
    const first = levels.filter(level => level === 1).length;

    if (first !== 1) {
      return report(`${first} first-level headings`);
    }

    const jump = levels.find(
      (level, index) => index > 0 && level - levels[index - 1] > 1
    );

    if (jump) {
      report(`a heading level is skipped, down to h${jump}`);
    }
  },

  records: (page, report) => {
    const records = [
      ...page.html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs
      ),
    ].map(match => match[1]);

    if (records.length === 0) {
      return report("no structured data");
    }

    for (const record of records) {
      try {
        const parsed = JSON.parse(record);

        if (!parsed["@context"] || !parsed["@type"]) {
          report("a record states no context or no type");
        }
      } catch {
        report("a record is not readable as JSON");
      }
    }
  },
};

const one = (text, pattern) => pattern.exec(text)?.[1];

const attribute = (head, name, value) =>
  one(head, new RegExp(`${name}="${value}" content="([^"]*)"`));

const walk = async (directory, base = directory, found = new Set()) => {
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry);

    if ((await stat(path)).isDirectory()) {
      await walk(path, base, found);
    } else {
      found.add(`/${relative(base, path).split(sep).join("/")}`);
    }
  }

  return found;
};

const pageOf = (file, files, head) => ({
  file,
  path: `/${file.replace(/^\/?/, "").replace(/index\.html$/, "")}`,
  hidden: (attribute(head, "name", "robots") ?? "").includes("noindex"),
  files,
});

const audit = async () => {
  const files = await walk(OUTPUT);
  const faults = [];

  const pages = [...files].filter(
    file => file.endsWith(".html") && !file.includes("google")
  );

  for (const file of pages) {
    const html = await readFile(join(OUTPUT, file), "utf8");

    if (html.includes('http-equiv="refresh"')) {
      continue;
    }

    const head = html.split("</head>")[0];
    const page = { ...pageOf(file, files, head), html, head };

    for (const [rule, check] of Object.entries(rules)) {
      check(page, message => faults.push(`${page.path} — ${rule}: ${message}`));
    }
  }

  const stated = new Map();

  for (const file of pages) {
    const html = await readFile(join(OUTPUT, file), "utf8");
    const head = html.split("</head>")[0];

    if (html.includes('http-equiv="refresh"')) {
      continue;
    }

    if (pageOf(file, files, head).hidden) {
      continue;
    }

    const title = one(html, /<title>([^<]*)<\/title>/) ?? "";
    const twin = stated.get(title);

    if (twin) {
      faults.push(`${file} — title: the same title as ${twin}`);
    }

    stated.set(title, file);
  }

  if (faults.length > 0) {
    console.error(`SEO audit: ${faults.length} fault(s) in ${pages.length} pages`);
    faults.forEach(fault => console.error(`  ${fault}`));
    process.exit(1);
  }

  console.log(`SEO audit: ${pages.length} pages, no fault`);
};

await audit();
