import type { PeriodMetricKey } from "@app/feature/impact/metric/PeriodMetricKey";
import CommitIcon from "@ui/component/icon/CommitIcon";
import type { ImpactFigure } from "./ImpactFigure";
import IssueIcon from "@ui/component/icon/IssueIcon";
import PullRequestIcon from "@ui/component/icon/PullRequestIcon";
import TagIcon from "@ui/component/icon/TagIcon";
import type { WindowedMetric } from "./WindowedMetric";

export class WindowedMetrics {
    public readonly ALL: readonly WindowedMetric[] = [
        { key: "commits", label: "commits created", icon: CommitIcon },
        { key: "releases", label: "releases shipped", icon: TagIcon },
        { key: "pullRequestsClosed", label: "PRs merged", icon: PullRequestIcon },
        { key: "pullRequestsOpened", label: "PRs created", icon: PullRequestIcon },
        { key: "issuesClosed", label: "issues closed", icon: IssueIcon },
        { key: "issuesOpened", label: "issues created", icon: IssueIcon },
    ];

    public readonly KEYS: readonly PeriodMetricKey[] = this.ALL.map(({ key }: WindowedMetric) => key);

    public reported(figures: Record<string, ImpactFigure>): readonly WindowedMetric[] {
        return this.ALL.filter(({ key }: WindowedMetric) => figures[key]);
    }
}

export const WINDOWED_METRICS: WindowedMetrics = new WindowedMetrics();
