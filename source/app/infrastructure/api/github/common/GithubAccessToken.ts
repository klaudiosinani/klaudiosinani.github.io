export class GithubAccessToken {
    public getValue(): string | undefined {
        return import.meta.env.GITHUB_TRAFFIC_TOKEN || import.meta.env.GITHUB_TOKEN || undefined;
    }

    public hasTrafficToken(): boolean {
        return Boolean(import.meta.env.GITHUB_TRAFFIC_TOKEN);
    }
}
