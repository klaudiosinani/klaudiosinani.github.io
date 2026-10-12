import type { SoftwareSignals } from "../signal/SoftwareSignals";

export class FeaturedSoftwareEntry {
    private readonly name: string;
    private readonly logline: string;
    private readonly description: string;
    private readonly url: string;
    private readonly order: number;
    private readonly seoTitle: string | undefined;
    private readonly stars: number | null;
    private readonly forks: number | null;
    private readonly language: string | null;
    private readonly slug: string | null;
    private readonly softwareSignals: SoftwareSignals;

    public constructor(
        name: string,
        logline: string,
        description: string,
        url: string,
        order: number,
        seoTitle: string | undefined,
        stars: number | null,
        forks: number | null,
        language: string | null,
        slug: string | null,
        softwareSignals: SoftwareSignals
    ) {
        this.name = name;
        this.logline = logline;
        this.description = description;
        this.url = url;
        this.order = order;
        this.seoTitle = seoTitle;
        this.stars = stars;
        this.forks = forks;
        this.language = language;
        this.slug = slug;
        this.softwareSignals = softwareSignals;
    }

    public getName(): string {
        return this.name;
    }

    public getLogline(): string {
        return this.logline;
    }

    public getDescription(): string {
        return this.description;
    }

    public getUrl(): string {
        return this.url;
    }

    public getOrder(): number {
        return this.order;
    }

    public getSeoTitle(): string | undefined {
        return this.seoTitle;
    }

    public getStars(): number | null {
        return this.stars;
    }

    public getForks(): number | null {
        return this.forks;
    }

    public getLanguage(): string | null {
        return this.language;
    }

    public getSlug(): string | null {
        return this.slug;
    }

    public getSoftwareSignals(): SoftwareSignals {
        return this.softwareSignals;
    }

    public hasPage(): boolean {
        return this.slug !== null;
    }
}
