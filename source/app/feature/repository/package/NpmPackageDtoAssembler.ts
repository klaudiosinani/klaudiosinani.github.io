import { NpmPackageDto } from "./NpmPackageDto";

export class NpmPackageDtoAssembler {
    public assemble(payload: unknown): NpmPackageDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const distTags: Record<string, unknown> = (record["dist-tags"] ?? {}) as Record<string, unknown>;
        const maintainers: unknown = record.maintainers;
        const entries: unknown[] = Array.isArray(maintainers) ? maintainers : [];

        const maintainerNames: string[] = entries
            .map((entry: unknown) => ((entry ?? {}) as Record<string, unknown>).name)
            .filter((name: unknown): name is string => typeof name === "string");

        return new NpmPackageDto(typeof distTags.latest === "string" ? distTags.latest : null, maintainerNames);
    }
}
