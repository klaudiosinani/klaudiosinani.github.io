import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { GithubRepositoryDataRetrievalService } from "@app/infrastructure/api/github/repository/data/GithubRepositoryDataRetrievalService";
import type { SnapcraftMetricsApiService } from "@app/infrastructure/api/snapcraft/metrics/SnapcraftMetricsApiService";
import type { SnapcraftSnapApiService } from "@app/infrastructure/api/snapcraft/snap/SnapcraftSnapApiService";
import { BuildAnswer } from "@app/infrastructure/common/BuildAnswer";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";

export class SnapcraftInstallsRetrievalService {
    private readonly githubRepositoryDataRetrievalService: GithubRepositoryDataRetrievalService;
    private readonly snapcraftSnapApiService: SnapcraftSnapApiService;
    private readonly snapcraftMetricsApiService: SnapcraftMetricsApiService;
    private readonly optionalReader: OptionalReader;
    private readonly buildAnswer: BuildAnswer<Map<string, number>> = new BuildAnswer();

    public constructor(
        githubRepositoryDataRetrievalService: GithubRepositoryDataRetrievalService,
        snapcraftSnapApiService: SnapcraftSnapApiService,
        snapcraftMetricsApiService: SnapcraftMetricsApiService,
        optionalReaderFactory: OptionalReaderFactory
    ) {
        this.githubRepositoryDataRetrievalService = githubRepositoryDataRetrievalService;
        this.snapcraftSnapApiService = snapcraftSnapApiService;
        this.snapcraftMetricsApiService = snapcraftMetricsApiService;
        this.optionalReader = optionalReaderFactory.create("Snapcraft");
    }

    public async retrieve(today: Date): Promise<Map<string, number>> {
        return this.buildAnswer.of(() => this.readInstalls(today));
    }

    private async readInstalls(today: Date): Promise<Map<string, number>> {
        const snapIds: Record<string, string> = await this.readSnapIds();

        const installs: Map<string, number> | null = await this.optionalReader.read<Map<string, number>>(
            "the installed base of the snaps",
            () => this.snapcraftMetricsApiService.getInstallsBySnap(snapIds, today)
        );

        return installs ?? new Map<string, number>();
    }

    private async readSnapIds(): Promise<Record<string, string>> {
        const repositories: GithubRepositoryData[] = await this.githubRepositoryDataRetrievalService.retrieve();
        const snapIds: Record<string, string> = {};

        for (const repository of repositories) {
            const snapId: string | null = await this.optionalReader.read<string>(
                `the snap ${repository.getName()}`,
                () => this.snapcraftSnapApiService.getSnapId(repository.getName())
            );

            if (snapId !== null) {
                snapIds[repository.getName()] = snapId;
            }
        }

        return snapIds;
    }
}
