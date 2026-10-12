export class DependentCounts {
    private readonly repositories: number;
    private readonly packages: number;

    public constructor(repositories: number, packages: number) {
        this.repositories = repositories;
        this.packages = packages;
    }

    public getRepositories(): number {
        return this.repositories;
    }
    public getPackages(): number {
        return this.packages;
    }
}
