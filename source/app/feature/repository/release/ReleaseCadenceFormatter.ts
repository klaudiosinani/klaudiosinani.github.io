import type { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter";
import type { RepositoryRelease } from "./RepositoryRelease";

export class ReleaseCadenceFormatter {
    private readonly datetimeFormatter: DatetimeFormatter;

    public constructor(datetimeFormatter: DatetimeFormatter) {
        this.datetimeFormatter = datetimeFormatter;
    }
    public format(releases: readonly RepositoryRelease[]): string | null {
        if (releases.length === 0) {
            return null;
        }

        const newest: RepositoryRelease = releases[0];
        const oldest: RepositoryRelease = releases[releases.length - 1];
        const count: string = `${releases.length} ${releases.length === 1 ? "release" : "releases"}`;
        const latest: string = `latest ${this.datetimeFormatter.formatDate(newest.getPublishedAt())}`;

        if (releases.length === 1) {
            return `${count}, ${latest}`;
        }

        return `${count}, ${latest}, first ${this.datetimeFormatter.formatDate(oldest.getPublishedAt())}`;
    }
}
