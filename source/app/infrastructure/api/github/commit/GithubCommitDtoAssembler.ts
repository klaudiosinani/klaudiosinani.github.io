import { GithubCommitDto } from "./GithubCommitDto.ts";

export class GithubCommitDtoAssembler {
    public assemble(payload: unknown): GithubCommitDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const commit: Record<string, unknown> = (record.commit ?? {}) as Record<string, unknown>;
        const author: Record<string, unknown> = (commit.author ?? {}) as Record<string, unknown>;

        return new GithubCommitDto(
            this.text(record.sha),
            this.text(record.html_url),
            this.text(commit.message),
            this.text(author.date)
        );
    }

    private text(value: unknown): string {
        return typeof value === "string" ? value : "";
    }
}
