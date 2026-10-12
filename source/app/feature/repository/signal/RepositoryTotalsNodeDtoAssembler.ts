import type { CountedDto } from "../download/CountedDto";
import type { CountedDtoAssembler } from "../download/CountedDtoAssembler";
import { RepositoryTotalsNodeDto } from "./RepositoryTotalsNodeDto";

export class RepositoryTotalsNodeDtoAssembler {
    private readonly countedDtoAssembler: CountedDtoAssembler;

    public constructor(countedDtoAssembler: CountedDtoAssembler) {
        this.countedDtoAssembler = countedDtoAssembler;
    }

    public assemble(payload: unknown): RepositoryTotalsNodeDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const commits: Record<string, unknown> = (record.commits ?? {}) as Record<string, unknown>;
        const target: Record<string, unknown> = (commits.target ?? {}) as Record<string, unknown>;

        return new RepositoryTotalsNodeDto(
            this.countedDtoAssembler.assemble(target.history),
            this.counted(record.openIssues),
            this.counted(record.closedIssues),
            this.counted(record.openPullRequests),
            this.counted(record.mergedPullRequests)
        );
    }

    private counted(value: unknown): CountedDto {
        return this.countedDtoAssembler.assemble(value);
    }
}
