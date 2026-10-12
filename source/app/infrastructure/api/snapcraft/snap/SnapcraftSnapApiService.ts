import type { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";
import type { SnapcraftSnapDto } from "./SnapcraftSnapDto.ts";
import type { SnapcraftSnapDtoAssembler } from "./SnapcraftSnapDtoAssembler.ts";

export class SnapcraftSnapApiService {
    private readonly HOST: string = "https://api.snapcraft.io/v2/snaps";
    private readonly HEADERS: Record<string, string> = { "Snap-Device-Series": "16" };

    private readonly httpApiService: HttpApiService;
    private readonly snapcraftSnapDtoAssembler: SnapcraftSnapDtoAssembler;

    public constructor(httpApiService: HttpApiService, snapcraftSnapDtoAssembler: SnapcraftSnapDtoAssembler) {
        this.httpApiService = httpApiService;
        this.snapcraftSnapDtoAssembler = snapcraftSnapDtoAssembler;
    }

    public async getSnapId(name: string): Promise<string> {
        const payload: unknown = await this.httpApiService.get<unknown>(this.HOST, `info/${name}`, {}, this.HEADERS);
        const snapcraftSnapDto: SnapcraftSnapDto = this.snapcraftSnapDtoAssembler.assemble(payload);

        return snapcraftSnapDto.getSnapId();
    }
}
