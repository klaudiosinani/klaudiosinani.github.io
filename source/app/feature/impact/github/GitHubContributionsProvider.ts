import type { BuildClock } from "../../../util/datetime/BuildClock.ts";
import type { ReportingWindow } from "@app/util/period/ReportingWindow";
import type { ReportingWindowCalculator } from "@app/util/period/ReportingWindowCalculator";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { GithubApiService } from "@app/infrastructure/api/github/common/GithubApiService";
import type { SignaleLogger } from "@app/infrastructure/log/SignaleLogger";
import type { SignaleLoggerFactory } from "@app/infrastructure/log/SignaleLoggerFactory";
import type { ContributionSource } from "./ContributionSource";
import { ContributionDay } from "@app/feature/impact/github/ContributionDay";
import { ContributionTotals } from "./ContributionTotals";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

interface CalendarDay {
    contributionCount: number;
    date: string;
}

interface Collection {
    totalCommitContributions: number;
    restrictedContributionsCount: number;
    contributionCalendar: {
        weeks: { contributionDays: CalendarDay[] }[];
    };
}

export class GitHubContributionsProvider implements ContributionSource {
    private readonly optionalReader: OptionalReader;
    private readonly DAY: number = 24 * 60 * 60 * 1000;
    private readonly YEAR: number = 365 * this.DAY;

    private readonly today: Date;
    private readonly githubApiService: GithubApiService;
    private readonly signaleLogger: SignaleLogger;

    private readonly reportingWindowCalculator: ReportingWindowCalculator;
    public constructor(
        buildClock: BuildClock,
        githubApiService: GithubApiService,
        optionalReaderFactory: OptionalReaderFactory,
        signaleLoggerFactory: SignaleLoggerFactory,
        reportingWindowCalculator: ReportingWindowCalculator
    ) {
        this.today = buildClock.now();
        this.githubApiService = githubApiService;
        this.optionalReader = optionalReaderFactory.create("GitHub");
        this.signaleLogger = signaleLoggerFactory.create("GitHub");
        this.reportingWindowCalculator = reportingWindowCalculator;
    }

    public async contributions(username: string, period: ReportingPeriod): Promise<ContributionTotals | null> {
        if (!this.token()) {
            return null;
        }

        if (period === "all") {
            return this.sinceJoining(username);
        }

        const reportingWindow: ReportingWindow = this.reportingWindowCalculator.compute(period, 0, this.today);

        return this.between(username, reportingWindow.getStart(), this.today);
    }

    private async sinceJoining(username: string): Promise<ContributionTotals | null> {
        const createdAt: Date | null = await this.joined(username);

        if (createdAt === null) {
            return null;
        }

        let commits: number = 0;
        let activeDays: number = 0;
        const days: ContributionDay[] = [];
        let from: Date = createdAt;

        while (from < this.today) {
            const to: Date = new Date(Math.min(from.getTime() + this.YEAR, this.today.getTime()));
            const counted: ContributionTotals | null = await this.between(username, from, to);

            commits += counted?.getCommits() ?? 0;
            activeDays += counted?.getActiveDays() ?? 0;
            days.push(...(counted?.getDays() ?? []));
            from = new Date(to.getTime() + this.DAY);
        }

        return new ContributionTotals(commits, activeDays, days);
    }

    private async between(username: string, from: Date, to: Date): Promise<ContributionTotals | null> {
        const body: {
            user: { contributionsCollection: Collection } | null;
        } | null = await this.query<{
            user: { contributionsCollection: Collection } | null;
        }>(
            `query($login:String!,$from:DateTime!,$to:DateTime!){
         user(login:$login){
           contributionsCollection(from:$from,to:$to){
             totalCommitContributions
             restrictedContributionsCount
             contributionCalendar {
               weeks { contributionDays { contributionCount date } }
             }
           }
         }
       }`,
            { login: username, from: from.toISOString(), to: to.toISOString() }
        );

        const collection: Collection | undefined = body?.user?.contributionsCollection;

        if (!collection) {
            return null;
        }

        const days: CalendarDay[] = (collection.contributionCalendar?.weeks ?? []).flatMap(
            (week: { contributionDays: CalendarDay[] }) => week.contributionDays
        );

        return new ContributionTotals(
            collection.totalCommitContributions + collection.restrictedContributionsCount,
            days.filter((day: CalendarDay) => day.contributionCount > 0).length,
            days.map((day: CalendarDay): ContributionDay => new ContributionDay(day.date, day.contributionCount))
        );
    }

    private async joined(username: string): Promise<Date | null> {
        const body: { user: { createdAt: string } | null } | null = await this.query<{
            user: { createdAt: string } | null;
        }>(`query($login:String!){user(login:$login){createdAt}}`, {
            login: username,
        });

        return body?.user?.createdAt ? new Date(body.user.createdAt) : null;
    }

    private async query<T>(query: string, variables: Record<string, string>): Promise<T | null> {
        const body: { data?: T; errors?: unknown[] } | null = await this.optionalReader.read<{
            data?: T;
            errors?: unknown[];
        }>("the contributions query", () =>
            this.githubApiService.postResource<
                { data?: T; errors?: unknown[] },
                { query: string; variables: Record<string, string> }
            >("graphql", { query, variables }, { Authorization: `Bearer ${this.token()}` })
        );

        if (body?.errors?.length) {
            this.signaleLogger.warn("The contributions query answered with errors");
            return null;
        }

        return body?.data ?? null;
    }

    private token(): string | undefined {
        return import.meta.env.GITHUB_CONTRIBUTIONS_TOKEN;
    }
}
