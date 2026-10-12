import type { ReleaseSlugFormatter } from "@app/feature/repository/release/ReleaseSlugFormatter";
import type { RepositoryRelease } from "./RepositoryRelease";

export class PublishedReleaseResolver {
    private readonly releaseSlugFormatter: ReleaseSlugFormatter;
    private readonly NOTES: number = 200;

    public constructor(releaseSlugFormatter: ReleaseSlugFormatter) {
        this.releaseSlugFormatter = releaseSlugFormatter;
    }

    public resolve(releases: readonly RepositoryRelease[]): RepositoryRelease[] {
        return releases.filter(
            (release: RepositoryRelease) =>
                release.getNotes().trim().length >= this.NOTES &&
                !this.releaseSlugFormatter.isReserved(release.getTag())
        );
    }

    public publishes(release: RepositoryRelease): boolean {
        return this.resolve([release]).length > 0;
    }
}
