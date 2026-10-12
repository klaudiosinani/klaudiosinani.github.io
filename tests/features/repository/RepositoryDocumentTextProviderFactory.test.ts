import { describe, expect, it } from "vitest";
import { LiveRepositoryDocumentTextProvider } from "@app/feature/repository/service/LiveRepositoryDocumentTextProvider";
import { MockRepositoryDocumentTextProvider } from "@app/feature/repository/service/MockRepositoryDocumentTextProvider";
import { RepositoryDocumentTextProviderFactory as underTest } from "@app/feature/repository/service/RepositoryDocumentTextProviderFactory";

describe("RepositoryDocumentTextProviderFactory.create", () => {
    it("givenABuildForTheLiveSite_whenAsked_thenItReadsTheRepository", () => {
        expect(underTest.create(true)).toBeInstanceOf(LiveRepositoryDocumentTextProvider);
    });

    it("givenABuildWithNoToken_whenAsked_thenItGivesWordsToDraw", () => {
        expect(underTest.create(false)).toBeInstanceOf(MockRepositoryDocumentTextProvider);
    });
});
