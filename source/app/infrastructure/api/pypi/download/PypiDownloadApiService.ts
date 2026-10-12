import type { PypiApiService } from "../common/PypiApiService.ts";
import type { PypiDownloadEndpointAssembler } from "./request/PypiDownloadEndpointAssembler.ts";
import type { PypiDownloadWindow } from "./window/PypiDownloadWindow.ts";
import type { PypiDownloadWindowCalculator } from "./window/PypiDownloadWindowCalculator.ts";
import type { PypiOverallDownloadsDto } from "./response/PypiOverallDownloadsDto.ts";
import type { PypiOverallDownloadsDtoAssembler } from "./response/PypiOverallDownloadsDtoAssembler.ts";
import type { PypiRecentDownloadsDto } from "./response/PypiRecentDownloadsDto.ts";
import type { PypiRecentDownloadsDtoAssembler } from "./response/PypiRecentDownloadsDtoAssembler.ts";

export class PypiDownloadApiService {
    private readonly pypiApiService: PypiApiService;
    private readonly pypiDownloadEndpointAssembler: PypiDownloadEndpointAssembler;
    private readonly pypiDownloadWindowCalculator: PypiDownloadWindowCalculator;
    private readonly pypiRecentDownloadsDtoAssembler: PypiRecentDownloadsDtoAssembler;
    private readonly pypiOverallDownloadsDtoAssembler: PypiOverallDownloadsDtoAssembler;

    public constructor(
        pypiApiService: PypiApiService,
        pypiDownloadEndpointAssembler: PypiDownloadEndpointAssembler,
        pypiDownloadWindowCalculator: PypiDownloadWindowCalculator,
        pypiRecentDownloadsDtoAssembler: PypiRecentDownloadsDtoAssembler,
        pypiOverallDownloadsDtoAssembler: PypiOverallDownloadsDtoAssembler
    ) {
        this.pypiApiService = pypiApiService;
        this.pypiDownloadEndpointAssembler = pypiDownloadEndpointAssembler;
        this.pypiDownloadWindowCalculator = pypiDownloadWindowCalculator;
        this.pypiRecentDownloadsDtoAssembler = pypiRecentDownloadsDtoAssembler;
        this.pypiOverallDownloadsDtoAssembler = pypiOverallDownloadsDtoAssembler;
    }

    public async getRecentMonthDownloads(packageName: string): Promise<number> {
        const endpoint: string = this.pypiDownloadEndpointAssembler.assembleRecent(packageName);
        const payload: unknown = await this.pypiApiService.getResource<unknown>(endpoint, {}, {});

        const pypiRecentDownloadsDto: PypiRecentDownloadsDto = this.pypiRecentDownloadsDtoAssembler.assemble(payload);

        return pypiRecentDownloadsDto.getLastMonth();
    }

    public async getDownloadWindow(packageName: string): Promise<PypiDownloadWindow> {
        const endpoint: string = this.pypiDownloadEndpointAssembler.assembleOverall(packageName);
        const payload: unknown = await this.pypiApiService.getResource<unknown>(endpoint, { mirrors: false }, {});

        const pypiOverallDownloadsDto: PypiOverallDownloadsDto =
            this.pypiOverallDownloadsDtoAssembler.assemble(payload);

        return this.pypiDownloadWindowCalculator.calculate(pypiOverallDownloadsDto.getDays());
    }
}
