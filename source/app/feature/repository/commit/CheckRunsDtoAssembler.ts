import type { CheckRunDto } from "./CheckRunDto";
import type { CheckRunDtoAssembler } from "./CheckRunDtoAssembler";
import { CheckRunsDto } from "./CheckRunsDto";

export class CheckRunsDtoAssembler {
    private readonly checkRunDtoAssembler: CheckRunDtoAssembler;

    public constructor(checkRunDtoAssembler: CheckRunDtoAssembler) {
        this.checkRunDtoAssembler = checkRunDtoAssembler;
    }

    public assemble(payload: unknown): CheckRunsDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const checkRuns: unknown = record.check_runs;
        const entries: unknown[] = Array.isArray(checkRuns) ? checkRuns : [];

        const checkRunDtos: CheckRunDto[] = entries.map((entry: unknown) => this.checkRunDtoAssembler.assemble(entry));

        return new CheckRunsDto(typeof record.total_count === "number" ? record.total_count : 0, checkRunDtos);
    }
}
