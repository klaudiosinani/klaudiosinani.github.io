import { MetricDelta } from "@app/feature/impact/change/MetricDelta";
import { Reach } from "@app/feature/reach/Reach";

export class ReachFixture {
    public create(dependentRepositories: number | null, views: number | null): Reach {
        return new Reach(
            474_691_029,
            15_344_148,
            138_219_642,
            new MetricDelta("+23%", "up", "on the 30 days before"),
            29_378,
            31,
            dependentRepositories,
            views,
            869
        );
    }
}
