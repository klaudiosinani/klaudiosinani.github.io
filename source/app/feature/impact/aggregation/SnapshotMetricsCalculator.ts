import type { OpenTotals } from "../metric/OpenTotals";
import type { CountedRepository } from "../metric/CountedRepository";
import { SnapshotMetrics } from "../metric/SnapshotMetrics";

export class SnapshotMetricsCalculator {
    public compute(repositories: readonly CountedRepository[], open: OpenTotals): SnapshotMetrics {
        return new SnapshotMetrics(
            open.getOpenPullRequests(),
            open.getOpenIssues(),
            repositories.length,
            repositories.reduce(
                (total: number, countedRepository: CountedRepository) => total + countedRepository.getStars(),
                0
            ),
            repositories.reduce(
                (total: number, countedRepository: CountedRepository) => total + countedRepository.getForks(),
                0
            )
        );
    }
}
