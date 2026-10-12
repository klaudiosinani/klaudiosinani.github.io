import type { RepositorySignalsResolver } from "@app/feature/repository/signal/RepositorySignalsResolver";
import type { RepositoryProfileRetrievalService } from "@app/feature/repository/profile/RepositoryProfileRetrievalService.ts";
import type { SoftwareSignals } from "@app/feature/software/signal/SoftwareSignals";
import type { SoftwareSignalsSource } from "@app/feature/software/signal/SoftwareSignalsSource";

export class RepositorySignalsSource implements SoftwareSignalsSource {
    private readonly profiles: RepositoryProfileRetrievalService;
    private readonly repositorySignalsResolver: RepositorySignalsResolver;

    public constructor(
        profiles: RepositoryProfileRetrievalService,
        repositorySignalsResolver: RepositorySignalsResolver
    ) {
        this.profiles = profiles;
        this.repositorySignalsResolver = repositorySignalsResolver;
    }

    public async signals(slugs: readonly string[]): Promise<ReadonlyMap<string, SoftwareSignals>> {
        return this.repositorySignalsResolver.of(
            await Promise.all(slugs.map((slug: string) => this.profiles.retrieve(slug)))
        );
    }
}
