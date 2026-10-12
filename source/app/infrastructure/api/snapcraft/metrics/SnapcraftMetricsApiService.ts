import type { SnapcraftApiService } from "../common/SnapcraftApiService.ts";
import type { SnapcraftStoreCredential } from "../common/SnapcraftStoreCredential.ts";
import type { SnapcraftInstallsCalculator } from "./SnapcraftInstallsCalculator.ts";
import type { SnapcraftMetricsAnswerDto } from "./response/SnapcraftMetricsAnswerDto.ts";
import type { SnapcraftMetricsAnswerDtoAssembler } from "./response/SnapcraftMetricsAnswerDtoAssembler.ts";
import type { SnapcraftMetricsRequestDto } from "./request/SnapcraftMetricsRequestDto.ts";
import type { SnapcraftMetricsRequestDtoFactory } from "./request/SnapcraftMetricsRequestDtoFactory.ts";
import type { SnapcraftMetricsResultDto } from "./response/SnapcraftMetricsResultDto.ts";

export class SnapcraftMetricsApiService {
    private readonly ENDPOINT: string = "snaps/metrics";

    private readonly snapcraftApiService: SnapcraftApiService;
    private readonly snapcraftStoreCredential: SnapcraftStoreCredential;
    private readonly snapcraftMetricsRequestDtoFactory: SnapcraftMetricsRequestDtoFactory;
    private readonly snapcraftInstallsCalculator: SnapcraftInstallsCalculator;
    private readonly snapcraftMetricsAnswerDtoAssembler: SnapcraftMetricsAnswerDtoAssembler;

    public constructor(
        snapcraftApiService: SnapcraftApiService,
        snapcraftStoreCredential: SnapcraftStoreCredential,
        snapcraftMetricsRequestDtoFactory: SnapcraftMetricsRequestDtoFactory,
        snapcraftInstallsCalculator: SnapcraftInstallsCalculator,
        snapcraftMetricsAnswerDtoAssembler: SnapcraftMetricsAnswerDtoAssembler
    ) {
        this.snapcraftApiService = snapcraftApiService;
        this.snapcraftStoreCredential = snapcraftStoreCredential;
        this.snapcraftMetricsRequestDtoFactory = snapcraftMetricsRequestDtoFactory;
        this.snapcraftInstallsCalculator = snapcraftInstallsCalculator;
        this.snapcraftMetricsAnswerDtoAssembler = snapcraftMetricsAnswerDtoAssembler;
    }

    public async getInstallsBySnap(snapIds: Record<string, string>, today: Date): Promise<Map<string, number>> {
        const installsBySnap: Map<string, number> = new Map<string, number>();

        if (!this.snapcraftStoreCredential.exists()) {
            return installsBySnap;
        }

        const identifiers: string[] = Object.values(snapIds);

        if (identifiers.length === 0) {
            return installsBySnap;
        }

        const request: SnapcraftMetricsRequestDto = this.snapcraftMetricsRequestDtoFactory.create(identifiers, today);

        const payload: unknown = await this.snapcraftApiService.postResource<unknown, SnapcraftMetricsRequestDto>(
            this.ENDPOINT,
            request,
            {}
        );

        const answer: SnapcraftMetricsAnswerDto = this.snapcraftMetricsAnswerDtoAssembler.assemble(payload);

        answer.getMetrics().forEach((result: SnapcraftMetricsResultDto) => {
            const name: string | undefined = this.resolveName(snapIds, result.getSnapId());

            if (name !== undefined) {
                installsBySnap.set(name, this.snapcraftInstallsCalculator.calculate(result));
            }
        });

        return installsBySnap;
    }

    private resolveName(snapIds: Record<string, string>, snapId: string): string | undefined {
        return Object.keys(snapIds).find((name: string) => snapIds[name] === snapId);
    }
}
