import type { CommitCheckConclusion } from "@app/feature/repository/commit/CommitCheckConclusion";
import type { CommitChecks } from "./CommitChecks";

export class CommitChecksFormatter {
    private readonly VERDICTS: Readonly<Record<CommitCheckConclusion, string>> = {
        success: "Checks passed",
        failure: "Checks failed",
        running: "Checks running",
        neutral: "Checks finished",
    };

    public verdict(checks: CommitChecks): string {
        return this.VERDICTS[checks.getConclusion()];
    }

    public format(checks: CommitChecks): string {
        return `${this.verdict(checks)} ${checks.getPassed()}/${checks.getTotal()}`;
    }
}
