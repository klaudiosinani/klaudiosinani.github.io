import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { HomebrewApiService } from "@app/infrastructure/api/homebrew/HomebrewApiService";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import { OutletDownloads } from "./OutletDownloads";
import type { OutletDownloadsSource } from "./OutletDownloadsSource";

export class HomebrewInstallsProvider implements OutletDownloadsSource {
    private readonly optionalReader: OptionalReader;
    private readonly homebrewApiService: HomebrewApiService;

    public constructor(homebrewApiService: HomebrewApiService, optionalReaderFactory: OptionalReaderFactory) {
        this.homebrewApiService = homebrewApiService;
        this.optionalReader = optionalReaderFactory.create("Homebrew");
    }

    public async downloads(repositories: GithubRepositoryData[]): Promise<OutletDownloads> {
        const names: string[] = repositories.map((githubRepositoryData: GithubRepositoryData) =>
            githubRepositoryData.getName()
        );

        const absent: OutletDownloads = new OutletDownloads("homebrew", null, null, null, null);

        if (names.length === 0) {
            return absent;
        }

        const wanted: Set<string> = new Set(names);
        const [month, quarter, year] = await Promise.all([
            this.window("30d", wanted),
            this.window("90d", wanted),
            this.window("365d", wanted),
        ]);

        if (month === null && quarter === null && year === null) {
            return absent;
        }

        return new OutletDownloads("homebrew", month, quarter, year, null);
    }

    private async window(span: string, wanted: Set<string>): Promise<number | null> {
        const feeds: [number | null, number | null] = await Promise.all([
            this.feed(`install/${span}`, "formula", wanted),
            this.feed(`cask-install/${span}`, "cask", wanted),
        ]);
        const known: number[] = feeds.filter((count: number | null) => count !== null);

        if (known.length === 0) {
            return null;
        }

        return known.reduce((total: number, count: number) => total + count, 0);
    }

    private async feed(path: string, key: "formula" | "cask", wanted: Set<string>): Promise<number | null> {
        const body: { items?: Record<string, string>[] } | null = await this.optionalReader.read<{
            items?: Record<string, string>[];
        }>(`the feed ${path}`, () => this.homebrewApiService.getFeed(path));

        if (body === null) {
            return null;
        }

        return (body.items ?? [])
            .filter((item: Record<string, string>) => wanted.has(item[key]))
            .reduce((total: number, item: Record<string, string>) => total + this.parse(item.count), 0);
    }

    private parse(count: string | undefined): number {
        const digits: number = Number((count ?? "").replace(/,/g, ""));

        return Number.isFinite(digits) ? digits : 0;
    }
}
