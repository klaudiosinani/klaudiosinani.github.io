import { GithubReleaseDto } from "./GithubReleaseDto.ts";

export class GithubReleaseDtoAssembler {
    public assemble(payload: unknown): GithubReleaseDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const assets: unknown = record.assets;
        const entries: unknown[] = Array.isArray(assets) ? assets : [];

        const assetDownloadCounts: number[] = entries.map((entry: unknown) => {
            const asset: Record<string, unknown> = (entry ?? {}) as Record<string, unknown>;

            return typeof asset.download_count === "number" ? asset.download_count : 0;
        });

        return new GithubReleaseDto(
            typeof record.tag_name === "string" ? record.tag_name : "",
            typeof record.name === "string" ? record.name : null,
            typeof record.html_url === "string" ? record.html_url : "",
            typeof record.published_at === "string" ? record.published_at : null,
            record.draft === true,
            record.prerelease === true,
            typeof record.body === "string" ? record.body : null,
            assetDownloadCounts
        );
    }
}
