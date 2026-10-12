import { DownloadSource } from "./DownloadSource";
import type { DownloadActivity } from "@app/feature/repository/download/DownloadActivity";
import { RepositoryDownloadRecord } from "./RepositoryDownloadRecord";
import type { NpmDownloadTotals } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotals";
import type { NpmDownloadTotalsRetrievalService } from "./NpmDownloadTotalsRetrievalService";
import type { PypiDownloadApiService } from "@app/infrastructure/api/pypi/download/PypiDownloadApiService";
import type { PypiDownloadWindow } from "@app/infrastructure/api/pypi/download/window/PypiDownloadWindow";
import type { SnapcraftInstallsRetrievalService } from "./SnapcraftInstallsRetrievalService";
import { NpmDownloadTotalsFactory } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotalsFactory";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { RepositoryDownloadsSource } from "./RepositoryDownloadsSource";
import type { PackageListing } from "../package/PackageListing";

import type { RepositoryDownloadsCalculator } from "./RepositoryDownloadsCalculator";
import type { RepositoryRelease } from "../release/RepositoryRelease";

export class RepositoryDownloadsProvider implements RepositoryDownloadsSource {
    private readonly npm: NpmDownloadTotalsRetrievalService;
    private readonly pypi: PypiDownloadApiService;
    private readonly snapcraft: SnapcraftInstallsRetrievalService;
    private readonly optionalReader: OptionalReader;
    private readonly repositoryDownloadsCalculator: RepositoryDownloadsCalculator;
    private readonly downloadActivity: DownloadActivity;

    public constructor(
        npm: NpmDownloadTotalsRetrievalService,
        pypi: PypiDownloadApiService,
        snapcraft: SnapcraftInstallsRetrievalService,
        optionalReaderFactory: OptionalReaderFactory,
        downloadActivity: DownloadActivity,
        repositoryDownloadsCalculator: RepositoryDownloadsCalculator
    ) {
        this.npm = npm;
        this.pypi = pypi;
        this.snapcraft = snapcraft;
        this.optionalReader = optionalReaderFactory.create("Downloads");
        this.downloadActivity = downloadActivity;
        this.repositoryDownloadsCalculator = repositoryDownloadsCalculator;
    }

    public async record(
        slug: string,
        packages: readonly PackageListing[],
        releases: readonly RepositoryRelease[]
    ): Promise<RepositoryDownloadRecord> {
        const [npm, pypi, snap] = await Promise.all([
            this.published(packages, "npm")
                ? this.npmTotals(slug)
                : Promise.resolve(new NpmDownloadTotalsFactory().createEmpty()),
            this.published(packages, "pypi") ? this.pypiWindow(slug) : null,
            this.snapInstalls(slug),
        ]);

        return new RepositoryDownloadRecord(
            this.repositoryDownloadsCalculator.compute([
                new DownloadSource("npm", npm.getAll(), undefined),
                new DownloadSource("GitHub releases", this.attached(releases), undefined),
                new DownloadSource(
                    "PyPI",
                    pypi?.getDownloads() ?? null,
                    `PyPI keeps ${pypi?.getDays() ?? 0} days of counts, and no record before them`
                ),
                new DownloadSource(
                    "Snap",
                    snap,
                    "Snap gives the devices that hold it now, not the times it was fetched"
                ),
            ]),
            this.downloadActivity.isPlottable(npm.getTrend().all) ? npm.getTrend().all : [],
            npm.getLastPublishedDay()
        );
    }

    private attached(releases: readonly RepositoryRelease[]): number {
        return releases.reduce((running: number, release: RepositoryRelease) => running + release.getDownloads(), 0);
    }

    private published(packages: readonly PackageListing[], registry: string): boolean {
        return packages.some((listing: PackageListing) => listing.getRegistry() === registry);
    }

    private async npmTotals(name: string): Promise<NpmDownloadTotals> {
        const totalsByPackage: Map<string, NpmDownloadTotals> | null = await this.optionalReader.read<
            Map<string, NpmDownloadTotals>
        >(`the npm downloads of ${name}`, () => this.npm.retrieve(new Date()));

        return totalsByPackage?.get(name) ?? new NpmDownloadTotalsFactory().createEmpty();
    }

    private async pypiWindow(name: string): Promise<PypiDownloadWindow | null> {
        return this.optionalReader.read<PypiDownloadWindow>(`the PyPI downloads of ${name}`, () =>
            this.pypi.getDownloadWindow(name)
        );
    }

    private async snapInstalls(name: string): Promise<number | null> {
        const installs: Map<string, number> = await this.snapcraft.retrieve(new Date());

        return installs.get(name) ?? null;
    }
}
