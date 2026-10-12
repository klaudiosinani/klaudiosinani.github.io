export class CheckRunDto {
    private readonly status: string;
    private readonly conclusion: string | null;

    public constructor(status: string, conclusion: string | null) {
        this.status = status;
        this.conclusion = conclusion;
    }

    public getStatus(): string {
        return this.status;
    }

    public getConclusion(): string | null {
        return this.conclusion;
    }

    public isCompleted(): boolean {
        return this.status === "completed";
    }

    public isSuccessful(): boolean {
        return this.conclusion === "success";
    }
}
