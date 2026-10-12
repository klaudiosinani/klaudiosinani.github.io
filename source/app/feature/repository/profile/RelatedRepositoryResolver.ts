import type { RepositoryConfiguration } from "@app/feature/repository/profile/RepositoryConfiguration";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { RelatableRepository } from "./RelatableRepository";

export class RelatedRepositoryResolver {
    private readonly repositoryConfiguration: RepositoryConfiguration;
    private readonly SUBJECT: number = 3;

    public constructor(repositoryConfiguration: RepositoryConfiguration) {
        this.repositoryConfiguration = repositoryConfiguration;
    }
    private readonly LANGUAGE: number = 1;

    public resolve(
        profile: RelatableRepository,
        candidates: readonly GithubRepositoryData[],
        limit: number
    ): GithubRepositoryData[] {
        const offered: GithubRepositoryData[] = candidates.filter((candidate: GithubRepositoryData) =>
            this.isOther(candidate, profile)
        );

        const stated: GithubRepositoryData[] = this.stated(profile, offered);

        return [...stated, ...this.measured(profile, offered, stated)].slice(0, limit);
    }

    private stated(profile: RelatableRepository, offered: readonly GithubRepositoryData[]): GithubRepositoryData[] {
        return (profile.manual?.getRelated() ?? [])
            .map((name: string) =>
                offered.find(
                    (candidate: GithubRepositoryData) => candidate.getName().toLowerCase() === name.toLowerCase()
                )
            )
            .filter((candidate: GithubRepositoryData | undefined): candidate is GithubRepositoryData =>
                Boolean(candidate)
            );
    }

    private measured(
        profile: RelatableRepository,
        offered: readonly GithubRepositoryData[],
        stated: readonly GithubRepositoryData[]
    ): GithubRepositoryData[] {
        const subjects: ReadonlySet<string> = this.subjects(profile.topics);
        const named: Set<string> = new Set(
            stated.map((githubRepositoryData: GithubRepositoryData) => githubRepositoryData.getName())
        );

        return offered
            .filter((candidate: GithubRepositoryData) => !named.has(candidate.getName()))
            .map((candidate: GithubRepositoryData) => ({
                candidate,
                score: this.score(profile, subjects, candidate),
            }))
            .filter(({ score }: { candidate: GithubRepositoryData; score: number }) => score > 0)
            .sort(
                (
                    first: { candidate: GithubRepositoryData; score: number },
                    second: { candidate: GithubRepositoryData; score: number }
                ) =>
                    second.score - first.score ||
                    second.candidate.getStars() - first.candidate.getStars() ||
                    first.candidate.getName().localeCompare(second.candidate.getName())
            )
            .map(({ candidate }: { candidate: GithubRepositoryData; score: number }) => candidate);
    }

    private isOther(candidate: GithubRepositoryData, profile: RelatableRepository): boolean {
        return (
            candidate.getName().toLowerCase() !== profile.slug.toLowerCase() &&
            this.repositoryConfiguration.profiles(candidate.getName())
        );
    }

    private score(
        profile: RelatableRepository,
        subjects: ReadonlySet<string>,
        candidate: GithubRepositoryData
    ): number {
        const shared: number = candidate
            .getTopics()
            .filter((topic: string) => subjects.has(topic.toLowerCase())).length;

        const spoken: boolean =
            profile.language !== null && candidate.getLanguage()?.toLowerCase() === profile.language.toLowerCase();

        return shared * this.SUBJECT + (spoken ? this.LANGUAGE : 0);
    }

    private subjects(topics: readonly string[]): ReadonlySet<string> {
        return new Set(topics.map((topic: string) => topic.toLowerCase()));
    }
}
