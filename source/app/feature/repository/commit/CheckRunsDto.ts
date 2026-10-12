import type { CheckRunDto } from "./CheckRunDto";

export class CheckRunsDto {
    private readonly totalCount: number;
    private readonly checkRuns: readonly CheckRunDto[];

    public constructor(totalCount: number, checkRuns: readonly CheckRunDto[]) {
        this.totalCount = totalCount;
        this.checkRuns = checkRuns;
    }

    public getTotalCount(): number {
        return this.totalCount;
    }

    public getCheckRuns(): readonly CheckRunDto[] {
        return this.checkRuns;
    }
}
