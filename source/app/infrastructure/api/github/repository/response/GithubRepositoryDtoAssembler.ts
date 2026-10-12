import { GithubRepositoryDto } from "./GithubRepositoryDto.ts";

export class GithubRepositoryDtoAssembler {
    public assemble(payload: unknown): GithubRepositoryDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const license: Record<string, unknown> | null = this.license(record.license);
        const topics: unknown = record.topics;

        return new GithubRepositoryDto(
            this.text(record.name),
            typeof record.description === "string" ? record.description : null,
            this.text(record.html_url),
            this.count(record.stargazers_count),
            this.count(record.forks_count),
            typeof record.language === "string" ? record.language : null,
            license !== null && typeof license.spdx_id === "string" ? license.spdx_id : null,
            license !== null && typeof license.name === "string" ? license.name : null,
            Array.isArray(topics) ? topics.filter((topic: unknown): topic is string => typeof topic === "string") : [],
            this.text(record.created_at),
            this.text(record.updated_at),
            this.text(record.pushed_at)
        );
    }

    private license(value: unknown): Record<string, unknown> | null {
        return value === null || typeof value !== "object" ? null : (value as Record<string, unknown>);
    }

    private text(value: unknown): string {
        return typeof value === "string" ? value : "";
    }

    private count(value: unknown): number {
        return typeof value === "number" ? value : 0;
    }
}
