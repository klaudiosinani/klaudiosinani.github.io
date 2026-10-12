import type { RepositoryConfiguration } from "@app/feature/repository/profile/RepositoryConfiguration";
import type { SignaleLogger } from "@app/infrastructure/log/SignaleLogger.ts";
import type { SitemapRepositoryDto } from "./SitemapRepositoryDto.ts";
import { SitemapRepositoryDtoAssembler } from "./SitemapRepositoryDtoAssembler.ts";

export class RepositoryLastModifiedResolver {
    private readonly HOST: string = "https://api.github.com";
    private readonly VERSION: string = "2022-11-28";
    private readonly PER_PAGE: number = 100;
    private readonly PAGES: string[] = ["", "documentation/", "releases/"];
    private readonly BUILD: string = "build";

    private readonly signaleLogger: SignaleLogger;
    private readonly username: string;

    private readonly sitemapRepositoryDtoAssembler: SitemapRepositoryDtoAssembler = new SitemapRepositoryDtoAssembler();
    private readonly repositoryConfiguration: RepositoryConfiguration;

    public constructor(
        signaleLogger: SignaleLogger,
        username: string,
        repositoryConfiguration: RepositoryConfiguration
    ) {
        this.signaleLogger = signaleLogger;
        this.username = username;
        this.repositoryConfiguration = repositoryConfiguration;
    }

    public async resolve(): Promise<Record<string, string>> {
        if (!this.isBuilding()) {
            return {};
        }

        try {
            const listed: SitemapRepositoryDto[] = await this.list();

            return Object.fromEntries(this.toDates(listed));
        } catch (error) {
            this.signaleLogger.error("Repository dates unavailable; the sitemap omits them", error);

            return {};
        }
    }

    private toDates(listed: SitemapRepositoryDto[]): [string, string][] {
        return listed
            .filter((repository: SitemapRepositoryDto) => this.repositoryConfiguration.profiles(repository.getName()))
            .filter((repository: SitemapRepositoryDto) => Boolean(repository.getPushedAt()))
            .flatMap((repository: SitemapRepositoryDto) =>
                this.PAGES.map(
                    (page: string) => [`/${repository.getName()}/${page}`, repository.getPushedAt()] as [string, string]
                )
            );
    }

    private isBuilding(): boolean {
        return process.argv.includes(this.BUILD);
    }

    private async list(): Promise<SitemapRepositoryDto[]> {
        const url: string = `${this.HOST}/users/${this.username}/repos?per_page=${this.PER_PAGE}`;
        const headers: Record<string, string> = this.createHeaders();
        const response: Response = await fetch(url, { headers: headers });

        if (!response.ok) {
            throw new Error(`Failed to fetch repositories: ${response.statusText}`);
        }

        const payload: unknown = await response.json();
        const entries: unknown[] = Array.isArray(payload) ? payload : [];

        return entries.map((entry: unknown) => this.sitemapRepositoryDtoAssembler.assemble(entry));
    }

    private createHeaders(): Record<string, string> {
        const token: string | undefined = process.env.GITHUB_TRAFFIC_TOKEN || process.env.GITHUB_TOKEN;

        return {
            "X-GitHub-Api-Version": this.VERSION,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }
}
