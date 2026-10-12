import { RepositoryTotals } from "./RepositoryTotals";
import type { RepositoryTotalsNodeDto } from "./RepositoryTotalsNodeDto";

export class RepositoryTotalsQuery {
    private readonly FIELDS: string = `commits: defaultBranchRef { target { ... on Commit { history { totalCount } } } }
        openIssues: issues(states: OPEN) { totalCount }
        closedIssues: issues(states: CLOSED) { totalCount }
        openPullRequests: pullRequests(states: OPEN) { totalCount }
        mergedPullRequests: pullRequests(states: MERGED) { totalCount }`;

    public document(username: string, slugs: readonly string[]): string {
        const selections: string = slugs
            .map(
                (slug: string, index: number) =>
                    `r${index}: repository(owner: ${JSON.stringify(
                        username
                    )}, name: ${JSON.stringify(slug)}) { ${this.FIELDS} }`
            )
            .join("\n");

        return `query { ${selections} }`;
    }

    public read(
        slugs: readonly string[],
        body: Record<string, RepositoryTotalsNodeDto | null>
    ): Map<string, RepositoryTotals> {
        return new Map(
            slugs
                .map((slug: string, index: number) => [slug, body[`r${index}`]] as const)
                .filter(
                    (
                        entry: readonly [string, RepositoryTotalsNodeDto | null]
                    ): entry is [string, RepositoryTotalsNodeDto] => Boolean(entry[1])
                )
                .map(([slug, node]: [string, RepositoryTotalsNodeDto]) => [slug, this.totals(node)])
        );
    }

    private totals(node: RepositoryTotalsNodeDto): RepositoryTotals {
        return new RepositoryTotals(
            node.getCommits().getTotalCount(),
            node.getOpenIssues().getTotalCount(),
            node.getClosedIssues().getTotalCount(),
            node.getOpenPullRequests().getTotalCount(),
            node.getMergedPullRequests().getTotalCount()
        );
    }
}
