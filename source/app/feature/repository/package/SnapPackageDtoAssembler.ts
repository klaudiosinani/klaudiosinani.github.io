import type { SnapChannelVersionDto } from "./SnapChannelVersionDto";
import type { SnapChannelVersionDtoAssembler } from "./SnapChannelVersionDtoAssembler";
import { SnapPackageDto } from "./SnapPackageDto";

export class SnapPackageDtoAssembler {
    private readonly snapChannelVersionDtoAssembler: SnapChannelVersionDtoAssembler;

    public constructor(snapChannelVersionDtoAssembler: SnapChannelVersionDtoAssembler) {
        this.snapChannelVersionDtoAssembler = snapChannelVersionDtoAssembler;
    }

    public assemble(payload: unknown): SnapPackageDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const channelMap: unknown = record["channel-map"];
        const entries: unknown[] = Array.isArray(channelMap) ? channelMap : [];
        const snap: Record<string, unknown> = (record.snap ?? {}) as Record<string, unknown>;
        const publisher: Record<string, unknown> = (snap.publisher ?? {}) as Record<string, unknown>;

        const channelVersions: SnapChannelVersionDto[] = entries.map((entry: unknown) =>
            this.snapChannelVersionDtoAssembler.assemble(entry)
        );

        return new SnapPackageDto(channelVersions, typeof publisher.username === "string" ? publisher.username : null);
    }
}
