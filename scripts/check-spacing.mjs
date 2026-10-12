import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

class SourceFiles {
    constructor(root, endings) {
        this.root = root;
        this.endings = endings;
    }

    list() {
        return this.walk(this.root);
    }

    walk(directory) {
        return readdirSync(directory).flatMap((name) => {
            const path = join(directory, name);

            if (statSync(path).isDirectory()) {
                return this.walk(path);
            }

            return this.endings.some((ending) => path.endsWith(ending)) ? [path] : [];
        });
    }
}

class LadderNames {
    constructor(names) {
        this.names = names;
    }

    holds(step) {
        return this.names.includes(step);
    }
}

class NudgeAllowance {
    constructor(limit) {
        this.limit = limit;
    }

    allows(step) {
        if (step === "0" || step === "px" || step === "auto") {
            return true;
        }

        const pixels = step.match(/^\[(\d+)px\]$/);

        return pixels !== null && Number(pixels[1]) <= this.limit;
    }
}

class SpacingReader {
    constructor(ladderNames, nudgeAllowance) {
        this.ladderNames = ladderNames;
        this.nudgeAllowance = nudgeAllowance;
        this.pattern = /(?<![\w-])-?(?:[mp][tblrxyse]?|gap(?:-[xy])?|space-[xy])-(\[[^\]]+\]|[\w.]+(?:-[\w.]+)*)/g;
    }

    read(path) {
        const lines = readFileSync(path, "utf8").split("\n");

        return lines.flatMap((line, index) =>
            [...line.matchAll(this.pattern)]
                .filter((found) => !this.ladderNames.holds(found[1]) && !this.nudgeAllowance.allows(found[1]))
                .map((found) => ({ path, line: index + 1, written: found[0] }))
        );
    }
}

class SpacingGuard {
    constructor(sourceFiles, spacingReader) {
        this.sourceFiles = sourceFiles;
        this.spacingReader = spacingReader;
    }

    report() {
        return this.sourceFiles.list().flatMap((path) => this.spacingReader.read(path));
    }
}

const LADDER = ["tight", "inline", "text", "part", "head", "group", "section", "gutter", "inset-card", "inset-panel", "inset-band"];

const GUARD = new SpacingGuard(
    new SourceFiles("source/ui", [".astro", ".tsx", ".css"]),
    new SpacingReader(new LadderNames(LADDER), new NudgeAllowance(3))
);

const found = GUARD.report();

if (found.length === 0) {
    console.log("spacing: every space stands on the golden ladder");
    process.exit(0);
}

const byFile = new Map();

found.forEach((one) => byFile.set(one.path, (byFile.get(one.path) ?? 0) + 1));

console.error(`spacing: ${found.length} spaces stand off the golden ladder, in ${byFile.size} files`);
console.error("");
console.error("  The ladder states a relation, not a size:");
console.error("    tight 5   a name over its note          part    21  two parts of one card");
console.error("    inline 8  an icon beside its word       head    34  a head over its content");
console.error("    text 13   two lines of one part         group   55  two groups of one section");
console.error("                                            section 89  two sections of a page");
console.error("");
[...byFile.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 20)
    .forEach(([path, count]) => console.error(`  ${String(count).padStart(4)}  ${path}`));

process.exit(1);
