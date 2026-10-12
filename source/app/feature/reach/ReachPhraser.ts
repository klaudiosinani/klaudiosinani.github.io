import type { MetricDelta } from "@app/feature/impact/change/MetricDelta";
import type { MetricDeltaPhraser } from "@app/feature/impact/change/MetricDeltaPhraser";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { Reach } from "./Reach";
import type { ReachConfiguration } from "./ReachConfiguration";

export class ReachPhraser {
    private readonly numberFormatter: NumberFormatter;
    private readonly metricDeltaPhraser: MetricDeltaPhraser;
    private readonly reachConfiguration: ReachConfiguration;

    public constructor(
        numberFormatter: NumberFormatter,
        metricDeltaPhraser: MetricDeltaPhraser,
        reachConfiguration: ReachConfiguration
    ) {
        this.numberFormatter = numberFormatter;
        this.metricDeltaPhraser = metricDeltaPhraser;
        this.reachConfiguration = reachConfiguration;
    }

    public allTime(reach: Reach): string {
        return `${this.numberFormatter.exact(reach.getDownloadsAllTime())} downloads since ${this.reachConfiguration.getRecordStartYear()}`;
    }

    public lastMonth(reach: Reach): string {
        const sentence: string = `${this.numberFormatter.exact(reach.getDownloadsLastMonth())} downloads in 30 days`;
        const monthChange: MetricDelta | null = reach.getMonthChange();

        return monthChange ? `${sentence}, ${this.metricDeltaPhraser.phrase(monthChange)}` : sentence;
    }

    public stars(reach: Reach): string {
        return `${this.numberFormatter.exact(reach.getStars())} stars across ${reach.getRepositories()} repositories`;
    }

    public dependents(reach: Reach): string | null {
        const dependentRepositories: number | null = reach.getDependentRepositories();

        if (dependentRepositories === null) {
            return null;
        }

        return `${this.numberFormatter.exact(dependentRepositories)} repositories depend on my projects`;
    }

    public dependentsMeaning(): string {
        return "repositories that depend on my projects";
    }

    public views(reach: Reach): string | null {
        const views: number | null = reach.getViews();

        if (views === null || views === 0) {
            return null;
        }

        return `${this.numberFormatter.exact(views)} repository views in 14 days`;
    }
}
