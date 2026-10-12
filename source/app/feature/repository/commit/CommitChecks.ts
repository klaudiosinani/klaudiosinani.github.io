import type { CommitCheckConclusion } from "./CommitCheckConclusion";
export class CommitChecks {
    private readonly total: number;
    private readonly passed: number;
    private readonly conclusion: CommitCheckConclusion;

    public constructor(total: number, passed: number, conclusion: CommitCheckConclusion) {
        this.total = total;
        this.passed = passed;
        this.conclusion = conclusion;
    }

    public getTotal(): number {
        return this.total;
    }
    public getPassed(): number {
        return this.passed;
    }
    public getConclusion(): CommitCheckConclusion {
        return this.conclusion;
    }
}
