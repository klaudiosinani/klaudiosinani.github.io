import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import { RepositoryGitHubService } from "@app/feature/repository/service/RepositoryGitHubService";
import { GitHubApiServiceFactory } from "@app/infrastructure/github/factory/GitHubApiServiceFactory";
import type { StarPoint } from "@app/feature/repository/StarPoint";
import type { RepositoryLanguage } from "@app/feature/repository/RepositoryLanguage";
import type { RepositoryCitation } from "@app/feature/repository/RepositoryCitation";
import type { RepositoryCommit } from "@app/feature/repository/RepositoryCommit";
import type { RepositoryDocument } from "@app/feature/repository/RepositoryDocument";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";
import type { RepositoryTotals } from "@app/feature/repository/RepositoryTotals";

const underTest: RepositoryGitHubService = new RepositoryGitHubService(GitHubApiServiceFactory.create());

const jsonResponse = (body: unknown, headers: HeadersInit = {}): Response =>
    new Response(JSON.stringify(body), { status: 200, headers });

const sent = (fetched: MockInstance<typeof fetch>, call: number = 0): Request => fetched.mock.calls[call][0] as Request;

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("RepositoryGitHubService.history", () => {
    const answering = (starred: string): MockInstance<typeof fetch> =>
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([{ starred_at: starred }]));

    it("givenARepositoryWithStars_whenReading_thenEachPointStatesTheCountOnItsDay", async () => {
        answering("2020-01-01T00:00:00Z");

        const points: StarPoint[] = await underTest.history(new RepositoryRef("user", "repo"), 1000);

        expect(points).toHaveLength(10);
        expect(points[0]).toEqual({ date: "2020-01-01T00:00:00Z", count: 100 });
        expect(points[9].count).toBe(1000);
    });

    it("givenAFewStars_whenReading_thenNoCurveIsDrawnAndNothingIsRead", async () => {
        const fetched: MockInstance<typeof fetch> = answering("2020-01-01T00:00:00Z");

        expect(await underTest.history(new RepositoryRef("user", "repo"), 40)).toEqual([]);
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenTheListOfStargazers_whenReading_thenOneItemIsAskedForEachPoint", async () => {
        const fetched: MockInstance<typeof fetch> = answering("2020-01-01T00:00:00Z");

        await underTest.history(new RepositoryRef("user", "repo"), 1000);

        expect(fetched).toHaveBeenCalledTimes(10);
        expect(sent(fetched).url).toContain("per_page=1");
        expect(sent(fetched).headers.get("Accept")).toBe("application/vnd.github.star+json");
    });

    it("givenAPositionThatStatesNoDay_whenReading_thenThatPointIsLeftOut", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([{}]));

        expect(await underTest.history(new RepositoryRef("user", "repo"), 1000)).toEqual([]);
    });

    it("givenARequestThatFails_whenReading_thenTheCurveIsEmpty", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("no", { status: 500 }));

        expect(await underTest.history(new RepositoryRef("user", "repo"), 1000)).toEqual([]);
    });
});

describe("RepositoryGitHubService.languages", () => {
    it("givenSeveralLanguages_whenReadingThem_thenEachCarriesItsShareLargestFirst", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ JavaScript: 12163, TypeScript: 4526 }));

        const languages: RepositoryLanguage[] = await underTest.languages(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(languages.map((language: RepositoryLanguage) => language.name)).toEqual(["JavaScript", "TypeScript"]);
        expect(languages[0].share).toBeCloseTo(0.729, 2);
        expect(languages[1].share).toBeCloseTo(0.271, 2);
    });

    it("givenARepositoryWithNoMeasuredCode_whenReadingLanguages_thenNoneAreReported", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}));

        const languages: RepositoryLanguage[] = await underTest.languages(
            new RepositoryRef("klaudiosinani", "awesome-prolog")
        );

        expect(languages).toEqual([]);
    });

    it("givenTheRequestFails_whenReadingLanguages_thenNoneAreReported", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 500 }));

        const languages: RepositoryLanguage[] = await underTest.languages(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(languages).toEqual([]);
    });
});

