import CloneIcon from "@ui/component/icon/CloneIcon";
import CommitIcon from "@ui/component/icon/CommitIcon";
import ForkIcon from "@ui/component/icon/ForkIcon";
import IssueIcon from "@ui/component/icon/IssueIcon";
import PeopleIcon from "@ui/component/icon/PeopleIcon";
import PullRequestIcon from "@ui/component/icon/PullRequestIcon";
import { DraftedCluster } from "./DraftedCluster";
import { RepositoryFigure } from "./RepositoryFigure";
import { RepositoryFigureCluster } from "./RepositoryFigureCluster";
import type { RepositoryProfile } from "../profile/RepositoryProfile";
import StarIcon from "@ui/component/icon/StarIcon";
import TagIcon from "@ui/component/icon/TagIcon";

export class RepositoryFigureClusterFactory {
    public create(profile: RepositoryProfile): RepositoryFigureCluster[] {
        const { totals } = profile;

        return [
            new DraftedCluster("Community", [
                new RepositoryFigure(StarIcon, profile.stars, "stars", undefined),
                new RepositoryFigure(ForkIcon, profile.forks, "forks", undefined),
                profile.contributors !== null &&
                    new RepositoryFigure(PeopleIcon, profile.contributors, "contributors", undefined),
            ]),
            new DraftedCluster("Adoption", [
                profile.clones !== null &&
                    new RepositoryFigure(
                        CloneIcon,
                        profile.clones,
                        "git clones",
                        "Clones over the last 14 days, which is every day GitHub keeps"
                    ),
            ]),
            new DraftedCluster("Delivery", [
                new RepositoryFigure(CommitIcon, totals?.getCommits() ?? null, "commits", undefined),
                new RepositoryFigure(TagIcon, profile.releases.length, "releases", undefined),
            ]),
            new DraftedCluster("Review", [
                new RepositoryFigure(PullRequestIcon, totals?.getMergedPullRequests() ?? null, "PRs merged", undefined),
                new RepositoryFigure(
                    PullRequestIcon,
                    totals?.getOpenPullRequests() ?? null,
                    "open PRs",
                    "Pull requests open right now"
                ),
            ]),
            new DraftedCluster("Issues", [
                new RepositoryFigure(IssueIcon, totals?.getClosedIssues() ?? null, "issues closed", undefined),
                new RepositoryFigure(
                    IssueIcon,
                    totals?.getOpenIssues() ?? null,
                    "open issues",
                    "Issues open right now"
                ),
            ]),
        ]
            .map(
                (draftedCluster: DraftedCluster) =>
                    new RepositoryFigureCluster(draftedCluster.getName(), draftedCluster.readFigures())
            )
            .filter((cluster: RepositoryFigureCluster) => cluster.getFigures().length > 0);
    }
}
