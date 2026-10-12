import { RepositoryCommitDto } from "./RepositoryCommitDto";

export class RepositoryCommitDtoAssembler {
    public assemble(payload: unknown): RepositoryCommitDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const commit: Record<string, unknown> = (record.commit ?? {}) as Record<string, unknown>;
        const committer: Record<string, unknown> = (commit.committer ?? {}) as Record<string, unknown>;

        return new RepositoryCommitDto(
            this.text(record.sha),
            this.text(record.html_url),
            this.text(commit.message),
            this.text(committer.date)
        );
    }

    private text(value: unknown): string {
        return typeof value === "string" ? value : "";
    }
}