describe("RepositoryGitHubService.contributors", () => {
    it("givenAPaginatedListing_whenCounting_thenTheLastPageNumberIsTheCount", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([{}], {
                link: '<https://api.github.com/repositories/1/contributors?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/1/contributors?per_page=1&page=9>; rel="last"',
            })
        );

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "signale"));

        expect(contributors).toBe(9);
    });

    it("givenNoPagination_whenCounting_thenThereIsExactlyOneContributor", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([{}]));

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "arare"));

        expect(contributors).toBe(1);
    });

    it("givenALinkHeaderWithoutALastPage_whenCounting_thenNothingIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([{}], { link: '<https://api.github.com/x>; rel="next"' })
        );

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "signale"));

        expect(contributors).toBeNull();
    });

    it("givenTheRequestFails_whenCounting_thenNothingIsClaimedRatherThanZero", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 403 }));

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "signale"));

        expect(contributors).toBeNull();
    });

    it("givenTheRequestThrows_whenCounting_thenNothingIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

        const contributors: number | null = await underTest.contributors(new RepositoryRef("klaudiosinani", "signale"));

        expect(contributors).toBeNull();
    });
});

describe("RepositoryGitHubService.citation", () => {
    const citationFile = (yaml: string): { html_url: string; content: string } => ({
        html_url: "https://github.com/klaudiosinani/signale/blob/master/CITATION.cff",
        content: Buffer.from(yaml, "utf8").toString("base64"),
    });

    it("givenNoCitationFile_whenLookingForOne_thenNothingIsReturned", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Not Found", { status: 404 }));

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation).toBeNull();
    });

    it("givenACitationFile_whenReadingIt_thenTheFileIsCarriedWhole", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse(citationFile('cff-version: 1.2.0\ntitle: "Signale"\nauthors:\n  - name: Klaudio Sinani\n'))
        );

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation?.text).toBe('cff-version: 1.2.0\ntitle: "Signale"\nauthors:\n  - name: Klaudio Sinani');
    });

    it("givenACitationFile_whenReadingIt_thenItsTitleIsTaken", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse(
                citationFile(
                    'cff-version: 1.2.0\ntitle: "Signale: hackable console logger"\nauthors:\n  - name: Klaudio Sinani\n'
                )
            )
        );

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation?.title).toBe("Signale: hackable console logger");
        expect(citation?.url).toContain("CITATION.cff");
    });

    it("givenACitationFileWithoutATitle_whenReadingIt_thenTheLinkStandsAlone", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse(citationFile("cff-version: 1.2.0\nmessage: Please cite\n"))
        );

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation?.title).toBeNull();
    });

    it("givenAFileEntryWithoutContent_whenReadingIt_thenTheLinkStandsAlone", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse({
                html_url: "https://github.com/x/y/blob/main/CITATION.cff",
            })
        );

        const citation: RepositoryCitation | null = await underTest.citation(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(citation?.title).toBeNull();
    });
});

