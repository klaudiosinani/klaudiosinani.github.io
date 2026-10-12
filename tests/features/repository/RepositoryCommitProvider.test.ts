import { afterEach, describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import { RepositoryCommitProvider } from "@app/feature/repository/service/RepositoryCommitProvider";

import type { RepositoryCommit } from "@app/feature/repository/RepositoryCommit";
const underTest: RepositoryCommitProvider = new RepositoryCommitProvider();

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

const commitPayload = (message: string = "Tighten the public type surface") => [
    {
        sha: "a0119bbf2c1ab4d5e6f7890abcdef1234567890a",
        html_url: "https://github.com/klaudiosinani/signale/commit/a0119bb",
        commit: { message, committer: { date: "2026-08-10T16:20:00Z" } },
    },
];

const run = (status: string, conclusion: string | null) => ({
    status,
    conclusion,
});

const respondWith = (commits: unknown, checks: unknown): void => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) =>
        Promise.resolve(jsonResponse(String(input).includes("check-runs") ? checks : commits))
    );
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("RepositoryCommitProvider.latest", () => {
    it("givenNoCommits_whenReadingTheTip_thenNothingIsReturned", async () => {
        respondWith([], { total_count: 0, check_runs: [] });

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "empty"));

        expect(commit).toBeNull();
    });

    it("givenAMultiLineMessage_whenReadingTheTip_thenOnlyTheSubjectSurvives", async () => {
        respondWith(commitPayload("Subject line\n\nA body paragraph."), {
            total_count: 0,
            check_runs: [],
        });

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit?.message).toBe("Subject line");
    });

    it("givenNoCheckRuns_whenReadingTheTip_thenChecksAreAbsentRatherThanPending", async () => {
        respondWith(commitPayload(), { total_count: 0, check_runs: [] });

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit?.checks).toBeNull();
    });

    it("givenEveryRunPassed_whenReadingTheTip_thenTheVerdictIsSuccess", async () => {
        respondWith(commitPayload(), {
            total_count: 2,
            check_runs: [run("completed", "success"), run("completed", "success")],
        });

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit?.checks).toEqual({
            total: 2,
            passed: 2,
            conclusion: "success",
        });
    });

    it("givenOneRunFailed_whenReadingTheTip_thenTheVerdictIsFailure", async () => {
        respondWith(commitPayload(), {
            total_count: 2,
            check_runs: [run("completed", "success"), run("completed", "failure")],
        });

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit?.checks?.conclusion).toBe("failure");
        expect(commit?.checks?.passed).toBe(1);
    });

    it("givenARunStillGoing_whenReadingTheTip_thenItOutranksAFailureBesideIt", async () => {
        respondWith(commitPayload(), {
            total_count: 2,
            check_runs: [run("in_progress", null), run("completed", "failure")],
        });

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit?.checks?.conclusion).toBe("running");
    });

    it("givenRunsThatNeitherPassedNorFailed_whenReadingTheTip_thenTheVerdictIsNeutral", async () => {
        respondWith(commitPayload(), {
            total_count: 1,
            check_runs: [run("completed", "skipped")],
        });

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit?.checks?.conclusion).toBe("neutral");
    });

    it("givenAnUndatedCommitter_whenReadingTheTip_thenTheDateIsEmptyRatherThanInvalid", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) =>
            Promise.resolve(
                jsonResponse(
                    String(input).includes("check-runs")
                        ? { total_count: 0, check_runs: [] }
                        : [
                              {
                                  sha: "abc",
                                  html_url: "https://github.com/x/y/commit/abc",
                                  commit: { message: "No committer", committer: null },
                              },
                          ]
                )
            )
        );

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit?.committedAt).toBe("");
    });

    it("givenAMalformedEntry_whenReadingTheTip_thenNothingIsReturnedRatherThanThrowing", async () => {
        respondWith([{ sha: "abc", html_url: "https://example.com" }], {
            total_count: 0,
            check_runs: [],
        });

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit).toBeNull();
    });

    it("givenTheCommitRequestFails_whenReadingTheTip_thenNothingIsReturned", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 500 }));

        const commit: RepositoryCommit | null = await underTest.latest(new RepositoryRef("klaudiosinani", "signale"));

        expect(commit).toBeNull();
    });
});
