import { CountedDownloadSource } from "./CountedDownloadSource";
import type { DownloadSource } from "./DownloadSource";
import { RepositoryDownloads } from "./RepositoryDownloads";

export class RepositoryDownloadsCalculator {
    public compute(reported: readonly DownloadSource[]): RepositoryDownloads {
        const countedDownloadSources: CountedDownloadSource[] = reported
            .filter((downloadSource: DownloadSource) => downloadSource.isCounted())
            .map(
                (downloadSource: DownloadSource) =>
                    new CountedDownloadSource(
                        downloadSource.getLabel(),
                        downloadSource.getValue() ?? 0,
                        downloadSource.getNote()
                    )
            );

        return new RepositoryDownloads(
            countedDownloadSources.length > 0 ? this.total(countedDownloadSources) : null,
            countedDownloadSources,
            countedDownloadSources
                .map((countedDownloadSource: CountedDownloadSource) => countedDownloadSource.getNote())
                .filter((note: string | undefined): note is string => note !== undefined)
        );
    }

    private total(countedDownloadSources: readonly CountedDownloadSource[]): number {
        return countedDownloadSources.reduce(
            (total: number, countedDownloadSource: CountedDownloadSource) => total + countedDownloadSource.getValue(),
            0
        );
    }
}
