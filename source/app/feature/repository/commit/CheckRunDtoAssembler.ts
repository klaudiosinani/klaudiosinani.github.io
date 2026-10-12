import { CheckRunDto } from "./CheckRunDto";

export class CheckRunDtoAssembler {
    public assemble(payload: unknown): CheckRunDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;

        return new CheckRunDto(
            typeof record.status === "string" ? record.status : "",
            typeof record.conclusion === "string" ? record.conclusion : null
        );
    }
}
