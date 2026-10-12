import { describe, expect, it } from "vitest";
import { ActivityTimelineResolver } from "@app/feature/activity/service/ActivityTimelineResolver";
import type { ActivityData } from "@app/feature/activity/service/ActivityData";

import type { ActivityEntry } from "@app/feature/activity/ActivityEntry";
const underTest: typeof ActivityTimelineResolver = ActivityTimelineResolver;

const release = (tag: string, publishedAt: string) => ({
    repository: "singlie",
    tag,
    name: tag,
    url: `https://github.com/klaudiosinani/singlie/releases/tag/${tag}`,
    publishedAt,
});

const commit = (sha: string, committedAt: string) => ({
    repository: "qoa",
    sha,
    message: `Fix ${sha}`,
    url: `https://github.com/klaudiosinani/qoa/commit/${sha}`,
    committedAt,
});

const activity = (data: Partial<ActivityData> = {}): ActivityData => ({
    commits: [],
    releases: [],
    ...data,
});

describe("ActivityTimelineResolver.resolve", () => {
    it("givenCommitsAndReleases_whenResolvingTheTimeline_thenEntriesAreOrderedNewestFirst", () => {
        const data: ActivityData = activity({
            releases: [release("v2.0.0", "2026-08-01T00:00:00Z")],
            commits: [commit("aaaaaaaaaa", "2026-08-05T00:00:00Z"), commit("bbbbbbbbbb", "2026-07-01T00:00:00Z")],
        });

        const entries: ActivityEntry[] = underTest.resolve(data, 3);

        expect(entries.map(({ occurredAt }: ActivityEntry) => occurredAt)).toEqual([
            "2026-08-05T00:00:00Z",
            "2026-08-01T00:00:00Z",
            "2026-07-01T00:00:00Z",
        ]);
    });

    it("givenMoreEntriesThanTheLimit_whenResolvingTheTimeline_thenEachKindIsCappedIndependently", () => {
        const data: ActivityData = activity({
            releases: [
                release("v3.0.0", "2026-08-09T00:00:00Z"),
                release("v2.0.0", "2026-08-08T00:00:00Z"),
                release("v1.0.0", "2026-08-07T00:00:00Z"),
            ],
            commits: [commit("aaaaaaaaaa", "2026-08-06T00:00:00Z"), commit("bbbbbbbbbb", "2026-08-05T00:00:00Z")],
        });

        const entries: ActivityEntry[] = underTest.resolve(data, 1);

        expect(entries).toHaveLength(2);
        expect(entries.map(({ kind }: ActivityEntry) => kind)).toEqual(["release", "commit"]);
    });

    it("givenARelease_whenResolvingTheTimeline_thenTheRepositoryLeadsAndTheTagIsTheReference", () => {
        const data: ActivityData = activity({
            releases: [release("v1.0.1", "2026-08-08T00:00:00Z")],
        });

        const [entry] = underTest.resolve(data, 3);

        expect(entry).toEqual({
            kind: "release",
            title: "singlie",
            reference: "v1.0.1",
            context: "Released",
            url: "https://github.com/klaudiosinani/singlie/releases/tag/v1.0.1",
            occurredAt: "2026-08-08T00:00:00Z",
        });
    });

    it("givenACommit_whenResolvingTheTimeline_thenTheMessageLeadsAndTheShaIsShortened", () => {
        const data: ActivityData = activity({
            commits: [commit("336b4fe1234567", "2026-08-07T00:00:00Z")],
        });

        const [entry] = underTest.resolve(data, 3);

        expect(entry).toEqual({
            kind: "commit",
            title: "Fix 336b4fe1234567",
            reference: "336b4fe",
            context: "qoa",
            url: "https://github.com/klaudiosinani/qoa/commit/336b4fe1234567",
            occurredAt: "2026-08-07T00:00:00Z",
        });
    });

    it("givenNoActivity_whenResolvingTheTimeline_thenTheTimelineIsEmpty", () => {
        const data: ActivityData = activity();

        const entries: ActivityEntry[] = underTest.resolve(data, 3);

        expect(entries).toEqual([]);
    });
});
