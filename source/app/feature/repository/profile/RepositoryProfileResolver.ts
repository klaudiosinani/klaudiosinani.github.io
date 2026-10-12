import type { FeaturedSoftware } from "@app/feature/software/featured/FeaturedSoftware";
import type { RepositoryProfile } from "./RepositoryProfile";

export class RepositoryProfileResolver {
    public resolve(profile: RepositoryProfile, curated: readonly FeaturedSoftware[]): RepositoryProfile {
        const entry: FeaturedSoftware | undefined = curated.find((candidate: FeaturedSoftware) =>
            this.isFor(candidate, profile.slug)
        );

        if (!entry) {
            return profile;
        }

        return {
            ...profile,
            name: entry.name,
            logline: entry.logline,
            description: entry.description,
            seoTitle: entry.seoTitle,
        };
    }

    private isFor(entry: FeaturedSoftware, slug: string): boolean {
        const trimmed: string = entry.url.replace(/\/+$/, "").toLowerCase();

        return trimmed.slice(trimmed.lastIndexOf("/") + 1) === slug.toLowerCase();
    }
}
