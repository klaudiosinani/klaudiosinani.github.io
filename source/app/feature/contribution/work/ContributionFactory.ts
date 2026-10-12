import type { CommitShaFormatter } from "@app/util/text/CommitShaFormatter";
import type { CommitSubjectParser } from "@app/feature/contribution/commit/CommitSubjectParser";
import type { GithubAuthoredCommit } from "@app/infrastructure/api/github/commit/GithubAuthoredCommit";
import type { CommitSubject } from "../commit/CommitSubject";
import { Contribution } from "./Contribution";

export class ContributionFactory {
    private readonly commitShaFormatter: CommitShaFormatter;
    private readonly commitSubjectParser: CommitSubjectParser;

    public constructor(commitShaFormatter: CommitShaFormatter, commitSubjectParser: CommitSubjectParser) {
        this.commitShaFormatter = commitShaFormatter;
        this.commitSubjectParser = commitSubjectParser;
    }
    public create(commits: readonly GithubAuthoredCommit[]): Contribution[] {
        return commits
            .map((commit: GithubAuthoredCommit) => this.toContribution(commit))
            .sort(
                (first: Contribution, second: Contribution) =>
                    second.getDate().localeCompare(first.getDate()) || first.getSha().localeCompare(second.getSha())
            );
    }

    private toContribution(commit: GithubAuthoredCommit): Contribution {
        const commitSubject: CommitSubject = this.commitSubjectParser.parse(commit.message);

        return new Contribution(
            commit.sha,
            this.commitShaFormatter.format(commit.sha),
            commit.url,
            commit.date,
            commitSubject.getTicket(),
            commitSubject.getSubject()
        );
    }
}
