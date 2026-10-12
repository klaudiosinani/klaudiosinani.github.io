import type { PeriodMetricKey } from "@app/feature/impact/metric/PeriodMetricKey";
import type { IconComponent } from "@ui/icon/IconComponent";

export interface WindowedMetric {
    key: PeriodMetricKey;
    label: string;
    icon: IconComponent;
}
