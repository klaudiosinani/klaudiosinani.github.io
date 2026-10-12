export class StatedRelatedProjectsResolver {
    private readonly HEADING: RegExp = /^(#{2,4})\s+related\b[^\n]*$/im;

    private readonly OWNER: RegExp = /^https:\/\/github\.com\/([^/]+)\//i;

    private readonly REPOSITORY: RegExp = /^([A-Za-z0-9._-]+)/;

    public resolve(markdown: string, repository: string): string[] {
        const owner: RegExpExecArray | null = this.OWNER.exec(`${repository}/`);
        const heading: RegExpExecArray | null = this.HEADING.exec(markdown);

        if (!owner || !heading) {
            return [];
        }

        return this.named(this.section(markdown, heading), owner[1]);
    }

    private section(markdown: string, heading: RegExpExecArray): string {
        return markdown
            .slice(heading.index + heading[0].length)
            .split(new RegExp(`^#{1,${heading[1].length}}\\s`, "m"))[0];
    }

    private named(section: string, owner: string): string[] {
        const links: RegExp = new RegExp(`https://github\\.com/${this.quoted(owner)}/([^)\\s]+)`, "gi");

        const named: string[] = [...section.matchAll(links)]
            .map(([, address]: RegExpExecArray) => this.REPOSITORY.exec(address))
            .filter((matched: RegExpExecArray | null): matched is RegExpExecArray => matched !== null)
            .map(([, name]: RegExpExecArray) => name.replace(/\.git$/i, "").toLowerCase());

        return [...new Set(named)];
    }

    private quoted(owner: string): string {
        return owner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
