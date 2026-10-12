import type { RepositoryRelease } from "./RepositoryRelease";

export class PublishedRelease {
    private readonly release: RepositoryRelease;
    private readonly project: string;
    private readonly slug: string;

    public constructor(release: RepositoryRelease, project: string, slug: string) {
        this.release = release;
        this.project = project;
        this.slug = slug;
    }

    public getRelease(): RepositoryRelease {
        return this.release;
    }
    public getProject(): string {
        return this.project;
    }
    public getSlug(): string {
        return this.slug;
    }
}
