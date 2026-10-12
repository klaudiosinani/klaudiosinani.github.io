import type { PressIssueFormatter } from "@app/feature/press/coverage/PressIssueFormatter";
import type { FeaturedPress } from "./FeaturedPress";

/**
 * The shape of the coverage, in one sentence.
 *
 * Five cards state five features and nothing about the whole: how many
 * publishers wrote, about how many projects, and across how long. A band of
 * figures said it in tiles before, which weighed more than it was worth.
 */
export class PressCoverageFormatter {
    private readonly pressIssueFormatter: PressIssueFormatter;

    public constructor(pressIssueFormatter: PressIssueFormatter) {
        this.pressIssueFormatter = pressIssueFormatter;
    }
    public format(features: readonly FeaturedPress[]): string | null {
        if (features.length === 0) {
            return null;
        }

        const publishers: number = new Set(features.map(({ publisherName }: FeaturedPress) => publisherName)).size;
        const years: number[] = features
            .map(({ issueNumber }: FeaturedPress) => this.pressIssueFormatter.year(issueNumber))
            .filter((year: number | null): year is number => year !== null);

        const counted: string = `${features.length} ${
            features.length === 1 ? "feature" : "features"
        }, ${publishers} ${publishers === 1 ? "publisher" : "publishers"}`;

        if (years.length === 0) {
            return counted;
        }

        const first: number = Math.min(...years);
        const last: number = Math.max(...years);

        return first === last ? `${counted}, ${first}` : `${counted}, ${first} to ${last}`;
    }
}
