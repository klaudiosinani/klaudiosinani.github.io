import type { RepositoryProfile } from "./RepositoryProfile";
import type { RepositoryProfileProvider } from "./RepositoryProfileProvider";
import { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";

export class RepositoryProfileRetrievalService {
    private readonly provider: RepositoryProfileProvider;
    private readonly username: string;
    private readonly pending: Map<string, Promise<RepositoryProfile | null>> = new Map<
        string,
        Promise<RepositoryProfile | null>
    >();

    public constructor(username: string, provider: RepositoryProfileProvider) {
        this.username = username;
        this.provider = provider;
    }

    public async retrieve(slug: string): Promise<RepositoryProfile | null> {
        const gathered: Promise<RepositoryProfile | null> | undefined = this.pending.get(slug);

        if (gathered) {
            return gathered;
        }

        const started: Promise<RepositoryProfile | null> = this.provider
            .provide(new GithubRepositoryRef(this.username, slug))
            .catch((error: unknown) => {
                this.pending.delete(slug);
                throw error;
            });

        this.pending.set(slug, started);

        return started;
    }
}
