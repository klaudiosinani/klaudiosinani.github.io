export class ReleaseComparisonResolver {
    public resolve(repository: string, previous: string, tag: string): string {
        return `${repository.replace(/\/+$/, "")}/compare/${previous}...${tag}`;
    }
}
