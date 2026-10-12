export class ActivityConfiguration {
    private readonly REPOSITORY_COUNT: number = 6;
    private readonly ENTRIES_PER_KIND_PER_REPOSITORY: number = 20;
    private readonly ENTRIES_PER_KIND: number = 20;
    private readonly ENTRIES_PER_KIND_ON_INDEX: number = 3;

    public getRepositoryCount(): number {
        return this.REPOSITORY_COUNT;
    }

    public getEntriesPerKindPerRepository(): number {
        return this.ENTRIES_PER_KIND_PER_REPOSITORY;
    }

    public getEntriesPerKind(): number {
        return this.ENTRIES_PER_KIND;
    }

    public getEntriesPerKindOnIndex(): number {
        return this.ENTRIES_PER_KIND_ON_INDEX;
    }
}
