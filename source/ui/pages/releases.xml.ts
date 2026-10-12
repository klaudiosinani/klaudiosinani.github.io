import rss from "@astrojs/rss";
import type { PublishedRelease } from "@app/feature/repository/release/PublishedRelease";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import { SITE } from "@app/configuration/site/Site";

import { CONTEXT } from "@app/ApplicationContext.ts";
import { ProfileCollectionService } from "@app/feature/repository/profile/ProfileCollectionService.ts";
import { ReleaseHistoryFactory } from "@app/feature/repository/release/ReleaseHistoryFactory.ts";
import { ReleaseSummaryFormatter } from "@app/feature/repository/release/ReleaseSummaryFormatter.ts";

const PROFILE_COLLECTION_SERVICE: ProfileCollectionService = CONTEXT.resolve(ProfileCollectionService);
const RELEASE_HISTORY_FACTORY: ReleaseHistoryFactory = CONTEXT.resolve(ReleaseHistoryFactory);
const RELEASE_SUMMARY_FORMATTER: ReleaseSummaryFormatter = CONTEXT.resolve(ReleaseSummaryFormatter);

const SUMMARY: number = 300;

export async function GET(): Promise<Response> {
    const profiles: RepositoryProfile[] = await PROFILE_COLLECTION_SERVICE.retrieve();

    return rss({
        title: `Releases - ${SITE.getTitle()}`,
        description: `Every release of every open source project of ${SITE.getAuthor()}.`,
        site: SITE.getWebsite(),
        items: RELEASE_HISTORY_FACTORY.create(profiles).map((publishedRelease: PublishedRelease) => ({
            link: `${publishedRelease.getSlug()}/releases/`,
            title: `${publishedRelease.getProject()} ${publishedRelease.getRelease().getTag()}`,
            description:
                RELEASE_SUMMARY_FORMATTER.format(publishedRelease.getRelease().getNotes(), SUMMARY) ||
                `${publishedRelease.getProject()} ${publishedRelease.getRelease().getTag()}`,
            pubDate: new Date(publishedRelease.getRelease().getPublishedAt()),
        })),
    });
}
