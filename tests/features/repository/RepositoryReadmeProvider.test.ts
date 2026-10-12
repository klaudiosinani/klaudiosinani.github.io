import { afterEach, describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import type { MockInstance } from "vitest";
import { RepositoryReadmeProvider } from "@app/feature/repository/service/RepositoryReadmeProvider";

const underTest: RepositoryReadmeProvider = new RepositoryReadmeProvider();

afterEach(() => {
    vi.restoreAllMocks();
});

describe("RepositoryReadmeProvider.markdown", () => {
    it("givenAReadme_whenReading_thenTheMarkdownIsGivenAsWritten", async () => {
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(new Response("## Install\n", { status: 200 }));

        const markdown: string | null = await underTest.markdown(new RepositoryRef("klaudiosinani", "signale"));

        expect(markdown).toBe("## Install\n");
        expect(String(fetched.mock.calls[0][0])).toBe("https://api.github.com/repos/klaudiosinani/signale/readme");
        expect((fetched.mock.calls[0][1]?.headers as Record<string, string>).Accept).toBe("application/vnd.github.raw");
    });

    it("givenARepositoryWithNoReadme_whenReading_thenNothingIsGiven", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Not Found", { status: 404 }));

        await expect(underTest.markdown(new RepositoryRef("klaudiosinani", "signale"))).resolves.toBeNull();
    });

    it("givenAnUnreachableApi_whenReading_thenThePageIsBuiltWithoutTheManual", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        await expect(underTest.markdown(new RepositoryRef("klaudiosinani", "signale"))).resolves.toBeNull();
    });
});
