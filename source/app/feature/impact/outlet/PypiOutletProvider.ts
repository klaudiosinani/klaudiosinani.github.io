import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { PypiDownloadApiService } from "@app/infrastructure/api/pypi/download/PypiDownloadApiService";
import { OutletDownloads } from "./OutletDownloads";
import type { OutletDownloadsSource } from "./OutletDownloadsSource";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";

export class PypiOutletProvider implements OutletDownloadsSource {
    private readonly LANGUAGE: string = "Python";

    private readonly reader: PypiDownloadApiService;
    private readonly optionalReader: OptionalReader;

    public constructor(reader: PypiDownloadApiService, optionalReaderFactory: OptionalReaderFactory) {
        this.reader = reader;
        this.optionalReader = optionalReaderFactory.create("PyPI");
    }

    public async downloads(repositories: GithubRepositoryData[]): Promise<OutletDownloads> {
        const packages: string[] = repositories
            .filter(
                (githubRepositoryData: GithubRepositoryData) => githubRepositoryData.getLanguage() === this.LANGUAGE
            )
            .map((githubRepositoryData: GithubRepositoryData) => githubRepositoryData.getName());

        const absent: OutletDownloads = new OutletDownloads("pypi", null, null, null, null);

        if (packages.length === 0) {
            return absent;
        }

        const gathered: (number | null)[] = await Promise.all(packages.map((name: string) => this.attempt(name)));
        const known: number[] = gathered.filter((entry: number | null) => entry !== null);

        if (known.length === 0) {
            return absent;
        }

        return new OutletDownloads(
            "pypi",
            known.reduce((total: number, entry: number) => total + entry, 0),
            null,
            null,
            null
        );
    }

    private async attempt(name: string): Promise<number | null> {
        return this.optionalReader.read<number>(`the downloads of ${name}`, () =>
            this.reader.getRecentMonthDownloads(name)
        );
    }
}
