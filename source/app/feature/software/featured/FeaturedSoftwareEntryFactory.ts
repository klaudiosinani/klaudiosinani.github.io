import type { FeaturedSoftware } from "./FeaturedSoftware";
import { FeaturedSoftwareEntry } from "./FeaturedSoftwareEntry";
import type { SoftwareSignals } from "../signal/SoftwareSignals";

export class FeaturedSoftwareEntryFactory {
    public create(
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
    ): FeaturedSoftwareEntry {
        return new FeaturedSoftwareEntry(
            name,
            logline,
            description,
            url,
            order,
            seoTitle,
            stars,
            forks,
            language,
            slug,
            softwareSignals
        );
    }

    public createCurated(
        featuredSoftware: FeaturedSoftware,
        stars: number | null,
        forks: number | null,
        language: string | null,
        slug: string | null,
        softwareSignals: SoftwareSignals
    ): FeaturedSoftwareEntry {
        return new FeaturedSoftwareEntry(
            featuredSoftware.name,
            featuredSoftware.logline,
            featuredSoftware.description,
            featuredSoftware.url,
            featuredSoftware.order,
            featuredSoftware.seoTitle,
            stars,
            forks,
            language,
            slug,
            softwareSignals
        );
    }
}
