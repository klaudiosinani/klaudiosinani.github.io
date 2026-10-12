export class GithubRepositoryEndpointAssembler {
    public assemble(username: string): string {
        return `users/${username}/repos`;
    }
}
