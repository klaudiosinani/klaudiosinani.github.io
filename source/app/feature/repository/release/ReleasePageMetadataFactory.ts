import type { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { PageTitleFormatter } from "@app/util/text/PageTitleFormatter";
import type { ReleaseSummaryFormatter } from "@app/feature/repository/release/ReleaseSummaryFormatter";
import { ReleasePageMetadata } from "./ReleasePageMetadata";
import type { RepositoryProfile } from "../profile/RepositoryProfile";
import type { RepositoryRelease } from "./RepositoryRelease";

export class ReleasePageMetadataFactory {
    private readonly datetimeFormatter: DatetimeFormatter;
    private readonly numberFormatter: NumberFormatter;
    private readonly pageTitleFormatter: PageTitleFormatter;
    private readonly releaseSummaryFormatter: ReleaseSummaryFormatter;
    private readonly LIMIT: number = 160;
    private readonly SHORTEST: number = 120;
    private readonly SHORTEST_TAIL: number = 20;

    public constructor(
        datetimeFormatter: DatetimeFormatter,
        numberFormatter: NumberFormatter,
        pageTitleFormatter: PageTitleFormatter,
        releaseSummaryFormatter: ReleaseSummaryFormatter
    ) {
        this.datetimeFormatter = datetimeFormatter;
        this.numberFormatter = numberFormatter;
        this.pageTitleFormatter = pageTitleFormatter;
        this.releaseSummaryFormatter = releaseSummaryFormatter;
    }

    public create(
        profile: RepositoryProfile,
        release: RepositoryRelease,
        siteTitle: string,
        author: string
    ): ReleasePageMetadata {
        return new ReleasePageMetadata(
            this.pageTitleFormatter.format(`${profile.name} ${release.getTag()} release notes`, siteTitle),
            this.description(profile, release, author)
        );
    }

    private description(profile: RepositoryProfile, release: RepositoryRelease, author: string): string {
        const opening: string = `${profile.name} ${release.getTag()} by ${author}, published on ${this.datetimeFormatter.formatDate(release.getPublishedAt())}.`;

        const stated: string = [
            this.summary(release),
            this.served(release),
            `${profile.logline.trim().replace(/\.+$/, "")}.`,
        ]
            .filter((sentence: string | null): sentence is string => typeof sentence === "string")
            .reduce(
                (running: string, sentence: string) =>
                    running.length >= this.SHORTEST || `${running} ${sentence}`.length > this.LIMIT
                        ? running
                        : `${running} ${sentence}`,
                opening
            );

        return stated.length >= this.SHORTEST ? stated : this.filled(stated, release);
    }

    private filled(stated: string, release: RepositoryRelease): string {
        const words: string = this.words(release);
        const room: number = this.LIMIT - stated.length - 2;

        if (words.length === 0 || room < this.SHORTEST_TAIL || stated.includes(words.slice(0, this.SHORTEST_TAIL))) {
            return stated;
        }

        if (words.length <= room) {
            return `${stated} ${words}${words.endsWith(".") ? "" : "."}`;
        }

        const cut: string = words.slice(0, room);

        return `${stated} ${cut.slice(0, cut.lastIndexOf(" ")).trim()}…`;
    }

    private summary(release: RepositoryRelease): string | null {
        const words: string = this.words(release);

        const [sentence] = words.split(/(?<=\.)\s/);

        return sentence && sentence.length >= 20 ? sentence : null;
    }

    private words(release: RepositoryRelease): string {
        return this.releaseSummaryFormatter.words(release.getNotes());
    }

    private served(release: RepositoryRelease): string | null {
        return release.getDownloads() > 0
            ? `${this.numberFormatter.display(release.getDownloads())} downloads of the attached files.`
            : null;
    }
}