describe("RepositoryGitHubService.latest", () => {
    const commitPayload = (message: string = "Tighten the public type surface"): unknown[] => [
        {
            sha: "a0119bbf2c1ab4d5e6f7890abcdef1234567890a",
            html_url: "https://github.com/klaudiosinani/signale/commit/a0119bb",
            commit: { message, committer: { date: "2026-08-10T16:20:00Z" } },
        },
    ];

    const run = (status: string, conclusion: string | null): { status: string; conclusion: string | null } => ({
        status,
        conclusion,
    });

    const respondWith = (commits: unknown, checks: unknown): void => {
        vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL) =>
            jsonResponse((input as Request).url.includes("check-runs") ? checks : commits)
        );
    };

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
        respondWith(
            [
                {
                    sha: "abc",
                    html_url: "https://github.com/x/y/commit/abc",
                    commit: { message: "No committer", committer: null },
                },
            ],
            { total_count: 0, check_runs: [] }
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

describe("RepositoryGitHubService.all", () => {
    const release = (overrides: Record<string, unknown> = {}): unknown => ({
        tag_name: "v1.0.0",
        name: "v1.0.0",
        html_url: "https://github.com/klaudiosinani/signale/releases/tag/v1.0.0",
        published_at: "2026-01-01T00:00:00Z",
        draft: false,
        prerelease: false,
        body: "Notes",
        assets: [{ download_count: 10 }, { download_count: 5 }],
        ...overrides,
    });

    it("givenPublishedReleases_whenReadingThem_thenEachCarriesItsTagAndDownloads", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([release()]));

        const releases: RepositoryRelease[] = await underTest.all(new RepositoryRef("klaudiosinani", "signale"));

        expect(releases).toEqual([
            {
                tag: "v1.0.0",
                name: "v1.0.0",
                publishedAt: "2026-01-01T00:00:00Z",
                notes: "Notes",
                url: "https://github.com/klaudiosinani/signale/releases/tag/v1.0.0",
                downloads: 15,
            },
        ]);
    });

    it("givenADraftRelease_whenReadingThem_thenItIsLeftOut", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([release({ draft: true })]));

        const releases: RepositoryRelease[] = await underTest.all(new RepositoryRef("klaudiosinani", "signale"));

        expect(releases).toEqual([]);
    });

    it("givenAReleaseWithNoDate_whenReadingThem_thenItIsLeftOut", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([release({ published_at: null })]));

        const releases: RepositoryRelease[] = await underTest.all(new RepositoryRef("klaudiosinani", "signale"));

        expect(releases).toEqual([]);
    });

    it("givenSeveralReleases_whenReadingThem_thenTheyAreSortedNewestFirst", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse([
                release({ tag_name: "v1.0.0", published_at: "2026-01-01T00:00:00Z" }),
                release({ tag_name: "v2.0.0", published_at: "2026-02-01T00:00:00Z" }),
            ])
        );

        const releases: RepositoryRelease[] = await underTest.all(new RepositoryRef("klaudiosinani", "signale"));

        expect(releases.map(({ tag }: RepositoryRelease) => tag)).toEqual(["v2.0.0", "v1.0.0"]);
    });

    it("givenAReleaseWithNoName_whenReadingThem_thenTheTagStandsInForIt", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([release({ name: null })]));

        const [mapped]: RepositoryRelease[] = await underTest.all(new RepositoryRef("klaudiosinani", "signale"));

        expect(mapped.name).toBe("v1.0.0");
    });

    it("givenTheRequestFails_whenReadingThem_thenTheListIsEmpty", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 500 }));

        const releases: RepositoryRelease[] = await underTest.all(new RepositoryRef("klaudiosinani", "signale"));

        expect(releases).toEqual([]);
    });
});

describe("RepositoryGitHubService.clones", () => {
    const respondWith = (body: unknown, status: number = 200): void => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            status === 200 ? jsonResponse(body) : new Response("", { status })
        );
    };

    it("givenATrafficToken_whenReading_thenTheCountOfTheWindowIsGiven", async () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "token");
        respondWith({ count: 612, uniques: 240 });

        await expect(underTest.clones(new RepositoryRef("klaudiosinani", "signale"))).resolves.toBe(612);
    });

    it("givenNoTrafficToken_whenReading_thenNothingIsRead", async () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "");
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        await expect(underTest.clones(new RepositoryRef("klaudiosinani", "signale"))).resolves.toBeNull();
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenARequestThatFailed_whenReading_thenTheFigureIsAbsent", async () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "token");
        respondWith(null, 403);

        await expect(underTest.clones(new RepositoryRef("klaudiosinani", "signale"))).resolves.toBeNull();
    });
});

