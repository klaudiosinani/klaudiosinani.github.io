import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import type { MockInstance } from "vitest";
import { LiveRepositoryDocumentTextProvider } from "@app/feature/repository/service/LiveRepositoryDocumentTextProvider";

const underTest: LiveRepositoryDocumentTextProvider = new LiveRepositoryDocumentTextProvider();

beforeEach(() => {
    vi.restoreAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("LiveRepositoryDocumentTextProvider.markdown", () => {
    it("givenGitHubHasTheFile_whenAsked_thenItGivesTheMarkdown", async () => {
        const send: MockInstance = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(new Response("# Title", { status: 200 }));

        const markdown: string | null = await underTest.markdown(
            new RepositoryRef("klaudiosinani", "signale"),
            "docs/readme.DE.md"
        );

        expect(markdown).toBe("# Title");
        expect(send.mock.calls[0][0]).toBe(
            "https://api.github.com/repos/klaudiosinani/signale/contents/docs/readme.DE.md"
        );
    });

    it("givenTheFileIsNotThere_whenAsked_thenItGivesNothing", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Not Found", { status: 404 }));

        expect(await underTest.markdown(new RepositoryRef("a", "b"), "c.md")).toBeNull();
    });

    it("givenTheRequestFails_whenAsked_thenItGivesNothing", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("no network"));

        expect(await underTest.markdown(new RepositoryRef("a", "b"), "c.md")).toBeNull();
    });
});
