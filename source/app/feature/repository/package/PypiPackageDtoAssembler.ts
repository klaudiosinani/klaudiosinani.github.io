import { PypiPackageDto } from "./PypiPackageDto";

export class PypiPackageDtoAssembler {
    public assemble(payload: unknown): PypiPackageDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const info: Record<string, unknown> = (record.info ?? {}) as Record<string, unknown>;
        const projectUrls: Record<string, unknown> = (info.project_urls ?? {}) as Record<string, unknown>;

        const urls: string[] = [typeof info.home_page === "string" ? info.home_page : "", ...Object.values(projectUrls)]
            .filter((url: unknown): url is string => typeof url === "string")
            .filter((url: string) => url.length > 0);

        return new PypiPackageDto(typeof info.version === "string" ? info.version : null, urls);
    }
}
