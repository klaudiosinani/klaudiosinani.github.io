import { SoftwareSignals } from "./SoftwareSignals";

export class SoftwareSignalsFactory {
    public create(
        languages: readonly string[],
        openIssues: number | null,
        openPullRequests: number | null,
        latestRelease: string | null,
        latestCommit: string | null
    ): SoftwareSignals {
        return new SoftwareSignals(languages, openIssues, openPullRequests, latestRelease, latestCommit);
    }

    public createAbsent(language: string | null): SoftwareSignals {
        return new SoftwareSignals(language ? [language] : [], null, null, null, null);
    }
}
