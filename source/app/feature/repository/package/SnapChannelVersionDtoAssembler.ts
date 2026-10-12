import { SnapChannelVersionDto } from "./SnapChannelVersionDto";

export class SnapChannelVersionDtoAssembler {
    public assemble(payload: unknown): SnapChannelVersionDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const channel: Record<string, unknown> = (record.channel ?? {}) as Record<string, unknown>;

        return new SnapChannelVersionDto(
            typeof channel.name === "string" ? channel.name : "",
            typeof record.version === "string" ? record.version : ""
        );
    }
}
