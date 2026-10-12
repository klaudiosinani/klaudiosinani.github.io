import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { FrontmatterParser } from "./FrontmatterParser.ts";
import type { SignaleLogger } from "../log/SignaleLogger.ts";

export class PublicationLastModifiedResolver {
    private readonly BASE: string = "/publications";
    private readonly MARKDOWN: RegExp = /\.md$/;

    private readonly frontmatterParser: FrontmatterParser;
    private readonly directory: string;
    private readonly signaleLogger: SignaleLogger;

    public constructor(frontmatterParser: FrontmatterParser, directory: string, signaleLogger: SignaleLogger) {
        this.frontmatterParser = frontmatterParser;
        this.directory = directory;
        this.signaleLogger = signaleLogger;
    }

    public async resolve(): Promise<Record<string, string>> {
        const dates: Record<string, string> = {};
        const files: string[] = await this.readFiles();

        for (const file of files) {
            const source: string = await readFile(join(this.directory, file), "utf8");
            const fields: Record<string, string> = this.frontmatterParser.parse(source);

            if (fields.draft === "true") {
                continue;
            }

            const changed: string = fields.modDatetime || fields.pubDatetime;
            const slug: string = fields.slug || file.replace(this.MARKDOWN, "");

            if (changed) {
                dates[`${this.BASE}/${slug}/`] = changed;
            }
        }

        return dates;
    }

    private async readFiles(): Promise<string[]> {
        try {
            const entries: string[] = await readdir(this.directory);

            return entries.filter((entry: string) => this.MARKDOWN.test(entry));
        } catch (error) {
            this.signaleLogger.error(`No publications read from ${this.directory}`, error);

            return [];
        }
    }
}
