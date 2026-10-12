export class GithubReleaseDto {
    private readonly tagName: string;
    private readonly name: string | null;
    private readonly htmlUrl: string;
    private readonly publishedAt: string | null;
    private readonly draft: boolean;
    private readonly prerelease: boolean;
    private readonly body: string | null;
    private readonly assetDownloadCounts: readonly number[];

    public constructor(
        tagName: string,
        name: string | null,
        htmlUrl: string,
        publishedAt: string | null,
        draft: boolean,
        prerelease: boolean,
        body: string | null,
        assetDownloadCounts: readonly number[]
    ) {
        this.tagName = tagName;
        this.name = name;
        this.htmlUrl = htmlUrl;
        this.publishedAt = publishedAt;
        this.draft = draft;
        this.prerelease = prerelease;
        this.body = body;
        this.assetDownloadCounts = assetDownloadCounts;
    }

    public getTagName(): string {
        return this.tagName;
    }

    public getName(): string | null {
        return this.name;
    }

    public getHtmlUrl(): string {
        return this.htmlUrl;
    }

    public getPublishedAt(): string | null {
        return this.publishedAt;
    }

    public isDraft(): boolean {
        return this.draft;
    }

    public isPrerelease(): boolean {
        return this.prerelease;
    }

    public getBody(): string | null {
        return this.body;
    }

    public getAssetDownloadCounts(): readonly number[] {
        return this.assetDownloadCounts;
    }

    public isPublished(): boolean {
        return this.publishedAt !== null && !this.draft;
    }
}
