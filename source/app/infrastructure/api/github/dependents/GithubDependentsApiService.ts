import type { GithubRepositoryRef } from "../repository/request/GithubRepositoryRef.ts";
import type { HttpApiService } from "@app/infrastructure/http/HttpApiService.ts";

export class GithubDependentsApiService {
    private readonly HOST: string = "https://github.com";

    private readonly HEADERS: Record<string, string> = {
        Accept: "text/html",
        "User-Agent": "Mozilla/5.0",
    };

    private readonly httpApiService: HttpApiService;

    public constructor(httpApiService: HttpApiService) {
        this.httpApiService = httpApiService;
    }

    public async getPage(githubRepositoryRef: GithubRepositoryRef): Promise<string> {
        const endpoint: string = `${githubRepositoryRef.getPath()}/network/dependents`;

        return this.httpApiService.getText(this.HOST, endpoint, {}, this.HEADERS);
    }
}
