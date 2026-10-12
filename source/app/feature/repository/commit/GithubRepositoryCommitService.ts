import type { CommitCheckConclusion } from "@app/feature/repository/commit/CommitCheckConclusion";
import type { CheckRunDto } from "./CheckRunDto";
import type { CheckRunsDto } from "./CheckRunsDto";
import type { CheckRunsDtoAssembler } from "./CheckRunsDtoAssembler";
import { CommitChecks } from "./CommitChecks";
import type { CommitMessage } from "@app/util/text/CommitMessage";
import type { GithubCommitEndpointAssembler } from "@app/infrastructure/api/github/commit/GithubCommitEndpointAssembler";
import type { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import { RepositoryCommit } from "./RepositoryCommit";
import type { RepositoryCommitDto } from "./RepositoryCommitDto";
import type { RepositoryCommitDtoAssembler } from "./RepositoryCommitDtoAssembler";
import type { RepositoryCommitSource } from "./RepositoryCommitSource";

export class GithubRepositoryCommitService implements RepositoryCommitSource {
    private readonly FAILED_CONCLUSIONS: string[] = ["failure", "timed_out", "cancelled"];

    private readonly githubOptionalReader: GithubOptionalReader;
    private readonly githubCommitEndpointAssembler: GithubCommitEndpointAssembler;
    private readonly repositoryCommitDtoAssembler: RepositoryCommitDtoAssembler;
    private readonly checkRunsDtoAssembler: CheckRunsDtoAssembler;
    private readonly commitMessage: CommitMessage;

    public constructor(
        githubOptionalReader: GithubOptionalReader,
        githubCommitEndpointAssembler: GithubCommitEndpointAssembler,
        repositoryCommitDtoAssembler: RepositoryCommitDtoAssembler,
        checkRunsDtoAssembler: CheckRunsDtoAssembler,
        commitMessage: CommitMessage
    ) {
        this.githubOptionalReader = githubOptionalReader;
        this.githubCommitEndpointAssembler = githubCommitEndpointAssembler;
        this.repositoryCommitDtoAssembler = repositoryCommitDtoAssembler;
        this.checkRunsDtoAssembler = checkRunsDtoAssembler;
        this.commitMessage = commitMessage;
    }

    public async latest(repository: GithubRepositoryRef): Promise<RepositoryCommit | null> {
        const payload: unknown[] | null = await this.githubOptionalReader.readResource<unknown[]>(
            this.githubCommitEndpointAssembler.assembleLatest(repository),
            {}
        );

        const entry: unknown = payload?.[0];

        if (entry === undefined) {
            return null;
        }

        const commit: RepositoryCommitDto = this.repositoryCommitDtoAssembler.assemble(entry);

        if (commit.getSha() === "") {
            return null;
        }

        return new RepositoryCommit(
            commit.getSha(),
            this.commitMessage.subject(commit.getMessage()),
            commit.getHtmlUrl(),
            commit.getCommittedAt(),
            await this.checks(repository, commit.getSha())
        );
    }

    private async checks(repository: GithubRepositoryRef, sha: string): Promise<CommitChecks | null> {
        const payload: unknown = await this.githubOptionalReader.readResource<unknown>(
            this.githubCommitEndpointAssembler.assembleCheckRuns(repository, sha),
            {}
        );

        if (payload === null) {
            return null;
        }

        const checkRunsDto: CheckRunsDto = this.checkRunsDtoAssembler.assemble(payload);

        if (checkRunsDto.getTotalCount() === 0) {
            return null;
        }

        const runs: readonly CheckRunDto[] = checkRunsDto.getCheckRuns();

        return new CommitChecks(
            runs.length,
            runs.filter((run: CheckRunDto) => run.isSuccessful()).length,
            this.conclude(runs)
        );
    }

    private conclude(runs: readonly CheckRunDto[]): CommitCheckConclusion {
        if (runs.some((run: CheckRunDto) => !run.isCompleted())) {
            return "running";
        }

        if (
            runs.some((run: CheckRunDto) => {
                const conclusion: string | null = run.getConclusion();

                return conclusion !== null && this.FAILED_CONCLUSIONS.includes(conclusion);
            })
        ) {
            return "failure";
        }

        return runs.every((run: CheckRunDto) => run.isSuccessful()) ? "success" : "neutral";
    }
}