describe("RepositoryGitHubService.documents", () => {
    it("givenATreeOfFiles_whenAsked_thenOnlyTheMarkdownOfAReaderIsKept", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse({
                tree: [
                    { path: "index.js", type: "blob" },
                    { path: "media/shot.png", type: "blob" },
                    { path: "docs", type: "tree" },
                    { path: "docs/readme.JP.md", type: "blob" },
                    { path: "code-of-conduct.md", type: "blob" },
                    { path: "license.md", type: "blob" },
                ],
            })
        );

        const documents: RepositoryDocument[] = await underTest.documents(
            new RepositoryRef("klaudiosinani", "taskbook")
        );

        expect(documents.map(({ slug }: RepositoryDocument) => slug)).toStrictEqual(["ja", "code-of-conduct"]);
    });

    it("givenAFolderNamedLikeAMarkdownFile_whenAsked_thenItIsNotADocument", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse({ tree: [{ path: "code-of-conduct.md", type: "tree" }] })
        );

        expect(await underTest.documents(new RepositoryRef("a", "b"))).toStrictEqual([]);
    });

    it("givenGitHubAnswersWithNoTree_whenAsked_thenThereAreNoDocuments", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}));

        expect(await underTest.documents(new RepositoryRef("a", "b"))).toStrictEqual([]);
    });

    it("givenTheRequestFails_whenAsked_thenThereAreNoDocuments", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("no", { status: 404 }));

        expect(await underTest.documents(new RepositoryRef("a", "b"))).toStrictEqual([]);
    });
});

