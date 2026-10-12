import { CountedDto } from "./CountedDto";

export class CountedDtoAssembler {
    public assemble(payload: unknown): CountedDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const totalCount: unknown = record.totalCount;

        return new CountedDto(typeof totalCount === "number" ? totalCount : 0);
    }
}
