import type { NpmApiService } from "../common/NpmApiService.ts";
import type { NpmBulkDownloadRangeDto } from "./response/NpmBulkDownloadRangeDto.ts";
import type { NpmBulkDownloadRangeDtoAssembler } from "./response/NpmBulkDownloadRangeDtoAssembler.ts";
import type { NpmDownloadCount } from "./count/NpmDownloadCount.ts";
import type { NpmDownloadCountMapper } from "./count/NpmDownloadCountMapper.ts";
import type { NpmDownloadDateRange } from "./request/NpmDownloadDateRange.ts";
import type { NpmDownloadDto } from "./response/NpmDownloadDto.ts";
import type { NpmDownloadEndpointAssembler } from "./request/NpmDownloadEndpointAssembler.ts";
import type { NpmDownloadRangeDto } from "./response/NpmDownloadRangeDto.ts";
import type { NpmDownloadRangeDtoAssembler } from "./response/NpmDownloadRangeDtoAssembler.ts";

export class NpmDownloadApiService {
    private readonly npmApiService: NpmApiService;
    private readonly npmDownloadEndpointAssembler: NpmDownloadEndpointAssembler;
    private readonly npmDownloadCountMapper: NpmDownloadCountMapper;
    private readonly npmDownloadRangeDtoAssembler: NpmDownloadRangeDtoAssembler;
    private readonly npmBulkDownloadRangeDtoAssembler: NpmBulkDownloadRangeDtoAssembler;

    public constructor(
        npmApiService: NpmApiService,
        npmDownloadEndpointAssembler: NpmDownloadEndpointAssembler,
        npmDownloadCountMapper: NpmDownloadCountMapper,
        npmDownloadRangeDtoAssembler: NpmDownloadRangeDtoAssembler,
        npmBulkDownloadRangeDtoAssembler: NpmBulkDownloadRangeDtoAssembler
    ) {
        this.npmApiService = npmApiService;
        this.npmDownloadEndpointAssembler = npmDownloadEndpointAssembler;
        this.npmDownloadCountMapper = npmDownloadCountMapper;
        this.npmDownloadRangeDtoAssembler = npmDownloadRangeDtoAssembler;
        this.npmBulkDownloadRangeDtoAssembler = npmBulkDownloadRangeDtoAssembler;
    }

    public async getDownloadCounts(
        packageNames: string[],
        npmDownloadDateRange: NpmDownloadDateRange
    ): Promise<Map<string, NpmDownloadCount[]>> {
        const endpoint: string = this.npmDownloadEndpointAssembler.assemble(packageNames, npmDownloadDateRange);
        const payload: unknown = await this.npmApiService.getResource<unknown>(endpoint, {}, {});

        if (packageNames.length === 1) {
            return this.mapRange(this.npmDownloadRangeDtoAssembler.assemble(payload));
        }

        return this.mapBulk(this.npmBulkDownloadRangeDtoAssembler.assemble(payload));
    }

    private mapRange(npmDownloadRangeDto: NpmDownloadRangeDto): Map<string, NpmDownloadCount[]> {
        const packageName: string = npmDownloadRangeDto.getPackageName();
        const npmDownloadCounts: NpmDownloadCount[] = this.mapCounts(npmDownloadRangeDto);

        return new Map<string, NpmDownloadCount[]>([[packageName, npmDownloadCounts]]);
    }

    private mapBulk(npmBulkDownloadRangeDto: NpmBulkDownloadRangeDto): Map<string, NpmDownloadCount[]> {
        const npmDownloadCounts: Map<string, NpmDownloadCount[]> = new Map<string, NpmDownloadCount[]>();

        for (const [packageName, npmDownloadRangeDto] of npmBulkDownloadRangeDto.getRangesByPackageName()) {
            const packageCounts: NpmDownloadCount[] =
                npmDownloadRangeDto === null ? [] : this.mapCounts(npmDownloadRangeDto);

            npmDownloadCounts.set(packageName, packageCounts);
        }

        return npmDownloadCounts;
    }

    private mapCounts(npmDownloadRangeDto: NpmDownloadRangeDto): NpmDownloadCount[] {
        return npmDownloadRangeDto
            .getDownloads()
            .map((npmDownloadDto: NpmDownloadDto) => this.npmDownloadCountMapper.map(npmDownloadDto));
    }
}
