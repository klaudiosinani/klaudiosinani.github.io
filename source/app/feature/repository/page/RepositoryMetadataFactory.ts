import type { CommitChecks } from "../commit/CommitChecks";
import type { CommitChecksFormatter } from "@app/feature/repository/commit/CommitChecksFormatter";
import type { CommitShaFormatter } from "@app/util/text/CommitShaFormatter";
import type { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import CommitIcon from "@ui/component/icon/CommitIcon";
import type { DependentCounts } from "../signal/DependentCounts";
import LicenseIcon from "@ui/component/icon/LicenseIcon";
import RepositoryIcon from "@ui/component/icon/RepositoryIcon";
import type { RepositoryCommit } from "../commit/RepositoryCommit";
import { RepositoryMetadatum } from "./RepositoryMetadatum";
import type { RepositoryProfile } from "../profile/RepositoryProfile";
import TagIcon from "@ui/component/icon/TagIcon";

export class RepositoryMetadataFactory {
    private readonly commitChecksFormatter: CommitChecksFormatter;
    private readonly commitShaFormatter: CommitShaFormatter;
    private readonly datetimeFormatter: DatetimeFormatter;
    private readonly numberFormatter: NumberFormatter;
    private readonly FEWEST_DEPENDENTS: number = 1000;

    public constructor(
        commitChecksFormatter: CommitChecksFormatter,
        commitShaFormatter: CommitShaFormatter,
        datetimeFormatter: DatetimeFormatter,
        numberFormatter: NumberFormatter
    ) {
        this.commitChecksFormatter = commitChecksFormatter;
        this.commitShaFormatter = commitShaFormatter;
        this.datetimeFormatter = datetimeFormatter;
        this.numberFormatter = numberFormatter;
    }
    public create(profile: RepositoryProfile): RepositoryMetadatum[] {
        const [latest] = profile.releases;

        return [
            latest &&
                new RepositoryMetadatum(
                    TagIcon,
                    latest.getTag(),
                    `Latest release, published ${this.datetimeFormatter.formatDate(latest.getPublishedAt())}`,
                    latest.getUrl(),
                    undefined
                ),
            profile.latestCommit &&
                new RepositoryMetadatum(
                    CommitIcon,
                    this.commitShaFormatter.format(profile.latestCommit.getSha()),
                    this.change(profile.latestCommit),
                    profile.latestCommit.getUrl(),
                    profile.latestCommit.getChecks()?.getConclusion()
                ),
            profile.license &&
                new RepositoryMetadatum(LicenseIcon, this.terms(profile.license), undefined, undefined, undefined),
            profile.dependents &&
                profile.dependents.getRepositories() >= this.FEWEST_DEPENDENTS &&
                new RepositoryMetadatum(
                    RepositoryIcon,
                    `${this.numberFormatter.display(profile.dependents.getRepositories())} repositories`,
                    this.reach(profile.dependents),
                    `${profile.url}/network/dependents`,
                    undefined
                ),
        ].filter(Boolean) as RepositoryMetadatum[];
    }

    private terms(license: string): string {
        return /licen[cs]e/i.test(license) ? license : `${license} license`;
    }

    private reach(counts: DependentCounts): string {
        const packages: string =
            counts.getPackages() > 0 ? ` and ${this.numberFormatter.display(counts.getPackages())} packages` : "";

        return `${this.numberFormatter.display(counts.getRepositories())} repositories${packages} use this work, as GitHub counts them`;
    }

    private change(commit: RepositoryCommit): string {
        const stated: string = `${commit.getMessage()} — ${this.datetimeFormatter.formatDate(commit.getCommittedAt())}`;
        const commitChecks: CommitChecks | null = commit.getChecks();

        return commitChecks ? `${this.commitChecksFormatter.format(commitChecks)} — ${stated}` : stated;
    }
}
