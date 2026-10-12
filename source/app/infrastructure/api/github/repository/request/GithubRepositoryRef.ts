export class GithubRepositoryRef {
    private readonly owner: string;
    private readonly slug: string;

    public constructor(owner: string, slug: string) {
        this.owner = owner;
        this.slug = slug;
    }

    public getOwner(): string {
        return this.owner;
    }

    public getSlug(): string {
        return this.slug;
    }

    public getPath(): string {
        return `${this.owner}/${this.slug}`;
    }
}
