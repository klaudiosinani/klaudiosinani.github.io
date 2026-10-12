import type { GithubApiService } from "./GithubApiService";
import { GithubMediaType } from "./GithubMediaType";
import type { HttpResponse } from "@app/infrastructure/http/response/HttpResponse";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";

export class GithubOptionalReader {
    private readonly githubApiService: GithubApiService;
    private readonly optionalReader: OptionalReader;

    public constructor(githubApiService: GithubApiService, optionalReaderFactory: OptionalReaderFactory) {
        this.githubApiService = githubApiService;
        this.optionalReader = optionalReaderFactory.create("GitHub");
    }

    public async readResource<T>(endpoint: string, headers: Record<string, string>): Promise<T | null> {
        return this.optionalReader.read<T>(endpoint, () => this.githubApiService.getResource<T>(endpoint, {}, headers));
    }

    public async readText(endpoint: string): Promise<string | null> {
        return this.optionalReader.read<string>(endpoint, () =>
            this.githubApiService.getText(endpoint, {}, { Accept: GithubMediaType.RAW })
        );
    }

    public async readResponse(endpoint: string): Promise<HttpResponse | null> {
        return this.optionalReader.read<HttpResponse>(endpoint, () =>
            this.githubApiService.getUnverifiedHttpResponse(endpoint, {}, {})
        );
    }

    public async post<T>(endpoint: string, body: unknown): Promise<T | null> {
        return this.optionalReader.read<T>(endpoint, () =>
            this.githubApiService.postResource<T, unknown>(endpoint, body, {})
        );
    }
}
