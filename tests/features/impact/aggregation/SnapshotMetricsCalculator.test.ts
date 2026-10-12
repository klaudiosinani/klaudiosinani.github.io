import { describe, expect, it } from "vitest";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import { SnapshotMetricsCalculator } from "@app/feature/impact/aggregation/SnapshotMetricsCalculator";

import type { SnapshotMetrics } from "@app/feature/impact/SnapshotMetrics";
const underTest: typeof SnapshotMetricsCalculator = SnapshotMetricsCalculator;

const repositories: RepositoryData[] = [
    { name: "one", stars: 100, forks: 10 },
    { name: "two", stars: 25, forks: 3 },
] as unknown as RepositoryData[];

describe("SnapshotMetricsCalculator.compute", () => {
    it("givenSeveralRepositories_whenAdding_thenTheStarsAndForksAreCombined", () => {
        const snapshot: SnapshotMetrics = underTest.compute(repositories, {
            openPullRequests: 4,
            openIssues: 9,
        });

        expect(snapshot).toEqual({
            openPullRequests: 4,
            openIssues: 9,
            projects: 2,
            stars: 125,
            forks: 13,
        });
    });

    it("givenNoRepository_whenAdding_thenEveryTotalIsZero", () => {
        const snapshot: SnapshotMetrics = underTest.compute([], {
            openPullRequests: 0,
            openIssues: 0,
        });

        expect(snapshot.projects).toBe(0);
        expect(snapshot.stars).toBe(0);
        expect(snapshot.forks).toBe(0);
    });
});
