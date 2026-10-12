import type { BuildClock } from "../../../util/datetime/BuildClock.ts";
import type { ReportingWindow } from "@app/util/period/ReportingWindow";
import type { GithubSearchEndpointAssembler } from "@app/infrastructure/api/github/search/GithubSearchEndpointAssembler";
import type { ReportingWindowCalculator } from "@app/util/period/ReportingWindowCalculator";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { GithubApiService } from "@app/infrastructure/api/github/common/GithubApiService";
import type { IssueSearchSource } from "./IssueSearchSource";
import { IssueTotals } from "./IssueTotals";
import { OpenTotals } from "../metric/OpenTotals";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class GitHubSearchProvider implements IssueSearchSource {
    private readonly optionalReader: OptionalReader;
    private readonly today: Date;
    private readonly githubApiService: GithubApiService;

    private readonly reportingWindowCalculator: ReportingWindowCalculator;
    private readonly githubSearchEndpointAssembler: GithubSearchEndpointAssembler;
    public constructor(
        buildClock: BuildClock,
        githubApiService: GithubApiService,
        optionalReaderFactory: OptionalReaderFactory,
        reportingWindowCalculator: ReportingWindowCalculator,
        githubSearchEndpointAssembler: GithubSearchEndpointAssembler
    ) {
        this.today = buildClock.now();
        this.githubApiService = githubApiService;
        this.optionalReader = optionalReaderFactory.create("GitHub");
        this.reportingWindowCalculator = reportingWindowCalculator;
        this.githubSearchEndpointAssembler = githubSearchEndpointAssembler;
    }

    public async contributions(username: string, period: ReportingPeriod, windowsBack: number): Promise<IssueTotals> {
        const scope: string = `user:${username}`;

        const [commits, pullRequestsOpened, pullRequestsClosed, issuesOpened, issuesClosed] = await Promise.all([
            this.count(`author:${username} ${scope}${this.range("author-date", period, windowsBack)}`, "commits"),
            this.count(`is:pr ${scope}${this.range("created", period, windowsBack)}`, "issues"),
            this.count(`is:pr is:closed ${scope}${this.range("closed", period, windowsBack)}`, "issues"),
            this.count(`is:issue ${scope}${this.range("created", period, windowsBack)}`, "issues"),
            this.count(`is:issue is:closed ${scope}${this.range("closed", period, windowsBack)}`, "issues"),
        ]);

        return new IssueTotals(commits, pullRequestsOpened, pullRequestsClosed, issuesOpened, issuesClosed);
    }

    public async open(username: string): Promise<OpenTotals> {
        const scope: string = `user:${username}`;

        const [openPullRequests, openIssues] = await Promise.all([
            this.count(`is:pr is:open ${scope}`, "issues"),
            this.count(`is:issue is:open ${scope}`, "issues"),
        ]);

        return new OpenTotals(openPullRequests, openIssues);
    }

    private range(field: string, period: ReportingPeriod, windowsBack: number): string {
        if (period === "all") {
            return "";
        }

        const reportingWindow: ReportingWindow = this.reportingWindowCalculator.compute(
            period,
            windowsBack,
            this.today
        );

        if (windowsBack === 0) {
            return ` ${field}:>=${this.day(reportingWindow.getStart())}`;
        }

        return ` ${field}:${this.day(reportingWindow.getStart())}..${this.day(reportingWindow.getEnd())}`;
    }

    private day(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    private async count(query: string, index: "issues" | "commits"): Promise<number> {
        const body: { total_count: number } | null = await this.optionalReader.read<{
            total_count: number;
        }>(`the count of ${index}`, () =>
            this.githubApiService.getResource(
                index === "commits"
                    ? this.githubSearchEndpointAssembler.assembleCommits()
                    : this.githubSearchEndpointAssembler.assembleIssues(),
                { per_page: 1, q: query },
                {}
            )
        );

        return body?.total_count ?? 0;
    }
}