describe("RepositoryGitHubService.markdown (readme)", () => {
    it("givenAReadme_whenReading_thenTheMarkdownIsGivenAsWritten", async () => {
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(new Response("## Install\n", { status: 200 }));

        const markdown: string | null = await underTest.markdown(new RepositoryRef("klaudiosinani", "signale"));

        expect(markdown).toBe("## Install\n");
        expect(sent(fetched).url).toBe("https://api.github.com/repos/klaudiosinani/signale/readme");
        expect(sent(fetched).headers.get("Accept")).toBe("application/vnd.github.raw");
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

describe("RepositoryGitHubService.markdown (document text)", () => {
    it("givenGitHubHasTheFile_whenAsked_thenItGivesTheMarkdown", async () => {
        const fetched: MockInstance<typeof fetch> = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(new Response("# Title", { status: 200 }));

        const markdown: string | null = await underTest.markdown(
            new RepositoryRef("klaudiosinani", "signale"),
            "docs/readme.DE.md"
        );

        expect(markdown).toBe("# Title");
        expect(sent(fetched).url).toBe("https://api.github.com/repos/klaudiosinani/signale/contents/docs/readme.DE.md");
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

describe("RepositoryGitHubService.totals", () => {
    const counted = (
        openIssues: number,
        closedIssues: number,
        openPullRequests: number,
        mergedPullRequests: number,
        commits: number | null = 128
    ): unknown => ({
        commits: commits === null ? null : { target: { history: { totalCount: commits } } },
        openIssues: { totalCount: openIssues },
        closedIssues: { totalCount: closedIssues },
        openPullRequests: { totalCount: openPullRequests },
        mergedPullRequests: { totalCount: mergedPullRequests },
    });

    const authenticated = (): void => {
        vi.stubEnv("GITHUB_TOKEN", "a-token");
    };

    const answering = (data: unknown): string[] => {
        const documents: string[] = [];

        vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
            documents.push(JSON.parse(await (input as Request).text()).query);
            return jsonResponse({ data });
        });

        return documents;
    };

    it("givenNoToken_whenGathering_thenNothingIsReturnedAndNoRequestIsMade", async () => {
        vi.stubEnv("GITHUB_TOKEN", "");
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "");
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", ["signale"]);

        expect(totals.size).toBe(0);
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenNoRepositories_whenGathering_thenNoRequestIsMade", async () => {
        authenticated();
        const fetched: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", []);

        expect(totals.size).toBe(0);
        expect(fetched).not.toHaveBeenCalled();
    });

    it("givenSeveralRepositories_whenGathering_thenOneRequestCarriesThemAll", async () => {
        authenticated();
        const documents: string[] = answering({
            r0: counted(29, 42, 10, 43),
            r1: counted(1, 2, 3, 4),
        });

        await underTest.totals("klaudiosinani", ["signale", "taskbook"]);

        expect(documents).toHaveLength(1);
        expect(documents[0]).toContain('r0: repository(owner: "klaudiosinani", name: "signale")');
        expect(documents[0]).toContain('r1: repository(owner: "klaudiosinani", name: "taskbook")');
    });

    it("givenCounts_whenGathering_thenEachLandsOnItsOwnRepository", async () => {
        authenticated();
        answering({ r0: counted(29, 42, 10, 43), r1: counted(1, 2, 3, 4) });

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", ["signale", "taskbook"]);

        expect(totals.get("signale")).toEqual({
            commits: 128,
            openIssues: 29,
            closedIssues: 42,
            openPullRequests: 10,
            mergedPullRequests: 43,
        });
        expect(totals.get("taskbook")?.mergedPullRequests).toBe(4);
    });

    it("givenACommitCount_whenGathering_thenItComesFromTheDefaultBranch", async () => {
        authenticated();
        const documents: string[] = answering({ r0: counted(0, 0, 0, 0, 4_210) });

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", ["signale"]);

        expect(totals.get("signale")?.commits).toBe(4_210);
        expect(documents[0]).toContain("defaultBranchRef");
    });

    it("givenARepositoryWithNoCommit_whenGathering_thenTheCountIsNothing", async () => {
        authenticated();
        answering({ r0: counted(0, 0, 0, 0, null) });

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", ["signale"]);

        expect(totals.get("signale")?.commits).toBe(0);
    });

    it("givenNamesThatAreNotLegalAliases_whenGathering_thenPositionalAliasesAreUsed", async () => {
        authenticated();
        const documents: string[] = answering({ r0: counted(0, 0, 0, 0) });

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", [
            "klaudiosinani.github.io",
        ]);

        expect(documents[0]).toContain("r0: repository");
        expect(totals.has("klaudiosinani.github.io")).toBe(true);
    });

    it("givenOneRepositoryMissing_whenGathering_thenTheOthersAreStillKept", async () => {
        authenticated();
        answering({ r0: null, r1: counted(1, 2, 3, 4) });

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", ["gone", "taskbook"]);

        expect(totals.has("gone")).toBe(false);
        expect(totals.has("taskbook")).toBe(true);
    });

    it("givenMoreRepositoriesThanOneBatchHolds_whenGathering_thenTheyAreSplitAcrossDocuments", async () => {
        authenticated();
        const slugs: string[] = Array.from({ length: 30 }, (_unused: unknown, index: number) => `repo-${index}`);
        const documents: string[] = answering(
            Object.fromEntries(
                Array.from({ length: 25 }, (_unused: unknown, index: number) => [`r${index}`, counted(0, 0, 0, 0)])
            )
        );

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", slugs);

        expect(documents).toHaveLength(2);
        expect(totals.size).toBeGreaterThan(0);
    });

    it("givenGraphQlRefuses_whenGathering_thenNothingIsReturnedRatherThanThrowing", async () => {
        authenticated();
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("bad credentials", { status: 401 }));

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", ["signale"]);

        expect(totals.size).toBe(0);
    });

    it("givenAnErrorsOnlyBody_whenGathering_thenNothingIsReturned", async () => {
        authenticated();
        vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ errors: [{ message: "rate limited" }] }));

        const totals: Map<string, RepositoryTotals> = await underTest.totals("klaudiosinani", ["signale"]);

        expect(totals.size).toBe(0);
    });
});
