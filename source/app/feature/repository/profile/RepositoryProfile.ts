import type { RepositoryDocument } from "../document/RepositoryDocument";
import type { DependentCounts } from "../signal/DependentCounts";
import type { RepositoryDownloads } from "../download/RepositoryDownloads";
import type { RepositoryManual } from "../document/RepositoryManual";
import type { PackageListing } from "../package/PackageListing";
import type { RepositoryCitation } from "./RepositoryCitation";
import type { RepositoryLanguage } from "./RepositoryLanguage";
import type { RepositoryCommit } from "../commit/RepositoryCommit";
import type { RepositoryRelease } from "../release/RepositoryRelease";
import type { RepositoryTotals } from "../signal/RepositoryTotals";

export interface RepositoryProfile {
    slug: string;
    name: string;
    logline: string;
    description: string;
    seoTitle?: string;
    url: string;
    language: string | null;
    license: string | null;
    topics: string[];
    createdAt: string;
    stars: number;
    forks: number;
    downloads: RepositoryDownloads;
    trend: number[];
    lastPublishedDay: string | null;
    releases: RepositoryRelease[];
    totals: RepositoryTotals | null;
    packages: PackageListing[];
    latestCommit: RepositoryCommit | null;
    languages: RepositoryLanguage[];
    contributors: number | null;
    clones: number | null;
    dependents: DependentCounts | null;
    citation: RepositoryCitation | null;
    manual: RepositoryManual | null;
    documents: RepositoryDocument[];
}
