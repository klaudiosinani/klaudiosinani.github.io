import { afterEach, describe, expect, it, vi } from "vitest";
import type { Mock, MockInstance } from "vitest";
import { GitHubPagedListing } from "@app/infrastructure/github/dto/GitHubPagedListing";

type ReadPage = (number: number) => Promise<string[]>;

const underTest: GitHubPagedListing = new GitHubPagedListing(3, 4);

const page = (length: number): string[] => Array.from({ length }, (_: unknown, index: number) => `entry-${index}`);

afterEach(() => {
    vi.restoreAllMocks();
});

describe("GitHubPagedListing.read", () => {
    it("givenAShortFirstPage_whenWalking_thenNoSecondPageIsAskedFor", async () => {
        const read: Mock<ReadPage> = vi.fn<ReadPage>().mockResolvedValue(page(2));

        const entries: string[] = await underTest.read(read, "the entries");

        expect(entries).toHaveLength(2);
        expect(read).toHaveBeenCalledExactlyOnceWith(1);
    });

    it("givenAFullPageAndThenAShortOne_whenWalking_thenBothAreCollected", async () => {
        const read: Mock<ReadPage> = vi.fn<ReadPage>().mockResolvedValueOnce(page(3)).mockResolvedValueOnce(page(1));

        const entries: string[] = await underTest.read(read, "the entries");

        expect(entries).toHaveLength(4);
        expect(read).toHaveBeenLastCalledWith(2);
    });

    it("givenAnEmptyFirstPage_whenWalking_thenNothingIsRead", async () => {
        expect(await underTest.read(async () => [], "the entries")).toEqual([]);
    });

    it("givenPagesThatNeverEnd_whenWalking_thenItStopsAtTheLimitAndSaysSo", async () => {
        const warn: MockInstance<typeof console.warn> = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        const entries: string[] = await underTest.read(async () => page(3), "the repositories of @octocat");

        expect(entries).toHaveLength(12);
        expect(warn).toHaveBeenCalledExactlyOnceWith(
            "GitHub listing truncated at 12 entries for the repositories of @octocat"
        );
    });

    it("givenTheWalk_whenAskedForItsLimit_thenItIsThePagesTimesTheirSize", () => {
        expect(underTest.limit).toBe(12);
    });
});
