import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { GitHubActivityDataProvider } from "@app/feature/activity/service/GitHubActivityDataProvider";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { RetrievalService } from "@app/infrastructure/RetrievalService";

import type { ActivityData } from "@app/feature/activity/service/ActivityData";
import type { CommitData } from "@app/feature/activity/service/CommitData";
import type { ReleaseData } from "@app/feature/activity/service/ReleaseData";
const repository = (name: string, latestPush: string): RepositoryData => ({
    name,
    description: "",
    url: `https://github.com/user/${name}`,
    stars: 0,
    forks: 0,
    language: null,
    latestUpdate: "2019-01-01T00:00:00Z",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestPush,
});

const repositories = (...entries: RepositoryData[]): RetrievalService<RepositoryData> => ({
    retrieve: async () => entries,
});

const commit = (sha: string, date: string, message: string = "Subject\n\nBody") => ({
    sha,
    html_url: `https://github.com/user/repo/commit/${sha}`,
    commit: { message, author: { date } },
});

const release = (tag: string, date: string | null, over: object = {}) => ({
    tag_name: tag,
    name: tag,
    html_url: `https://github.com/user/repo/releases/tag/${tag}`,
    published_at: date,
    draft: false,
    prerelease: false,
    ...over,
});

const respond = (routes: Record<string, unknown>) =>
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input: string | URL | Request) => {
        const url: string = String(input);
        const key: string | undefined = Object.keys(routes).find((k: string) => url.includes(k));
        return new Response(JSON.stringify(key ? routes[key] : []), {
            status: 200,
        });
    });

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("GitHubActivityDataProvider.provide", () => {
    it("givenAPushDate_whenProviding_thenRepositoriesAreChosenByItNotByLatestUpdate", async () => {
        const fetchSpy: MockInstance<typeof fetch> = respond({});
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("stale", "2019-01-01T00:00:00Z"), repository("active", "2026-08-01T00:00:00Z"))
        );

        await underTest.provide("user");

        const called: string[] = fetchSpy.mock.calls.map(
            ([url]: [input: string | URL | Request, init?: RequestInit | undefined]) => String(url)
        );
        expect(called.some((url: string) => url.includes("/active/"))).toBe(true);
    });

    it("givenACommit_whenProviding_thenOnlyItsSubjectLineIsKept", async () => {
        respond({ "/commits": [commit("abc1234", "2026-08-01T00:00:00Z")] });
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        const { commits } = await underTest.provide("user");

        expect(commits[0].message).toBe("Subject");
        expect(commits[0].repository).toBe("repo");
    });

    it("givenSeveralCommits_whenProviding_thenTheNewestComesFirst", async () => {
        respond({
            "/commits": [commit("old0000", "2025-01-01T00:00:00Z"), commit("new0000", "2026-08-01T00:00:00Z")],
        });
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        const { commits } = await underTest.provide("user");

        expect(commits.map(({ sha }: CommitData) => sha)).toEqual(["new0000", "old0000"]);
    });

    it("givenSeveralReleases_whenProviding_thenTheNewestComesFirst", async () => {
        respond({
            "/releases": [release("v1.0.0", "2025-01-01T00:00:00Z"), release("v2.0.0", "2026-08-01T00:00:00Z")],
        });
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        const { releases } = await underTest.provide("user");

        expect(releases.map(({ tag }: ReleaseData) => tag)).toEqual(["v2.0.0", "v1.0.0"]);
    });

    it("givenADraftRelease_whenProviding_thenItIsExcluded", async () => {
        respond({
            "/releases": [release("v1.0.0", "2026-08-01T00:00:00Z"), release("v2.0.0", null, { draft: true })],
        });
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        const { releases } = await underTest.provide("user");

        expect(releases.map(({ tag }: ReleaseData) => tag)).toEqual(["v1.0.0"]);
    });

    it("givenARejectedRequest_whenProviding_thenTheBuildStillGetsAnEmptyFeed", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 403 }));
        vi.spyOn(console, "warn").mockImplementation(() => {});
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        const activity: ActivityData = await underTest.provide("user");

        expect(activity).toEqual({ commits: [], releases: [] });
    });

    it("givenANetworkError_whenProviding_thenItIsSwallowed", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
        vi.spyOn(console, "warn").mockImplementation(() => {});
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        const activity: ActivityData = await underTest.provide("user");

        expect(activity).toEqual({ commits: [], releases: [] });
    });

    it("givenNoAuthorDate_whenProviding_thenTheCommitStillMaps", async () => {
        respond({
            "/commits": [{ ...commit("abc1234", ""), commit: { message: "M", author: null } }],
        });
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        const { commits } = await underTest.provide("user");

        expect(commits[0].committedAt).toBe("");
    });

    it("givenAnUnnamedRelease_whenProviding_thenTheTagIsUsedAsItsName", async () => {
        respond({
            "/releases": [release("v9.9.9", "2026-08-01T00:00:00Z", { name: null })],
        });
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        const { releases } = await underTest.provide("user");

        expect(releases[0].name).toBe("v9.9.9");
    });

    it("givenTheApiVersionHeader_whenProviding_thenEveryRequestPinsIt", async () => {
        const fetchSpy: MockInstance<typeof fetch> = respond({});
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        await underTest.provide("user");

        for (const [, init] of fetchSpy.mock.calls) {
            expect((init as RequestInit).headers).toMatchObject({
                "X-GitHub-Api-Version": "2022-11-28",
            });
        }
    });

    it("givenAToken_whenProviding_thenRequestsAreAuthenticated", async () => {
        vi.stubEnv("GITHUB_TOKEN", "secret-token");
        const fetchSpy: MockInstance<typeof fetch> = respond({});
        const underTest: GitHubActivityDataProvider = new GitHubActivityDataProvider(
            repositories(repository("repo", "2026-08-01T00:00:00Z"))
        );

        await underTest.provide("user");

        for (const [, init] of fetchSpy.mock.calls) {
            expect((init as RequestInit).headers).toMatchObject({
                Authorization: "Bearer secret-token",
            });
        }
    });
});
