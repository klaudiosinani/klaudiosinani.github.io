import type { PeriodMetricKey } from "@app/feature/impact/metric/PeriodMetricKey";
import type { MetricDelta } from "./MetricDelta";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export type PeriodDeltas = Record<ReportingPeriod, Partial<Record<PeriodMetricKey, MetricDelta | null>>>;
