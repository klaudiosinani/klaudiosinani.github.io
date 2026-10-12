import type { WindowedMetric } from "./WindowedMetric";

export interface WindowedCluster {
    name: string;
    metrics: WindowedMetric[];
}
