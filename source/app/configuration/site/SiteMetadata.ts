export class SiteMetadata {
    private readonly website: string;
    private readonly author: string;
    private readonly profile: string;
    private readonly desc: string;
    private readonly title: string;
    private readonly homeTitle: string;
    private readonly ogImage: string | undefined;
    private readonly startYear: number;
    private readonly googleSiteVerification: string;

    public constructor(
        website: string,
        author: string,
        profile: string,
        desc: string,
        title: string,
        homeTitle: string,
        ogImage: string | undefined,
        startYear: number,
        googleSiteVerification: string
    ) {
        this.website = website;
        this.author = author;
        this.profile = profile;
        this.desc = desc;
        this.title = title;
        this.homeTitle = homeTitle;
        this.ogImage = ogImage;
        this.startYear = startYear;
        this.googleSiteVerification = googleSiteVerification;
    }

    public getWebsite(): string {
        return this.website;
    }
    public getAuthor(): string {
        return this.author;
    }
    public getProfile(): string {
        return this.profile;
    }
    public getDesc(): string {
        return this.desc;
    }
    public getTitle(): string {
        return this.title;
    }
    public getHomeTitle(): string {
        return this.homeTitle;
    }
    public getOgImage(): string | undefined {
        return this.ogImage;
    }
    public getStartYear(): number {
        return this.startYear;
    }
    public getGoogleSiteVerification(): string {
        return this.googleSiteVerification;
    }
}
