import type { CommitShaFormatter } from "@app/util/text/CommitShaFormatter";
import type { RepositoryFacts } from "@app/feature/repository/profile/RepositoryFacts";
import type { SignalledRepository } from "../profile/SignalledRepository";
import type { SoftwareSignals } from "@app/feature/software/signal/SoftwareSignals";
import type { SoftwareSignalsFactory } from "@app/feature/software/signal/SoftwareSignalsFactory";

import type { RepositoryLanguage } from "@app/feature/repository/profile/RepositoryLanguage";
export class RepositorySignalsResolver {
    private readonly commitShaFormatter: CommitShaFormatter;
    private readonly repositoryFacts: RepositoryFacts;
    private readonly softwareSignalsFactory: SoftwareSignalsFactory;

    public constructor(
        commitShaFormatter: CommitShaFormatter,
        repositoryFacts: RepositoryFacts,
        softwareSignalsFactory: SoftwareSignalsFactory
    ) {
        this.commitShaFormatter = commitShaFormatter;
        this.repositoryFacts = repositoryFacts;
        this.softwareSignalsFactory = softwareSignalsFactory;
    }
    public of(profiles: readonly (SignalledRepository | null)[]): Map<string, SoftwareSignals> {
        return new Map(
            profiles
                .filter((profile: SignalledRepository | null): profile is SignalledRepository => profile !== null)
                .map((profile: SignalledRepository) => [
                    profile.slug,
                    this.softwareSignalsFactory.create(
                        profile.languages.map(({ name }: RepositoryLanguage) => name),
                        profile.totals?.getOpenIssues() ?? null,
                        profile.totals?.getOpenPullRequests() ?? null,
                        this.repositoryFacts.newestTag(profile),
                        profile.latestCommit ? this.commitShaFormatter.format(profile.latestCommit.getSha()) : null
                    ),
                ])
        );
    }
}
