/**
 * Reads the year out of the issue a feature was published in.
 *
 * The issues are written as the publisher writes them: "227/2019" for a
 * magazine, "08/2018" for a site that numbers by month. The year is the part
 * that means the same in all of them, and it is the part a reader weighs.
 */
export class PressIssueFormatter {
    private readonly YEAR: RegExp = /(\d{4})(?!.*\d{4})/;

    public year(issueNumber: string): number | null {
        const matched: RegExpExecArray | null = this.YEAR.exec(issueNumber);

        return matched ? Number(matched[1]) : null;
    }

    /** The year as a reader reads it, or nothing where the issue states none. */
    public format(issueNumber: string): string {
        const year: number | null = this.year(issueNumber);

        return year === null ? "" : String(year);
    }
}
