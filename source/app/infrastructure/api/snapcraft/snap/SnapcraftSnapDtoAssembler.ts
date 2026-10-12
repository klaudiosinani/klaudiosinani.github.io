import { SnapcraftSnapDto } from "./SnapcraftSnapDto.ts";

export class SnapcraftSnapDtoAssembler {
    public assemble(payload: unknown): SnapcraftSnapDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const name: unknown = record.name;
        const snapId: unknown = record["snap-id"];

        return new SnapcraftSnapDto(typeof name === "string" ? name : "", typeof snapId === "string" ? snapId : "");
    }
}
