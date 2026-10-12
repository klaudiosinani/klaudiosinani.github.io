import type { RepositoryCommit } from "../commit/RepositoryCommit";
import type { RepositoryLanguage } from "./RepositoryLanguage";
import type { RepositoryRelease } from "../release/RepositoryRelease";
import type { RepositoryTotals } from "../signal/RepositoryTotals";

export interface SignalledRepository {
    readonly slug: string;
    readonly languages: RepositoryLanguage[];
    readonly latestCommit: RepositoryCommit | null;
    readonly releases: RepositoryRelease[];
    readonly totals: RepositoryTotals | null;
}
