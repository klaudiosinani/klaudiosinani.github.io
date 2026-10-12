import type { ImpactData } from "@app/feature/impact/metric/ImpactData";
import type { SnapshotMetrics } from "@app/feature/impact/metric/SnapshotMetrics";
import type { TrafficMetrics } from "@app/feature/impact/metric/TrafficMetrics";
import CloneIcon from "@ui/component/icon/CloneIcon";
import { DependentIcon } from "@ui/component/icon/DependentIcon";
import DownloadIcon from "@ui/component/icon/DownloadIcon";
import { EyeIcon } from "@ui/component/icon/EyeIcon";
import ForkIcon from "@ui/component/icon/ForkIcon";
import IssueIcon from "@ui/component/icon/IssueIcon";
import PullRequestIcon from "@ui/component/icon/PullRequestIcon";
import RepositoryIcon from "@ui/component/icon/RepositoryIcon";
import StarIcon from "@ui/component/icon/StarIcon";
import type { DraftedCluster } from "./DraftedCluster";
import type { StandingCluster } from "./StandingCluster";
import type { StandingFigure } from "./StandingFigure";
import { TRAFFIC_YEAR_CALCULATOR, type TrafficYearCalculator } from "./TrafficYearCalculator";

export class StandingClusterFactory {
    private readonly trafficYearCalculator: TrafficYearCalculator;

    public constructor(trafficYearCalculator: TrafficYearCalculator) {
        this.trafficYearCalculator = trafficYearCalculator;
    }

    public create(impactData: ImpactData, dependentRepositories: number | null): StandingCluster[] {
        const snapshotMetrics: SnapshotMetrics = impactData.getSnapshot();
        const trafficMetrics: TrafficMetrics | null = impactData.getTraffic();
        const installedBase: number | null = impactData.getInstalledBase();
        const draftedClusters: DraftedCluster[] = [
            {
                name: "Community",
                figures: [
                    { icon: StarIcon, value: snapshotMetrics.getStars(), label: "stars" },
                    { icon: ForkIcon, value: snapshotMetrics.getForks(), label: "forks" },
                ],
            },
            {
                name: "Adoption",
                figures: [
                    { icon: DownloadIcon, value: impactData.getPeriods().all.getDownloads(), label: "downloads" },
                    dependentRepositories === null
                        ? null
                        : {
                              icon: DependentIcon,
                              value: dependentRepositories,
                              label: "dependent repositories",
                              title: "GitHub counts the repositories that depend on each project. This figure adds the counts of all projects.",
                          },
                    installedBase === null
                        ? null
                        : { icon: DownloadIcon, value: installedBase, label: "installations" },
                ],
            },
            {
                name: "GitHub Traffic",
                figures:
                    trafficMetrics === null
                        ? []
                        : [
                              {
                                  icon: EyeIcon,
                                  value: this.trafficYearCalculator.compute(trafficMetrics.getViews()),
                                  label: "visits",
                              },
                              {
                                  icon: CloneIcon,
                                  value: this.trafficYearCalculator.compute(trafficMetrics.getClones()),
                                  label: "clones",
                              },
                          ],
            },
            {
                name: "Maintenance",
                figures: [
                    { icon: RepositoryIcon, value: snapshotMetrics.getProjects(), label: "repositories" },
                    { icon: PullRequestIcon, value: snapshotMetrics.getOpenPullRequests(), label: "open PRs" },
                    { icon: IssueIcon, value: snapshotMetrics.getOpenIssues(), label: "open issues" },
                ],
            },
        ];

        return draftedClusters
            .map((draftedCluster: DraftedCluster): StandingCluster => ({
                name: draftedCluster.name,
                figures: draftedCluster.figures.filter(
                    (standingFigure: StandingFigure | null): standingFigure is StandingFigure => standingFigure !== null
                ),
            }))
            .filter((standingCluster: StandingCluster) => standingCluster.figures.length > 0);
    }
}

export const STANDING_CLUSTER_FACTORY: StandingClusterFactory = new StandingClusterFactory(TRAFFIC_YEAR_CALCULATOR);
