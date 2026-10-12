import type { ReleaseTotals } from "./ReleaseTotals";

export interface ReleaseTotalsSource {
    releases(username: string, repositories: string[]): Promise<ReleaseTotals>;
}
