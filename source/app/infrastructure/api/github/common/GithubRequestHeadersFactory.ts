import type { GithubAccessToken } from "./GithubAccessToken.ts";

export class GithubRequestHeadersFactory {
    private readonly VERSION: string = "2022-11-28";

    private readonly githubAccessToken: GithubAccessToken;

    public constructor(githubAccessToken: GithubAccessToken) {
        this.githubAccessToken = githubAccessToken;
    }

    public create(extraHeaders: Record<string, string>): Record<string, string> {
        const authorization: Record<string, string> = this.createAuthorization();

        return {
            "X-GitHub-Api-Version": this.VERSION,
            ...authorization,
            ...extraHeaders,
        };
    }

    private createAuthorization(): Record<string, string> {
        const token: string | undefined = this.githubAccessToken.getValue();

        if (token === undefined) {
            return {};
        }

        return { Authorization: `Bearer ${token}` };
    }
}
