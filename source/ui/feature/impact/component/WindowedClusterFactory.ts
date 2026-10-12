import type { PeriodMetricKey } from "@app/feature/impact/metric/PeriodMetricKey";
import type { ImpactFigure } from "./ImpactFigure";
import type { WindowedCluster } from "./WindowedCluster";
import { WINDOWED_METRICS } from "@ui/feature/impact/component/WindowedMetrics";

import type { WindowedMetric } from "@ui/feature/impact/component/WindowedMetric";
export class WindowedClusterFactory {
    private readonly GROUPS: readonly {
        name: string;
        keys: readonly PeriodMetricKey[];
    }[] = [
        { name: "Delivery", keys: ["commits", "releases"] },
        { name: "Review", keys: ["pullRequestsClosed", "pullRequestsOpened"] },
        { name: "Issues", keys: ["issuesClosed", "issuesOpened"] },
    ];

    public create(figures: Record<string, ImpactFigure>): WindowedCluster[] {
        const reported: readonly WindowedMetric[] = WINDOWED_METRICS.reported(figures);

        return this.GROUPS.map(({ name, keys }: { name: string; keys: readonly PeriodMetricKey[] }) => ({
            name,
            metrics: reported.filter(({ key }: WindowedMetric) => keys.includes(key)),
        })).filter(({ metrics }: WindowedCluster) => metrics.length > 0);
    }
}

export const WINDOWED_CLUSTER_FACTORY: WindowedClusterFactory = new WindowedClusterFactory();
