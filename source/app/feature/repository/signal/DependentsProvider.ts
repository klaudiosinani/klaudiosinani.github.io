import type { GithubDependentsApiService } from "@app/infrastructure/api/github/dependents/GithubDependentsApiService";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import type { GithubRepositoryRef } from "@app/infrastructure/api/github/repository/request/GithubRepositoryRef";
import type { DependentsSource } from "./DependentsSource";
import { DependentCounts } from "./DependentCounts";

export class DependentsProvider implements DependentsSource {
    private readonly githubDependentsApiService: GithubDependentsApiService;
    private readonly optionalReader: OptionalReader;

    private readonly COUNTS: RegExp = /([\d,]+)\s+Repositories\s+([\d,]+)\s+Packages/;

    public constructor(
        githubDependentsApiService: GithubDependentsApiService,
        optionalReaderFactory: OptionalReaderFactory
    ) {
        this.githubDependentsApiService = githubDependentsApiService;
        this.optionalReader = optionalReaderFactory.create("Dependents");
    }

    public async counts(repository: GithubRepositoryRef): Promise<DependentCounts | null> {
        const markup: string | null = await this.page(repository);

        if (!markup) {
            return null;
        }

        const matched: RegExpExecArray | null = this.COUNTS.exec(this.text(markup));

        if (!matched) {
            return null;
        }

        return new DependentCounts(this.number(matched[1]), this.number(matched[2]));
    }

    private async page(repository: GithubRepositoryRef): Promise<string | null> {
        return this.optionalReader.read<string>(`the dependents page of ${repository.getPath()}`, () =>
            this.githubDependentsApiService.getPage(repository)
        );
    }

    private text(markup: string): string {
        return markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    }

    private number(value: string): number {
        return Number(value.replace(/,/g, ""));
    }
}
