import type { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter";
import type { PageTitleFormatter } from "@app/util/text/PageTitleFormatter";
import { RepositorySubPageMetadata } from "./RepositorySubPageMetadata";
import type { MarkdownHeading } from "astro";
import type { RepositoryProfile } from "../profile/RepositoryProfile";

export class RepositorySubPageMetadataFactory {
    private readonly datetimeFormatter: DatetimeFormatter;
    private readonly pageTitleFormatter: PageTitleFormatter;
    private readonly LIMIT: number = 160;
    private readonly SECTIONS: number = 4;

    public constructor(datetimeFormatter: DatetimeFormatter, pageTitleFormatter: PageTitleFormatter) {
        this.datetimeFormatter = datetimeFormatter;
        this.pageTitleFormatter = pageTitleFormatter;
    }
    private readonly SHORTEST: number = 120;

    public manual(profile: RepositoryProfile, siteTitle: string, author: string): RepositorySubPageMetadata {
        const sections: string[] = (profile.manual?.getHeadings() ?? [])
            .filter(({ depth }: MarkdownHeading) => depth === 2)
            .map(({ text }: MarkdownHeading) => text.toLowerCase())
            .slice(0, this.SECTIONS);

        return new RepositorySubPageMetadata(
            this.pageTitleFormatter.format(`${profile.name} documentation`, siteTitle),
            this.filled(
                [
                    `Documentation for ${profile.name} by ${author}.`,
                    sections.length > 0 ? `${sections.join(", ")}.` : null,
                    this.summary(profile),
                ],
                profile
            )
        );
    }

    public releases(profile: RepositoryProfile, siteTitle: string, author: string): RepositorySubPageMetadata {
        const [latest] = profile.releases;
        const count: number = profile.releases.length;
        const noun: "release" | "releases" = count === 1 ? "release" : "releases";

        return new RepositorySubPageMetadata(
            this.pageTitleFormatter.format(`${profile.name} releases`, siteTitle),
            this.filled(
                [
                    `${count} ${noun} of ${profile.name} by ${author}.`,
                    latest
                        ? `${latest.getTag()} is the newest, published on ${this.datetimeFormatter.formatDate(latest.getPublishedAt())}.`
                        : null,
                    "Notes, dates and downloads for each one.",
                ],
                profile
            )
        );
    }

    private filled(sentences: (string | null)[], profile: RepositoryProfile): string {
        const [opening, ...rest] = [...sentences, this.summary(profile)].filter(
            (sentence: string | null): sentence is string => typeof sentence === "string"
        );

        return rest.reduce(
            (running: string, sentence: string) =>
                running.length >= this.SHORTEST || `${running} ${sentence}`.length > this.LIMIT
                    ? running
                    : `${running} ${sentence}`,
            opening
        );
    }

    private summary(profile: RepositoryProfile): string {
        return `${profile.logline.trim().replace(/\.+$/, "")}.`;
    }
}
