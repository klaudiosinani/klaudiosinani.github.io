import { SnapcraftMetricsAnswerDto } from "./SnapcraftMetricsAnswerDto.ts";
import type { SnapcraftMetricsResultDto } from "./SnapcraftMetricsResultDto.ts";
import type { SnapcraftMetricsResultDtoAssembler } from "./SnapcraftMetricsResultDtoAssembler.ts";

export class SnapcraftMetricsAnswerDtoAssembler {
    private readonly snapcraftMetricsResultDtoAssembler: SnapcraftMetricsResultDtoAssembler;

    public constructor(snapcraftMetricsResultDtoAssembler: SnapcraftMetricsResultDtoAssembler) {
        this.snapcraftMetricsResultDtoAssembler = snapcraftMetricsResultDtoAssembler;
    }

    public assemble(payload: unknown): SnapcraftMetricsAnswerDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const metrics: unknown = record.metrics;
        const entries: unknown[] = Array.isArray(metrics) ? metrics : [];

        const snapcraftMetricsResultDtos: SnapcraftMetricsResultDto[] = entries.map((entry: unknown) =>
            this.snapcraftMetricsResultDtoAssembler.assemble(entry)
        );

        return new SnapcraftMetricsAnswerDto(snapcraftMetricsResultDtos);
    }
}
