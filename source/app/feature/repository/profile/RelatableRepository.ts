import type { RepositoryManual } from "../document/RepositoryManual";

export interface RelatableRepository {
    readonly slug: string;
    readonly language: string | null;
    readonly topics: string[];
    readonly manual: RepositoryManual | null;
}
