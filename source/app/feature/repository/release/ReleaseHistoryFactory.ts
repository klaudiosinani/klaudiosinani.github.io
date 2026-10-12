import { PublishedRelease } from "./PublishedRelease";
import type { RepositoryProfile } from "../profile/RepositoryProfile";
import type { RepositoryRelease } from "./RepositoryRelease";

export class ReleaseHistoryFactory {
    public create(profiles: readonly RepositoryProfile[]): PublishedRelease[] {
        return profiles
            .flatMap((profile: RepositoryProfile) =>
                profile.releases.map(
                    (release: RepositoryRelease) => new PublishedRelease(release, profile.name, profile.slug)
                )
            )
            .sort(
                (first: PublishedRelease, second: PublishedRelease) =>
                    Date.parse(second.getRelease().getPublishedAt()) - Date.parse(first.getRelease().getPublishedAt())
            );
    }
}
