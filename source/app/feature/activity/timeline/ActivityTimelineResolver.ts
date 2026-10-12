import type { CommitShaFormatter } from "@app/util/text/CommitShaFormatter";
import type { ActivityData } from "@app/feature/activity/data/ActivityData";
import type { CommitData } from "@app/feature/activity/data/CommitData";
import type { ReleaseData } from "@app/feature/activity/data/ReleaseData";
import { ActivityEntry } from "./ActivityEntry";

export class ActivityTimelineResolver {
    private readonly commitShaFormatter: CommitShaFormatter;

    public constructor(commitShaFormatter: CommitShaFormatter) {
        this.commitShaFormatter = commitShaFormatter;
    }
    public resolve(activityData: ActivityData, limitPerKind: number): ActivityEntry[] {
        return [
            ...activityData
                .getReleases()
                .slice(0, limitPerKind)
                .map((release: ReleaseData) => this.release(release)),
            ...activityData
                .getCommits()
                .slice(0, limitPerKind)
                .map((commit: CommitData) => this.commit(commit)),
        ].sort(
            (first: ActivityEntry, second: ActivityEntry) =>
                Date.parse(second.getOccurredAt()) - Date.parse(first.getOccurredAt())
        );
    }

    private release(releaseData: ReleaseData): ActivityEntry {
        return new ActivityEntry(
            "release",
            releaseData.getRepository(),
            releaseData.getTag(),
            "Released",
            releaseData.getUrl(),
            releaseData.getPublishedAt()
        );
    }

    private commit(commitData: CommitData): ActivityEntry {
        return new ActivityEntry(
            "commit",
            commitData.getMessage(),
            this.commitShaFormatter.format(commitData.getSha()),
            commitData.getRepository(),
            commitData.getUrl(),
            commitData.getCommittedAt()
        );
    }
}
