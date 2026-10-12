export class GithubSearchEndpointAssembler {
    public assembleIssues(): string {
        return "search/issues";
    }

    public assembleCommits(): string {
        return "search/commits";
    }
}
