import type { GithubContentEndpointAssembler } from "@app/infrastructure/api/github/content/GithubContentEndpointAssembler";
import type { GithubOptionalReader } from "@app/infrastructure/api/github/common/GithubOptionalReader";
import type { GithubRepositoryDetailEndpointAssembler } from "@app/infrastructure/api/github/repository/request/GithubRepositoryDetailEndpointAssembler";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { HttpResponse } from "@app/infrastructure/http/response/HttpResponse";
import { RepositoryCitation } from "./RepositoryCitation";
import type { RepositoryDetailSource } from "./RepositoryDetailSource";
import type { RepositoryLanguage } from "./RepositoryLanguage";

export class GithubRepositoryDetailService implements RepositoryDetailSource {
    private readonly LAST_PAGE: RegExp = /[?&]page=(\d+)>;\s*rel="last"/;

    private readonly githubOptionalReader: GithubOptionalReader;
    private readonly githubRepositoryDetailEndpointAssembler: GithubRepositoryDetailEndpointAssembler;
    private readonly githubContentEndpointAssembler: GithubContentEndpointAssembler;

    public constructor(
        githubOptionalReader: GithubOptionalReader,
        githubRepositoryDetailEndpointAssembler: GithubRepositoryDetailEndpointAssembler,
        githubContentEndpointAssembler: GithubContentEndpointAssembler
    ) {
        this.githubOptionalReader = githubOptionalReader;
        this.githubRepositoryDetailEndpointAssembler = githubRepositoryDetailEndpointAssembler;
        this.githubContentEndpointAssembler = githubContentEndpointAssembler;
    }

    public async languages(repository: GithubRepositoryRef): Promise<RepositoryLanguage[]> {
        const bytes: Record<string, number> =
            (await this.githubOptionalReader.readResource<Record<string, number>>(
                this.githubRepositoryDetailEndpointAssembler.assembleLanguages(repository),
                {}
            )) ?? {};

        const measured: number = Object.values(bytes).reduce((total: number, count: number) => total + count, 0);

        if (measured === 0) {
            return [];
        }

        return Object.entries(bytes)
            .map(([name, count]: [string, number]) => ({
                name,
                share: count / measured,
            }))
            .sort((first: RepositoryLanguage, second: RepositoryLanguage) => second.share - first.share);
    }

    public async contributors(repository: GithubRepositoryRef): Promise<number | null> {
        const httpResponse: HttpResponse | null = await this.githubOptionalReader.readResponse(
            this.githubRepositoryDetailEndpointAssembler.assembleContributors(repository)
        );

        if (!httpResponse || !httpResponse.isSuccessful()) {
            return null;
        }

        const link: string | undefined = httpResponse.getHeaders().link;

        if (!link) {
            return 1;
        }

        const matched: RegExpExecArray | null = this.LAST_PAGE.exec(link);

        return matched ? Number(matched[1]) : null;
    }

    public async citation(repository: GithubRepositoryRef): Promise<RepositoryCitation | null> {
        const file: { html_url: string; content?: string } | null = await this.githubOptionalReader.readResource<{
            html_url: string;
            content?: string;
        }>(this.githubContentEndpointAssembler.assembleCitation(repository), {});

        if (!file) {
            return null;
        }

        const text: string = this.decode(file.content);

        return new RepositoryCitation(file.html_url, this.title(text), text);
    }

    private decode(encoded: string | undefined): string {
        return encoded ? Buffer.from(encoded, "base64").toString("utf8").trim() : "";
    }

    private title(decoded: string): string | null {
        const matched: RegExpExecArray | null = /^title:\s*(.+)$/m.exec(decoded);

        return matched ? matched[1].trim().replace(/^["']|["']$/g, "") : null;
    }
}
