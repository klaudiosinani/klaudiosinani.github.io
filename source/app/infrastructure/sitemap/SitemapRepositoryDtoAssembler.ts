import { SitemapRepositoryDto } from "./SitemapRepositoryDto.ts";

export class SitemapRepositoryDtoAssembler {
    public assemble(payload: unknown): SitemapRepositoryDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;

        return new SitemapRepositoryDto(
            typeof record.name === "string" ? record.name : "",
            typeof record.pushed_at === "string" ? record.pushed_at : ""
        );
    }
}
